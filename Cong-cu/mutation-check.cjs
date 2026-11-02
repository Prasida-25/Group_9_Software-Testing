// Mutation có chủ đích trên bản sao tạm; không sửa project, không kết nối DB.
const fs=require('node:fs');const path=require('node:path');const os=require('node:os');const crypto=require('node:crypto');const {spawnSync}=require('node:child_process');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const extended=process.argv.includes('--extended');
const expectedTests=extended?29:28;
const testFile=path.join(__dirname,extended?'whitebox-extended.test.cjs':'whitebox.test.cjs');
const output=path.join(__dirname,'..','Minh-chung','Mutation');
const run=fs.mkdtempSync(path.join(os.tmpdir(),'techzone-mutation-'));
fs.mkdirSync(output,{recursive:true});
const tag=path.basename(run);const resultsDir=path.join(output,tag);fs.mkdirSync(resultsDir);
const originals={};
const mutations=[
 ['M01','src/utils/cart-validation.js','Number(value) > max','Number(value) >= max','Từ chối nhầm giá trị đúng max'],
 ['M02','src/utils/cart-validation.js','/^[1-9]\\d*$/','/^[0-9]\\d*$/','Cho phép quantity0 qua regex'],
 ['M03','src/services/cart-service.js','price <= 0n','price < 0n','Cho phép giá0'],
 ['M04','src/services/cart-service.js','quantity > Number(variant.stock)','quantity >= Number(variant.stock)','Từ chối nhầm quantity bằng kho'],
 ['M05','src/utils/checkout.js','subtotal >= 30000000n','subtotal > 30000000n','Sai biên miễn phí300.000đ'],
 ['M06','src/utils/checkout.js','? 0n : 3000000n','? 0n : 0n','Bỏ phí vận chuyển dưới ngưỡng'],
 ['M07','src/utils/checkout.js','unitPrice * BigInt(item.quantity)','unitPrice + BigInt(item.quantity)','Cộng thay vì nhân đơn giá với quantity'],
 ['M08','src/utils/checkout.js','total > 999999999999n','total >= 999999999999n','Từ chối nhầm tổng đúng giới hạn'],
 ['M09','src/services/cart-service.js','quantity < 1','quantity === 0','Bỏ chặn quantity âm tại variantProblem'],
];
for(const [,file] of mutations)originals[file]=fs.readFileSync(path.join(project,file));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function prepare(name){const target=path.join(run,name);fs.mkdirSync(target);fs.cpSync(path.join(project,'src'),path.join(target,'src'),{recursive:true});return target;}
function execute(root,name){
 const env={...process.env,TECHZONE_PROJECT:root,NODE_PATH:[path.join(project,'node_modules'),process.env.NODE_PATH||''].filter(Boolean).join(path.delimiter)};
 delete env.NODE_V8_COVERAGE;
 const child=spawnSync(process.execPath,['--test','--test-reporter=tap',testFile],{env,encoding:'utf8',timeout:20000,windowsHide:true});
 const text=(child.stdout||'')+(child.stderr||'');fs.writeFileSync(path.join(resultsDir,name+'.tap'),text);
 const tests=Number(text.match(/^# tests (\d+)/m)?.[1]||0);const failed=Number(text.match(/^# fail (\d+)/m)?.[1]||0);
 return {exit:child.status,tests,failed,failedTests:[...text.matchAll(/^not ok \d+ - (WB-[A-Z]+-\d+)/gm)].map(m=>m[1]),timeout:child.error?.code==='ETIMEDOUT'};
}
const report={runId:tag,node:process.version,started:new Date().toISOString(),scope:'9 manually selected single edits, isolated src copies, '+expectedTests+' whitebox tests',testFile,expectedTests,baseline:null,results:[]};
report.baseline=execute(prepare('baseline'),'baseline');
if(report.baseline.exit!==0||report.baseline.tests!==expectedTests||report.baseline.failed!==0)throw Error('BASELINE_NOT_GREEN');
console.log('BASELINE_PASS '+expectedTests+'/'+expectedTests);
for(const [id,file,from,to,description] of mutations){
 const root=prepare(id);const target=path.join(root,file);const source=fs.readFileSync(target,'utf8');
 if(source.split(from).length!==2)throw Error('MUTATION_TARGET_NOT_UNIQUE_'+id);
 fs.writeFileSync(target,source.replace(from,to));
 const parse=spawnSync(process.execPath,['--check',target],{encoding:'utf8',windowsHide:true});
 let result;
 if(parse.status!==0)result={status:'INVALID'};
 else {const observed=execute(root,id);result={...observed,status:observed.timeout?'TIMEOUT':observed.exit===0&&observed.tests===expectedTests?'SURVIVED':observed.tests===expectedTests&&observed.failedTests.length>0?'KILLED':'RUN_ERROR'};}
 const row={id,file,from,to,description,...result};
 if(id==='M09'&&row.status==='SURVIVED'){
  const original=require(path.join(project,'src/services/cart-service')).variantProblem;
  const mutant=require(path.join(root,'src/services/cart-service')).variantProblem;
  const input={valid_variant:1,price:'100000.00',stock:5};
  row.counterexample={quantity:-1,original:original(input,-1),mutant:mutant(input,-1)};
 }
 report.results.push(row);console.log(id,row.status,'failed='+String(row.failed??'-'),(row.failedTests||[]).join(','));
}
report.originalSourceUnchanged=Object.entries(originals).every(([file,data])=>sha(fs.readFileSync(path.join(project,file)))===sha(data));
if(!report.originalSourceUnchanged)throw Error('ORIGINAL_SOURCE_CHANGED');
report.killed=report.results.filter(r=>r.status==='KILLED').length;report.survived=report.results.filter(r=>r.status==='SURVIVED').length;
report.other=report.results.length-report.killed-report.survived;report.score=report.other===0?100*report.killed/report.results.length:null;
report.finished=new Date().toISOString();report.sandbox=run;
fs.writeFileSync(path.join(resultsDir,'results.json'),JSON.stringify(report,null,2));
fs.writeFileSync(path.join(output,'latest.json'),JSON.stringify({runDirectory:resultsDir},null,2));
console.log('MUTATION_SUMMARY killed='+report.killed+' survived='+report.survived+' other='+report.other+' score='+String(report.score?.toFixed(2))+'%');
console.log('ORIGINAL_SOURCE_UNCHANGED '+report.originalSourceUnchanged);
console.log('Evidence '+resultsDir);
if(report.other)process.exitCode=1;
