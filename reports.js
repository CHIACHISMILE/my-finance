/* Pure report calculations. All amounts are integer TWD. */
(function(root){'use strict';
const liquid=a=>a&&['bank','cash'].includes(a.type);
function flow(t,accounts){const a=accounts.find(x=>x.id===t.account),b=accounts.find(x=>x.id===t.to);if(!a)return {in:0,out:0,category:t.category};const from=!!liquid(a),to=!!liquid(b);let i=0,o=0,c=t.category;if(t.type==='income'||t.type==='refund'){if(from)i=t.amount;}else if(t.type==='expense'){if(from)o=t.amount;}else if(t.type==='transfer'&&b){if(from&&!to){o=t.amount;c=b.type==='investment'?'投資':b.type==='credit'?'信用卡還款':b.type==='loan'?'貸款還款':'其他資產轉入';}else if(!from&&to){i=t.amount;c=a.type==='investment'?'投資提領':a.type==='loan'?'借款':a.type==='credit'?'信用卡預借':'其他資產提領';}}return {in:i,out:o,category:c};}
function summarize(rows,accounts){return rows.reduce((s,t)=>{const f=flow(t,accounts);s.in+=f.in;s.out+=f.out;return s;},{in:0,out:0});}
function rangeFilter(rows,range){return rows.filter(t=>(!range.from||t.date>=range.from)&&(!range.to||t.date<=range.to));}
function investment(rows,accounts,balances,date){const inv=accounts.filter(a=>a.type==='investment'&&a.openDate<=date),ids=new Set(inv.map(a=>a.id));let deposit=0,withdraw=0,opening=inv.reduce((n,a)=>n+a.opening,0),adjust=0;for(const t of rows){if(t.date>date)continue;if(t.type==='transfer'){if(ids.has(t.to)&&!ids.has(t.account))deposit+=t.amount;if(ids.has(t.account)&&!ids.has(t.to))withdraw+=t.amount;}if(t.type==='adjust'&&ids.has(t.account))adjust+=t.amount;}const value=inv.reduce((n,a)=>n+(balances[a.id]||0),0);return {value,opening,deposit,withdraw,adjust,change:value-opening-deposit+withdraw};}
root.MFReports={flow,summarize,rangeFilter,investment};if(typeof module!=='undefined')module.exports=root.MFReports;
})(globalThis);
