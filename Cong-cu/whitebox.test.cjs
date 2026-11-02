// Test độc lập: gọi hàm JavaScript thật, không khởi tạo app/database.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const {positiveInteger}=require(path.join(project,'src/utils/cart-validation'));
const {variantProblem}=require(path.join(project,'src/services/cart-service'));
const {quote}=require(path.join(project,'src/utils/checkout'));

for(const [id,value,max,expected] of [
 ['01',1,99,null],['02','0',99,null],['03','9007199254740992',99,null],
 ['04','100',99,null],['05','1',99,1],['06','99',99,99],
 ['07','2147483647',undefined,2147483647],['08','2147483648',undefined,null],
])test('WB-INT-'+id,()=>{
 const call=()=>max===undefined?positiveInteger(value):positiveInteger(value,max);
 if(expected===null)assert.throws(call,{name:'Error',status:422});else assert.equal(call(),expected);
});

const errors={variant:'Sản phẩm hoặc biến thể không còn hợp lệ.',price:'Biến thể chưa có giá bán hợp lệ.',stock:'Biến thể đã hết hàng.',quantity:'Số lượng phải từ 1 đến 99.',excess:'Số lượng vượt tồn kho hiện tại (5). Vui lòng giảm số lượng.',ok:''};
for(const [id,changes,quantity,expected] of [
 ['01',null,1,'variant'],['02',{price:'0.00'},1,'price'],['03',{stock:0},1,'stock'],
 ['04',{},0,'quantity'],['05',{},6,'excess'],['06',{},1,'ok'],
 ['07',{valid_variant:0},1,'variant'],['08',{price:'abc'},1,'price'],
 ['09',{stock:1.5},1,'stock'],['10',{},1.5,'quantity'],['11',{},100,'quantity'],
 ['12',{},5,'ok'],['13',{stock:100},99,'ok'],
])test('WB-VAR-'+id,()=>{
 const variant=changes===null?null:{valid_variant:1,price:'100000.00',stock:5,...changes};
 assert.equal(variantProblem(variant,quantity),errors[expected]);
});

function item(price='100000.00',quantity=1,variant_id=1){return{product_id:1,variant_id,valid_variant:1,stock:10,quantity,price,product_name:'Whitebox fixture',variant_name:'Test',sku:'WB-'+variant_id};}
function expectMoney(actual,subtotal,shipping,total){assert.equal(actual.subtotal,subtotal);assert.equal(actual.shipping,shipping);assert.equal(actual.total,total);}
test('WB-QUOTE-01',()=>assert.throws(()=>quote([]),{status:409}));
test('WB-QUOTE-02',()=>{const result=quote([item()]);expectMoney(result,'100000.00','30000.00','130000.00');assert.equal(result.items.length,1);});
test('WB-QUOTE-03',()=>{const result=quote([item(),item('200000.00',1,2)]);expectMoney(result,'300000.00','0.00','300000.00');assert.equal(result.items.length,2);assert.deepEqual(result.items.map(x=>x.lineLabel),['100.000 ₫','200.000 ₫']);});
test('WB-QUOTE-04',()=>assert.throws(()=>quote([item(),item('100000.00',11,2)]),{status:409}));
test('WB-QUOTE-05',()=>expectMoney(quote([item('100000.01',3)]),'300000.03','0.00','300000.03'));
test('WB-QUOTE-06',()=>expectMoney(quote([item('9999999999.99')]),'9999999999.99','0.00','9999999999.99'));
test('WB-QUOTE-07',()=>assert.throws(()=>quote([item('9999999999.99'),item('0.01',1,2)]),{status:409}));
