const {test}=require('node:test'),assert=require('node:assert/strict'),{metrics,assess,importResults}=require('../public/modules/creative/model');const r={spend:300,impressions:10000,clicks:200,trials:40,paid:10};
test('funnel metrics use correct denominators',()=>{assert.deepEqual(metrics(r),{ctr:.02,cpc:1.5,trialRate:.2,paidRate:.25,cac:30});});
test('zero denominators are unavailable',()=>{assert.equal(metrics({spend:0,impressions:0,clicks:0,trials:0,paid:0}).cac,null);});
test('invalid funnels and counts rejected',()=>{for(const x of [{...r,paid:41},{...r,clicks:10001},{...r,spend:-1},{...r,paid:1.5},{...r,trials:NaN}])assert.throws(()=>metrics(x));});
test('insufficient evidence is not called a winner',()=>{assert.match(assess([r,r,{...r,paid:1}],60,5).title,/collecting/);});
test('CAC assessment and tie handling',()=>{assert.match(assess([r,{...r,paid:20},r],60,5).text,/Concept 2/);assert.match(assess([r,r,r],60,5).title,/tied/);assert.match(assess([r,{...r,paid:20},r],10,5).title,/No concept/);});
test('CSV import uses headers and IDs, including CRLF',()=>{const rows=importResults('concept,spend,impressions,clicks,trials,paid\r\n3,300,10000,200,40,10\r\n1,300,10000,200,40,10\r\n2,300,10000,200,40,10');assert.deepEqual(rows,[r,r,r]);});
test('CSV rejects missing, duplicate, or invalid rows',()=>{for(const text of ['concept,spend\n1,300','concept,spend,impressions,clicks,trials,paid\n1,,100,10,5,1\n2,1,100,10,5,1\n3,1,100,10,5,1','concept,spend,impressions,clicks,trials,paid\n1,1,100,10,5,1\n1,1,100,10,5,1\n3,1,100,10,5,1'])assert.throws(()=>importResults(text));});
