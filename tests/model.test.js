const {test}=require('node:test'),a=require('node:assert/strict'),m=require('../public/model');
test('CSV parses consistent periods and computes weighted totals',()=>{const r=m.parse('period,channel,spend,impressions,clicks,conversions,revenue\nbaseline,Search,100,1000,100,10,500\ncurrent,Search,200,2000,200,10,500');a.equal(m.totals(r).cpa,15);a.equal(m.totals(r).roas,1000/300);});
test('invalid CSV and negative metrics rejected',()=>{a.throws(()=>m.parse('wrong,headers\n1,2'));a.throws(()=>m.parse('period,channel,spend,impressions,clicks,conversions,revenue\ncurrent,Search,-1,10,2,1,1'));});
test('zero denominators remain unavailable',()=>{a.equal(m.totals([]).cpa,null);a.equal(m.totals([]).roas,null);});
test('budget applies explicit efficiency penalty',()=>{a.deepEqual(m.budget(1200,50,20),{effectiveCPA:60,conversions:20});a.throws(()=>m.budget(100,0,10));});
test('holdout difference and sparse outcome guardrail',()=>{const r=m.lift(10000,200,10000,240);a.ok(Math.abs(r.diff-.004)<1e-10);a.equal(r.reliable,true);a.ok(Math.abs(r.incremental-40)<1e-8);a.equal(m.lift(100,0,100,1).reliable,false);a.throws(()=>m.lift(100,101,100,2));});
