const {Given,When,Then,Before}=require('@cucumber/cucumber');
const assert=require('node:assert/strict');
const path=require('node:path');
const project=process.env.TECHZONE_PROJECT||'D:/Duong/Đồ án cơ sở/TechShop';
const load=file=>require(path.join(project,file));
const {quote}=load('src/utils/checkout');
const {createCartDatabase}=load('tests/helpers/cart-database.cjs');
const {createCartRepository}=load('src/repositories/cart-repository');
const {createCartService}=load('src/services/cart-service');
Before(function(){this.error=null;this.db=null;this.service=null;this.input=null;this.quote=null;});
Given('a valid product priced {string} with quantity {int}',function(price,quantity){
 this.input=[{product_id:1,variant_id:1,valid_variant:1,stock:10,price,quantity,product_name:'BDD fixture',variant_name:'Test',sku:'BDD-1'}];
});
When('the server calculates the quote',function(){this.quote=quote(this.input);});
Then('subtotal is {string} shipping is {string} and total is {string}',function(subtotal,shipping,total){
 assert.equal(this.quote.subtotal,subtotal);assert.equal(this.quote.shipping,shipping);assert.equal(this.quote.total,total);
});
Given('a new cart with product stock {int}',function(stock){
 this.db=createCartDatabase();this.db.state.variants[0].stock=stock;this.db.state.variants[0].price='100000.00';
 this.service=createCartService(createCartRepository(this.db));
});
Given('customer {int} already has quantity {int}',async function(user,quantity){
 await this.service.change(user,'add',{variant_id:'1',quantity:String(quantity)});
});
When('customer {int} adds quantity {string}',async function(user,quantity){
 this.error=null;try{await this.service.change(user,'add',{variant_id:'1',quantity});}catch(e){this.error=e;}
});
When('customer {int} changes quantity to {string}',async function(user,quantity){
 const item=this.db.state.items.find(i=>i.user_id===user);assert(item);
 this.error=null;try{await this.service.change(user,'update',{quantity},String(item.cart_item_id));}catch(e){this.error=e;}
});
When('customer {int} removes customer {int} cart line',async function(actor,owner){
 const item=this.db.state.items.find(i=>i.user_id===owner);assert(item);
 this.error=null;try{await this.service.change(actor,'remove',{},String(item.cart_item_id));}catch(e){this.error=e;}
});
Then('customer {int} has one cart line with quantity {int}',async function(user,quantity){
 const actual=await this.service.getCart(user);assert.equal(actual.items.length,1);assert.equal(actual.items[0].quantity,quantity);
});
Then('customer {int} has an empty cart',async function(user){assert.equal((await this.service.getCart(user)).items.length,0);});
Then('the operation succeeds',function(){assert.equal(this.error,null);});
Then('the operation is rejected with status {int}',function(status){assert(this.error,'Expected a business error');assert.equal(this.error.status,status);});
Then('product stock remains {int}',function(stock){assert.equal(this.db.state.variants[0].stock,stock);});
