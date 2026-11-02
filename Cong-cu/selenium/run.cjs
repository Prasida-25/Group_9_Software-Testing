const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');const assert=require('node:assert/strict');
const {Builder,By,Key,until}=require('selenium-webdriver');const chrome=require('selenium-webdriver/chrome');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';const load=f=>require(path.join(project,f));
const base='http://127.0.0.1:56327';const output=path.join(__dirname,'..','..','Minh-chung','Selenium','run-'+new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(output,{recursive:true});const report={started:new Date().toISOString(),base,node:process.version,selenium:require('selenium-webdriver/package.json').version,headless:process.env.SELENIUM_VISIBLE!=='1',results:[]};
const log=(...args)=>{console.log(...args);fs.appendFileSync(path.join(output,'console.txt'),args.map(String).join(' ')+'\n');};
const norm=s=>s.replace(/\s/g,'');
async function main(){
 const pool=await load('scripts/test-db-config.cjs').openTestPool();
 try{
  const server=JSON.parse(fs.readFileSync(path.join(__dirname,'..','..','Minh-chung','UI','server.json'),'utf8'));assert.equal(server.url,base);assert.equal(server.database,'techshop_test');
  assert.equal((await fetch(base+'/login')).status,200);
  const [[variant]]=await pool.execute('SELECT variant_id,product_id,price,stock FROM product_variants WHERE variant_id=? AND product_id=?',[1012,545]);
  assert(variant&&variant.stock>=3);assert.equal(String(variant.price),'100000.00');
  const stockBefore=variant.stock;const argon2=load('node_modules/argon2');
  const password='Test1'+crypto.randomBytes(20).toString('hex');const hash=await argon2.hash(password,{type:argon2.argon2id});
  const users=load('src/repositories/user-repository').createUserRepository(pool);
  async function execute(id,name,needsUser,fn){
   const r={id,name,status:'RUNNING',cleanup:'NOT_STARTED'};report.results.push(r);let driver,user;
   try{
    if(needsUser){const phone='09'+String(crypto.randomInt(10000000,100000000));const userId=await users.create({full_name:'SEL-'+id+'-'+Date.now(),phone},hash);user={id:userId,phone};r.fixtureUserId=userId;}
    const options=new chrome.Options().setChromeBinaryPath('C:/Program Files/Google/Chrome/Application/chrome.exe').addArguments('--window-size=1366,900','--disable-gpu');
    if(report.headless)options.addArguments('--headless=new');
    let builder=new Builder().forBrowser('chrome').setChromeOptions(options);
    const cached='C:/Users/Admin/.cache/selenium/chromedriver/win64/156.0.8078.47/chromedriver.exe';
    if(fs.existsSync(cached))builder=builder.setChromeService(new chrome.ServiceBuilder(cached));
    driver=await builder.build();await driver.manage().setTimeouts({implicit:0,pageLoad:20000,script:10000});
    if(!report.browser){const caps=await driver.getCapabilities();report.browser={name:caps.get('browserName'),version:caps.get('browserVersion'),chromeDriver:caps.get('chrome')?.chromedriverVersion};}
    const find=selector=>driver.wait(until.elementLocated(By.css(selector)),10000);
    const text=async selector=>(await find(selector)).getText();
    const login=async(wrong=false)=>{
     await driver.get(base+'/login?returnTo=%2Fcart');await (await find('[name="phone"]')).sendKeys(user.phone);
     await (await find('[name="password"]')).sendKeys(wrong?password+'wrong':password);
     const oldForm=await find('form[action="/login"]');
     await (await find('form[action="/login"] button[type="submit"]')).click();
     await driver.wait(until.stalenessOf(oldForm),10000);
     if(!wrong)await driver.wait(until.urlContains('/cart'),10000);
     else await driver.wait(async()=>{try{return(await driver.findElement(By.css('.account-error[role="alert"]')).getText())==='Số điện thoại hoặc mật khẩu không đúng.';}catch{return false;}},10000);
    };
    await fn({driver,find,text,login,user});
    r.status='PASS';r.url=await driver.getCurrentUrl();
   }catch(e){r.status='FAIL';r.errorName=e.name;r.error=String(e.message).split(password).join('[redacted]').split(user?.phone||'__NO_PHONE__').join('[test phone]');}
   finally{
    if(driver){try{r.screenshot=id+'.png';fs.writeFileSync(path.join(output,r.screenshot),await driver.takeScreenshot(),'base64');}catch{r.screenshotError=true;}try{await driver.quit();}catch{r.browserCloseError=true;}}
    if(user){const c=await pool.getConnection();try{await c.beginTransaction();await c.execute('DELETE FROM cart_items WHERE user_id=?',[user.id]);await c.execute('DELETE FROM users WHERE user_id=? AND full_name LIKE ?',[user.id,'SEL-'+id+'-%']);await c.commit();const [[n]]=await pool.execute('SELECT COUNT(*) n FROM users WHERE user_id=?',[user.id]);assert.equal(Number(n.n),0);r.cleanup='PASS';}catch(e){await c.rollback();r.cleanup='FAIL';r.status='FAIL';}finally{c.release();}}
    else r.cleanup='NOT_APPLICABLE';
    log(id,r.status,name,'cleanup='+r.cleanup);
   }
  }
  await execute('SEL-01','Đăng nhập đúng và mở giỏ trống',true,async({login,text})=>{await login();assert.match(await text('.cart-empty-state'),/Giỏ hàng của bạn đang trống/);});
  await execute('SEL-02','Đăng nhập sai hiển thị lỗi chung',true,async({login,text,driver})=>{await login(true);assert.equal(await text('.account-error[role="alert"]'),'Số điện thoại hoặc mật khẩu không đúng.');assert.match(await driver.getCurrentUrl(),/\/login/);});
  await execute('SEL-03','Tìm kiếm bằng ô tìm trên giao diện',false,async({driver,find,text})=>{await driver.get(base+'/products?category_id=462');const input=await find('form[role="search"] [name="q"]');await input.sendKeys('Tai nghe UI Test',Key.ENTER);await driver.wait(until.urlContains('/products/search'),10000);assert.match(await text('body'),/Tai nghe UI Test/);const cards=await driver.findElements(By.css('a.catalog-card'));assert(cards.length>=1);for(const card of cards)assert.match(await card.getText(),/Tai nghe UI Test/);});
  async function add({driver,find,login}){await login();await driver.get(base+'/products/545?variant=1012');await(await find('button.product-add-button, form[action="/cart/items"] button[type="submit"]')).click();await driver.wait(until.urlContains('/cart'),10000);await find('[data-cart-row]');}
  await execute('SEL-04','Thêm sản phẩm vào giỏ',true,async ctx=>{await add(ctx);const rows=await ctx.driver.findElements(By.css('[data-cart-row]'));assert.equal(rows.length,1);assert.equal(await(await ctx.find('[data-cart-row] input[name="quantity"]')).getAttribute('value'),'1');assert.match(norm(await ctx.text('.cart-line-total')),/100\.000/);});
  await execute('SEL-05','Cập nhật số lượng và giữ sau tải lại',true,async ctx=>{await add(ctx);await(await ctx.find('[data-cart-row] button[data-step="1"]')).click();await ctx.driver.wait(async()=>{try{return await(await ctx.find('[data-cart-row] input[name="quantity"]')).getAttribute('value')==='2'&&norm(await ctx.text('.cart-line-total')).includes('200.000');}catch{return false;}},10000);await ctx.driver.navigate().refresh();assert.equal(await(await ctx.find('[data-cart-row] input[name="quantity"]')).getAttribute('value'),'2');assert.match(norm(await ctx.text('.cart-line-total')),/200\.000/);});
  await execute('SEL-06','Đăng xuất và không truy cập được giỏ',true,async({driver,find,login,text})=>{await login();await driver.get(base+'/products/545');await(await find('form[action="/logout"] button')).click();await driver.wait(until.urlContains('/login?loggedout=1'),10000);await driver.get(base+'/cart');await driver.wait(until.urlContains('/login?returnTo=%2Fcart'),10000);assert.equal((await driver.findElements(By.css('.cart-screen'))).length,0);assert.match(await text('body'),/Đăng nhập/);});
  const [[after]]=await pool.execute('SELECT stock FROM product_variants WHERE variant_id=?',[1012]);report.stockBefore=stockBefore;report.stockAfter=after.stock;report.stockUnchanged=stockBefore===after.stock;
  report.passed=report.results.filter(r=>r.status==='PASS').length;report.total=report.results.length;report.finished=new Date().toISOString();
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
  fs.writeFileSync(path.join(output,'report.html'),'<!doctype html><meta charset="utf-8"><title>Selenium TechZone</title><style>body{font:16px Arial;max-width:1100px;margin:30px auto}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px}img{max-width:100%}</style><h1>Kết quả Selenium TechZone</h1><p>'+report.passed+'/'+report.total+' Pass; Chrome '+esc(report.browser?.version)+'; headless='+report.headless+'</p><table><tr><th>ID</th><th>Scenario</th><th>Kết quả</th><th>Fixture cleanup</th></tr>'+report.results.map(r=>'<tr><td>'+r.id+'</td><td>'+esc(r.name)+'</td><td>'+r.status+'</td><td>'+r.cleanup+'</td></tr>').join('')+'</table>'+report.results.map(r=>'<h2>'+r.id+' '+esc(r.name)+'</h2>'+(r.screenshot?'<img src="'+r.screenshot+'">':'')+(r.error?'<p>'+esc(r.error)+'</p>':'')).join(''));
  fs.writeFileSync(path.join(path.dirname(output),'latest.json'),JSON.stringify({output},null,2));
  log('SELENIUM_SUMMARY '+report.passed+'/'+report.total+'; stock unchanged='+report.stockUnchanged);log('EVIDENCE '+output);
  if(report.passed!==report.total||!report.stockUnchanged)process.exitCode=1;
 }finally{await pool.end();}
}
main().catch(()=>{log('SELENIUM_SETUP_FAILED; kiểm tra driver, server và môi trường test.');process.exitCode=1;});
