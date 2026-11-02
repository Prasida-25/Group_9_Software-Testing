// Test harness riêng, chỉ ghi fixture trên instance test đã xác minh.
const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const load=f=>require(path.join(project,f));
const folder=path.join(__dirname,'..','Minh-chung','UI');
const manifest=path.join(folder,'auto-fixture.json');
async function main(){
 const pool=await load('scripts/test-db-config.cjs').openTestPool();
 try{
  if(process.argv.includes('--prepare')){
   assert(!fs.existsSync(manifest),'Fixture đã có; không tạo lặp.');
   const [[user]]=await pool.execute('SELECT full_name,role FROM users WHERE user_id=?',[875]);
   assert.equal(user?.full_name,'Khach UI Test A');assert.equal(user.role,'user');
   const [[cartCount]]=await pool.execute('SELECT COUNT(*) n FROM cart_items WHERE user_id=?',[875]);assert.equal(Number(cartCount.n),0);
   const [[variant]]=await pool.execute('SELECT stock FROM product_variants WHERE variant_id=? AND product_id=?',[1014,546]);assert(variant.stock>=2);
   const f={userId:875,variantId:1014,stockBefore:variant.stock,orders:[],scope:'Only tracked order IDs, not other expired test orders',preparationComplete:false};
   fs.writeFileSync(manifest,JSON.stringify(f,null,2));
   const cart=load('src/services/cart-service').createCartService(load('src/repositories/cart-repository').createCartRepository(pool));
   const checkout=load('src/services/checkout-service').createCheckoutService(load('src/repositories/checkout-repository').createCheckoutRepository(pool));
   for(const ageHours of [73,71]){
    const item=await cart.change(f.userId,'add',{variant_id:String(f.variantId),quantity:'1'});
    const quote=await checkout.preview(f.userId,'887',String(item),undefined,'cod');
    const id=await checkout.place(f.userId,{checkout_token:quote.token,address_id:'887',confirm:'1',payment_method:'cod'});
    f.orders.push({orderId:id,ageHours});fs.writeFileSync(manifest,JSON.stringify(f,null,2));
    // Chỉ điều chỉnh tuổi đơn fixture; không đổi đồng hồ hệ điều hành hoặc đơn cũ.
    await pool.execute('UPDATE orders SET created_at=TIMESTAMPADD(HOUR,?,CURRENT_TIMESTAMP) WHERE order_id=? AND user_id=?',[-ageHours,id,f.userId]);
   }
   f.preparationComplete=true;fs.writeFileSync(manifest,JSON.stringify(f,null,2));
   console.log('AUTO_FIXTURE_READY',JSON.stringify(f));return;
  }
  assert(process.argv.includes('--run'),'Dùng --prepare hoặc --run.');
  const f=JSON.parse(fs.readFileSync(manifest,'utf8'));assert(f.preparationComplete);
  const ids=f.orders.map(o=>o.orderId);assert.equal(ids.length,2);
  const {createAdminOrderRepository,ADMIN_ORDER_SQL}=load('src/repositories/admin-order-repository');
  const snapshot=async()=>{
   const [orders]=await pool.execute('SELECT order_id,status,payment_status,(created_at<=CURRENT_TIMESTAMP-INTERVAL 72 HOUR) AS expired FROM orders WHERE order_id IN (?,?) ORDER BY order_id',ids);
   const [[v]]=await pool.execute('SELECT stock FROM product_variants WHERE variant_id=?',[f.variantId]);return {orders,stock:v.stock};
  };
  // Giữ nguyên predicate hết hạn, sort và LIMIT của production, thêm scope fixture.
  // Các transaction/khóa/hoàn kho vẫn chạy repository thật trên MySQL thật.
  const scoped={getConnection:()=>pool.getConnection(),execute:(sql,params)=>sql===ADMIN_ORDER_SQL.expired
   ?pool.execute(sql.replace('ORDER BY order_id LIMIT 50','AND order_id IN (?,?) ORDER BY order_id LIMIT 50'),[...params,...ids])
   :pool.execute(sql,params)};
  const service=load('src/services/admin-order-service').createAdminOrderService(createAdminOrderRepository(scoped));
  const result={checkedAt:new Date().toISOString(),database:'techshop_test',scope:f.scope,before:await snapshot()};
  result.first=await service.expireBatch();result.afterFirst=await snapshot();
  const expiredId=f.orders.find(o=>o.ageHours===73).orderId;
  const recentId=f.orders.find(o=>o.ageHours===71).orderId;
  assert.equal(result.afterFirst.orders.find(o=>o.order_id===expiredId).status,'cancelled');
  assert.equal(result.afterFirst.orders.find(o=>o.order_id===recentId).status,'pending');
  assert.equal(result.afterFirst.stock,f.stockBefore-1);
  result.second=await service.expireBatch();result.afterSecond=await snapshot();
  assert.deepEqual(result.afterSecond,result.afterFirst);
  assert.equal(result.first.cancelled,result.before.orders.find(o=>o.order_id===expiredId).status==='pending'?1:0);
  result.passed=true;
  result.limits=['Scoped SQL selection for fixture IDs only','Direct expireBatch calls; 60-second scheduler not tested','Ages 71h and 73h; exact 72h boundary not tested','Not a concurrent admin/auto cancellation test'];
  const output=path.join(folder,'auto-result-'+Date.now()+'.json');fs.writeFileSync(output,JSON.stringify(result,null,2));
  console.log('BEFORE',JSON.stringify(result.before));console.log('FIRST_SCAN',JSON.stringify(result.first));
  console.log('AFTER_FIRST',JSON.stringify(result.afterFirst));console.log('SECOND_SCAN',JSON.stringify(result.second));
  console.log('AFTER_SECOND',JSON.stringify(result.afterSecond));console.log('AUTO_TEST_PASS; scoped MySQL test; scheduler and exact 72h boundary not tested');
 }finally{await pool.end();}
}
main().catch(()=>{console.error('AUTO_TEST_FAILED: kiểm tra fixture và môi trường test; không chạy trên database website.');process.exitCode=1;});
