/* IndexedDB: account/project-scoped snapshots + durable transaction outbox. */
const MFStore=(()=>{
 let opening;
 function open(){return opening||(opening=new Promise((resolve,reject)=>{const r=indexedDB.open('myfinance-offline-v2',1);r.onupgradeneeded=()=>r.result.createObjectStore('profiles');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}).catch(e=>{opening=null;throw e}))}
 async function read(key){const db=await open();return new Promise((res,rej)=>{const r=db.transaction('profiles').objectStore('profiles').get(key);r.onsuccess=()=>res(r.result||null);r.onerror=()=>rej(r.error)})}
 async function write(key,value,expected){const db=await open();return new Promise((res,rej)=>{const t=db.transaction('profiles','readwrite'),s=t.objectStore('profiles'),r=s.get(key);let conflict=false;r.onsuccess=()=>{if((r.result?.version||0)!==expected){conflict=true;t.abort();return}s.put(value,key)};t.oncomplete=()=>res();t.onabort=()=>rej(Error(conflict?'其他視窗已更新本機資料，請重新開啟 App。':'本機資料儲存失敗'));t.onerror=()=>rej(t.error)})}
 async function remove(key){const db=await open();return new Promise((res,rej)=>{const t=db.transaction('profiles','readwrite');t.objectStore('profiles').delete(key);t.oncomplete=()=>res();t.onabort=()=>rej(t.error);t.onerror=()=>rej(t.error)})}
 function overlay(rows,pending){const m=new Map(rows.map(x=>[x.id,x]));for(const p of pending){if(p.kind==='delete')m.delete(p.id);else m.set(p.id,p.record)}return [...m.values()]}
 function equal(a,b){return !!a&&!!b&&Object.keys(b).every(k=>a[k]===b[k])}
 function decision(op,server){if(op.kind==='delete'){if(!server)return 'done';return server.rev===op.baseRev?'apply':'conflict'}if(equal(server,op.record))return 'done';if(!server)return op.baseRev===0?'apply':'conflict';return server.rev===op.baseRev&&op.baseRev>0?'apply':'conflict'}
 return {read,write,remove,overlay,decision};
})();
