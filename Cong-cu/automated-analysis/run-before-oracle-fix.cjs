const fs=require('node:fs');const path=require('node:path');const crypto=require('node:crypto');
const assert=require('node:assert/strict');const fc=require('fast-check');const {ESLint}=require('eslint');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const load=f=>require(path.join(project,f));
const {quote}=load('src/utils/checkout');const {positiveInteger}=load('src/utils/cart-validation');
const {variantProblem}=load('src/services/cart-service');const {parseCatalogQuery}=load('src/utils/catalog-query');
const files=['src/utils/cart-validation.js','src/utils/checkout.js','src/services/cart-service.js','src/utils/catalog-query.js','src/utils/account-validation.js'];
const hash=f=>crypto.createHash('sha256').update(fs.readFileSync(path.join(project,f))).digest('hex');
const before=Object.fromEntries(files.map(f=>[f,hash(f)]));
const output=path.join(__dirname,'..','..','Minh-chung','Tu-dong','run-'+new Date().toISOString().replace(/[:.]/g,'-'));fs.mkdirSync(output,{recursive:true});
const seed=20261102,numRuns=1000;
const report={node:process.version,fastCheck:require('fast-check/package.json').version,eslint:ESLint.version,seed,numRuns,started:new Date().toISOString(),checks:[]};
// Tiền sinh theo đơn vị0.01đ, tránh dùng chính priceUnits làm oracle cho quote.
const decimal=c=>(Math.floor(c/100))+'.'+String(c%100).padStart(2,'0');
const cents=s=>{const [a,b]=s.split('.');return BigInt(a)*100n+BigInt(b);};
const line=(p,q,id=1)=>({product_id:id,variant_id:id,valid_variant:1,stock:120,price:decimal(p),quantity:q,product_name:'Generated fixture',variant_name:'Test',sku:'GEN-'+id});
const pair=fc.record({price:fc.integer({min:1,max:1000000}),quantity:fc.integer({min:1,max:99})});
const cart=fc.array(pair,{minLength:1,maxLength:8});
function check(id,kind,description,property){
 const r=fc.check(property,{seed,numRuns,endOnFailure:false});
 const row={id,kind,description,passed:!r.failed&&!r.interrupted,numRuns:r.numRuns,numSkips:r.numSkips,numShrinks:r.numShrinks,seed:r.seed,counterexample:r.counterexample,counterexamplePath:r.counterexamplePath,error:r.errorInstance?.message};
 report.checks.push(row);console.log(id,row.passed?'PASS':'FAIL','runs='+row.numRuns,'seed='+row.seed);
}
async function main(){
 check('PBT-01','property','Subtotal, phí và tổng theo yêu cầu; input không bị sửa',fc.property(cart,pairs=>{
  const items=pairs.map((p,i)=>line(p.price,p.quantity,i+1)),original=structuredClone(items);const r=quote(items);
  const subtotal=pairs.reduce((n,p)=>n+BigInt(p.price)*BigInt(p.quantity),0n);
  assert.equal(cents(r.subtotal),subtotal);const shipping=subtotal>=30000000n?0n:3000000n;
  assert.equal(cents(r.shipping),shipping);assert.equal(cents(r.total),subtotal+shipping);assert.deepEqual(items,original);
 }));
 check('PBT-02','metamorphic','Đảo thứ tự dòng không đổi tiền hàng/phí/tổng',fc.property(cart,pairs=>{
  const items=pairs.map((p,i)=>line(p.price,p.quantity,i+1));const a=quote(items),b=quote([...items].reverse());
  for(const k of ['subtotal','shipping','total'])assert.equal(a[k],b[k]);
 }));
 check('PBT-03','metamorphic','Tăng quantity hợp lệ tăng subtotal đúng đơn giá, không khẳng định total luôn tăng',fc.property(fc.integer({min:1,max:1000000}),fc.integer({min:1,max:98}),(p,q)=>{
  const a=quote([line(p,q)]),b=quote([line(p,q+1)]);assert.equal(cents(b.subtotal)-cents(a.subtotal),BigInt(p));
 }));
 check('PBT-04','metamorphic','Tách quantity thành hai dòng giữ nguyên tiền hàng/phí/tổng',fc.property(fc.integer({min:1,max:1000000}),fc.integer({min:2,max:99}),(p,q)=>{
  const a=quote([line(p,q)]),b=quote([line(p,1),line(p,q-1)]);
  for(const k of ['subtotal','shipping','total'])assert.equal(a[k],b[k]);
 }));
 check('PBT-05','property','quantity trong1..99 và không vượt kho được validator chấp nhận',fc.property(fc.integer({min:1,max:99}),q=>{
  assert.equal(positiveInteger(String(q),99),q);assert.equal(variantProblem(line(10000,q),q),'');
 }));
 check('PBT-06','property','quantity lớn hơn kho phải bị từ chối tại variantProblem',fc.property(fc.integer({min:1,max:98}),stock=>{
  const item=line(10000,stock+1);item.stock=stock;assert.match(variantProblem(item,item.quantity),/Số lượng vượt tồn kho/);
 }));
 const invalidQuantity=fc.oneof(fc.integer({min:-100000,max:0}).map(String),fc.integer({min:100,max:100000}).map(String),fc.integer({min:1,max:99}).map(n=>n+'.5'),fc.constantFrom('',null,undefined,[],{},'1e1','+1','01','1 OR 1=1'));
 check('FUZZ-01','generative-negative','Đầu vào quantity sai phải trả lỗi nghiệp vụ422, không bỏ lọt',fc.property(invalidQuantity,value=>{
  assert.throws(()=>positiveInteger(value,99),{status:422});
 }));
 const invalidId=fc.oneof(fc.integer({min:-100000,max:0}).map(String),fc.integer({min:2147483648,max:3000000000}).map(String),fc.constantFrom('',null,undefined,[],{},'abc','1.2','1e1','01','1 OR 1=1'));
 check('FUZZ-02','generative-negative','Đầu vào ID sai phải trả lỗi nghiệp vụ422',fc.property(invalidId,value=>{
  assert.throws(()=>positiveInteger(value),{status:422});
 }));
 const invalidQuery=fc.oneof(fc.string({minLength:201,maxLength:260}).map(q=>({q})),fc.array(fc.string({maxLength:10}),{minLength:1,maxLength:3}).map(q=>({q})),fc.constantFrom({min_price:'-1'},{min_price:'200',max_price:'100'},{sort:'DROP'},{category_id:'0'},{q:'\u0000'},{'q[]':'test'}));
 check('FUZZ-03','generative-negative','Query ngoài hợp đồng phải bị từ chối400',fc.property(invalidQuery,q=>{
  assert.throws(()=>parseCatalogQuery(q),{status:400});
 }));
 const rules={'no-undef':'error','no-unreachable':'error','no-dupe-args':'error','no-dupe-keys':'error','no-constant-condition':'warn','no-unused-vars':['warn',{args:'none',caughtErrors:'none'}],'eqeqeq':'warn','no-eval':'error','no-implied-eval':'error','no-control-regex':'warn'};
 const eslint=new ESLint({overrideConfigFile:true,fix:false,overrideConfig:[{files:['**/*.js'],languageOptions:{ecmaVersion:'latest',sourceType:'commonjs',globals:{Buffer:'readonly',URLSearchParams:'readonly'}},rules}]});
 const staticResults=[];
 for(const file of files){
  const results=await eslint.lintText(fs.readFileSync(path.join(project,file),'utf8'),{filePath:path.join(__dirname,'scope',path.basename(file))});
  for(const result of results)staticResults.push({source:file,errorCount:result.errorCount,warningCount:result.warningCount,messages:result.messages});
 }
 fs.writeFileSync(path.join(output,'static-analysis.json'),JSON.stringify({rules,results:staticResults},null,2));
 report.static={files:files.length,errorCount:staticResults.reduce((n,r)=>n+r.errorCount,0),warningCount:staticResults.reduce((n,r)=>n+r.warningCount,0),rules};
 console.log('STATIC_ANALYSIS files='+report.static.files+' errors='+report.static.errorCount+' warnings='+report.static.warningCount+' fix=false');
 for(const r of staticResults)for(const m of r.messages)console.log(r.source+':'+m.line+':'+m.column,m.ruleId,m.message);
 report.originalSourceUnchanged=files.every(f=>before[f]===hash(f));report.finished=new Date().toISOString();
 report.successful=report.checks.filter(r=>r.passed).length;report.total=report.checks.length;
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(report,null,2));
 fs.writeFileSync(path.join(path.dirname(output),'latest.json'),JSON.stringify({output},null,2));
 console.log('GENERATIVE_SUMMARY '+report.successful+'/'+report.total+' properties; requested '+numRuns+' runs each');
 console.log('ORIGINAL_SOURCE_UNCHANGED '+report.originalSourceUnchanged);console.log('EVIDENCE '+output);
 if(report.successful!==report.total||!report.originalSourceUnchanged||report.static.errorCount)process.exitCode=1;
}
main().catch(()=>{console.error('ANALYSIS_RUN_ERROR; no website source changes requested');process.exitCode=1;});
