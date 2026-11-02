// Launcher kiểm thử, không sửa code web hoặc .env. Chỉ dùng instance đã xác minh.
const path = require('node:path');
const fs = require('node:fs');
const project = process.env.TECHZONE_PROJECT || 'D:/Duong/Đồ án cơ sở/TechShop';
const fromProject = file => require(path.join(project, file));
const output = path.join(__dirname, '..', 'Minh-chung', 'UI');
async function main() {
  const pool = await fromProject('scripts/test-db-config.cjs').openTestPool();
  const dotenv = fromProject('node_modules/dotenv');
  const config = dotenv.parse(fs.readFileSync(path.join(project, '.env.test.local')));
  // Phòng vệ cả với repository mặc định: getDatabaseOptions đọc các biến này khi tạo pool.
  for (const key of ['HOST','PORT','USER','PASSWORD','NAME']) process.env['DB_'+key]=config['TEST_DB_'+key];
  fs.mkdirSync(output, { recursive: true });
  const manifestFile = path.join(output, 'fixture.json');
  let fixture;
  if (fs.existsSync(manifestFile)) {
    fixture=JSON.parse(fs.readFileSync(manifestFile,'utf8'));
    const [[row]]=await pool.execute('SELECT COUNT(*) n FROM products WHERE product_id IN (?,?) AND brand=?', [...fixture.products,fixture.brand]);
    if(Number(row.n)!==2) throw new Error('FIXTURE_CHANGED_REVIEW_REQUIRED');
  } else {
    fixture={tag:'UI-'+Date.now(),brand:'TechZone UI Test',products:[],variants:[]};
    const c=await pool.getConnection();
    try {
      await c.beginTransaction();
      const [cat]=await c.execute('INSERT INTO categories(category_name) VALUES (?)',[fixture.tag]);
      fixture.category=cat.insertId;
      for(const [name,prices] of [['Tai nghe UI Test',[100000,200000]],['Chuot UI Test',[50000]]]) {
        const [p]=await c.execute('INSERT INTO products(category_id,product_name,brand,description) VALUES (?,?,?,?)',[fixture.category,name,fixture.brand,'Fixture kiểm thử giao diện, không phải sản phẩm thật.']);
        fixture.products.push(p.insertId);
        for(let i=0;i<prices.length;i++) {
          const [v]=await c.execute('INSERT INTO product_variants(product_id,sku,variant_name,price,stock) VALUES (?,?,?,?,?)',[p.insertId,fixture.tag+'-'+p.insertId+'-'+i,i?'Trang Test':'Den Test',prices[i],5]);
          fixture.variants.push(v.insertId);
        }
      }
      await c.commit();
      fs.writeFileSync(manifestFile,JSON.stringify(fixture,null,2));
    } catch(e) {await c.rollback();throw e;} finally {c.release();}
  }
  const specs={catalog:'Catalog',user:'User',address:'Address',cart:'Cart',checkout:'Checkout',order:'Order',review:'Review','admin-product':'AdminProduct','admin-order':'AdminOrder','admin-category':'AdminCategory',coupon:'Coupon'};
  const dependencies={};
  for(const [file,name] of Object.entries(specs)) {
    const key=name[0].toLowerCase()+name.slice(1)+'Repository';
    dependencies[key]=fromProject('src/repositories/'+file+'-repository.js')['create'+name+'Repository'](pool);
  }
  // Không có bảng quảng cáo trong schema test; phần này ngoài phạm vi UI đang kiểm tra.
  dependencies.advertisementRepository={home:async()=>({hero:[],promotion:[]}),image:async()=>null};
  const app=fromProject('src/app.js').createApp(dependencies);
  const port=process.env.TECHZONE_TEST_PORT===undefined?0:Number(process.env.TECHZONE_TEST_PORT);
  if(!Number.isInteger(port)||port<0||port>65535)throw new Error('INVALID_TEST_PORT');
  const server=app.listen(port,'127.0.0.1',()=>{
    const url='http://127.0.0.1:'+server.address().port;
    fs.writeFileSync(path.join(output,'server.json'),JSON.stringify({url,pid:process.pid,database:'techshop_test',fixture:fixture.tag,autoExpiryEnabled:false},null,2));
    console.log('TEST_UI '+url);
    console.log('Fixture category '+fixture.category+'; products '+fixture.products.join(','));
  });
  for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.closeAllConnections();server.close(async()=>{await pool.end();process.exit(0);});});
}
main().catch(()=>{console.error('TEST_UI_START_FAILED: kiểm tra cấu hình/môi trường test; không chuyển sang database website.');process.exitCode=1;});
