const {test}=require('node:test');const assert=require('node:assert/strict');const handler=require('../api/plan');
function res(){return {headers:{},setHeader(k,v){this.headers[k]=v},status(n){this.code=n;return this},json(v){this.body=v;return this}};}
const input={product:'Chapter',offer:'Reading subscription',keywords:['ebook subscription']};
test('endpoint validation, provider contract, and coverage',async()=>{const oldKey=process.env.OPENAI_API_KEY,oldFetch=global.fetch;try{
 let r=res();await handler({method:'GET'},r);assert.equal(r.code,405);
 delete process.env.OPENAI_API_KEY;r=res();await handler({method:'POST',body:input},r);assert.equal(r.code,503);
 process.env.OPENAI_API_KEY='test-only-placeholder';let calls=0;
 const group={name:'Reading',review:false,reason:'Subscription intent',keywords:input.keywords,headline:'Find your next read',description:'Explore a reading subscription.',landingPage:'Explain the subscription.'};
 global.fetch=async(url,options)=>{calls++;assert.equal(url,'https://api.openai.com/v1/responses');const b=JSON.parse(options.body);assert.equal(b.store,false);assert.equal(b.text.format.strict,true);return {ok:true,json:async()=>({status:'completed',output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({groups:[group]})}]}]})}};
 r=res();await handler({method:'POST',body:{...input,keywords:Array(51).fill('x')}},r);assert.equal(r.code,400);assert.equal(calls,0);
 r=res();await handler({method:'POST',body:input},r);assert.equal(r.code,200);assert.equal(r.body.groups[0].name,'Reading');assert.ok(!JSON.stringify(r.body).includes(process.env.OPENAI_API_KEY));
 group.keywords=['invented keyword'];r=res();await handler({method:'POST',body:input},r);assert.equal(r.code,502);
 global.fetch=async()=>({ok:false,status:429});r=res();await handler({method:'POST',body:input},r);assert.equal(r.code,429);
 }finally{global.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;}});
