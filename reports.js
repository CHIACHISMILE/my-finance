/* Pure report calculations. All amounts are integer TWD. */
(function(root){'use strict';
const liquid=a=>!!a&&!['credit','loan'].includes(a.type)&&(typeof a.cashBalance==='boolean'?a.cashBalance:['bank','cash'].includes(a.type));
function flow(t,accounts){const a=accounts.find(x=>x.id===t.account),b=accounts.find(x=>x.id===t.to);if(!a)return {in:0,out:0,category:t.category};const from=!!liquid(a),to=!!liquid(b);let i=0,o=0,c=t.category;if(t.type==='income'||t.type==='refund'){if(from)i=t.amount;}else if(t.type==='expense'){if(from)o=t.amount;}else if(t.type==='transfer'&&b){if(from&&!to){o=t.amount;c=b.type==='investment'?'投資':b.type==='credit'?'信用卡還款':b.type==='loan'?'貸款還款':'其他資產轉入';}else if(!from&&to){i=t.amount;c=a.type==='investment'?'投資提領':a.type==='loan'?'借款':a.type==='credit'?'信用卡預借':'其他資產提領';}}return {in:i,out:o,category:c};}
function summarize(rows,accounts){return rows.reduce((s,t)=>{const f=flow(t,accounts);s.in+=f.in;s.out+=f.out;return s;},{in:0,out:0});}
function rangeFilter(rows,range){return rows.filter(t=>(!range.from||t.date>=range.from)&&(!range.to||t.date<=range.to));}
function investment(rows,accounts,balances,date){const inv=accounts.filter(a=>a.type==='investment'&&a.openDate<=date),ids=new Set(inv.map(a=>a.id));let deposit=0,withdraw=0,opening=inv.reduce((n,a)=>n+a.opening,0),adjust=0;for(const t of rows){if(t.date>date)continue;if(t.type==='transfer'){if(ids.has(t.to)&&!ids.has(t.account))deposit+=t.amount;if(ids.has(t.account)&&!ids.has(t.to))withdraw+=t.amount;}if(t.type==='adjust'&&ids.has(t.account))adjust+=t.amount;}const value=inv.reduce((n,a)=>n+(balances[a.id]||0),0);return {value,opening,deposit,withdraw,adjust,change:value-opening-deposit+withdraw};}
// Cash position uses the same dated account balances as net worth.
function cashPosition(accounts,balances){return accounts.reduce((n,a)=>n+(liquid(a)?(balances[a.id]||0):0),0);}
function cashPeriod(rows,accounts,range,today,balanceAt){
 const end=range.to&&range.to<today?range.to:today;
 const from=range.from||'';
 const previous=from?new Date(Date.parse(from+'T00:00:00Z')-86400000).toISOString().slice(0,10):'';
 const opening=from?cashPosition(accounts,balanceAt(previous)):0;
 const selected=rangeFilter(rows,{from,to:end});
 const f=summarize(selected,accounts),ids=new Set(accounts.filter(liquid).map(a=>a.id));
 const initial=accounts.filter(a=>ids.has(a.id)&&a.openDate<=end&&(!from||a.openDate>=from)).reduce((n,a)=>n+a.opening,0);
 const adjustment=selected.filter(t=>t.type==='adjust'&&ids.has(t.account)).reduce((n,t)=>n+t.amount,0);
 const closing=cashPosition(accounts,balanceAt(end));
 return {opening,initial,adjustment,closing,in:f.in,out:f.out,net:f.in-f.out,end,other:closing-opening-initial-adjustment-f.in+f.out};
}
function cashRing(closing,out){if(closing<0)return {base:'#e8b7b0',part:'#f1d3b4',percent:0,deficit:true,empty:false};const total=closing+out;return {base:'#b7d5ec',part:'#f1d3b4',percent:total?Math.max(0,Math.min(100,out/total*100)):0,deficit:false,empty:total===0};}
root.MFReports={flow,summarize,rangeFilter,investment,liquid,cashPosition,cashPeriod,cashRing};if(typeof module!=='undefined')module.exports=root.MFReports;
})(globalThis);
