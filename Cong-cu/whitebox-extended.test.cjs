// Giữ nguyên 28 ca cũ; bổ sung phản ví dụ phát hiện sau mutation.
require('./whitebox.test.cjs');
const {test}=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const {variantProblem}=require(path.join(project,'src/services/cart-service'));
test('WB-VAR-14 | quantity âm phải bị từ chối',()=>{
 assert.equal(variantProblem({valid_variant:1,price:'100000.00',stock:5},-1),'Số lượng phải từ 1 đến 99.');
});
