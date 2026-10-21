(function(root){
 function calculate(x){
 const keys=['budget','cpc','trialRate','paidRate','price','margin','churn'];
 if(keys.some(k=>!Number.isFinite(x[k])))throw Error('All assumptions must be finite numbers.');
 if(x.budget<=0||x.cpc<=0||x.price<=0)throw Error('Budget, cost per click, and subscription price must be above zero.');
 if(['trialRate','paidRate','margin'].some(k=>x[k]<0||x[k]>100)||x.churn<=0||x.churn>100)throw Error('Conversion and margin must be 0–100%; churn must be above 0% and at most 100%.');
 const clicks=x.budget/x.cpc,trials=clicks*x.trialRate/100,paid=trials*x.paidRate/100;
 const monthlyContribution=x.price*x.margin/100,retention=1-x.churn/100;
 const cac=paid>0?x.budget/paid:null,ltv=monthlyContribution/(x.churn/100),ratio=cac===null?null:ltv/cac;
 let cumulative=0;const cohort=[];
 for(let m=1;m<=60;m++){const active=paid*Math.pow(retention,m-1),revenue=active*x.price,contribution=active*monthlyContribution;cumulative+=contribution;cohort.push({month:m,active,revenue,contribution,cumulative,net:cumulative-x.budget});}
 let payback=null;
 if(cac!==null&&monthlyContribution>0){if(retention===0){if(monthlyContribution>=cac)payback=1;}else if(cac<ltv){payback=Math.max(1,Math.ceil(Math.log1p(-cac/ltv)/Math.log(retention)));}}
 return {clicks,trials,paid,cac,ltv,ratio,payback,monthlyContribution,cohort,net12:cohort[11].net};
 }
 if(typeof module!=='undefined')module.exports={calculate};else root.GrowthModel={calculate};
})(typeof window!=='undefined'?window:globalThis);
