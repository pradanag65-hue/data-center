// Fitur tambahan: palet perintah (Ctrl/Cmd+K), status online, favorit & terakhir dibuka,
// QR code, banner pengumuman dari Sheet, dan PWA (pasang ke HP/desktop).
(function(){
var KEY="portal_state_v1",DKEY="portal_ann_dismissed",S={fav:{},cnt:{},last:{}},ST={},tmr,dp;
try{var s0=JSON.parse(localStorage.getItem(KEY)||"{}");S.fav=s0.fav||{};S.cnt=s0.cnt||{};S.last=s0.last||{}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function ago(t){var m=Math.round((Date.now()-t)/60000);if(m<1)return"baru saja";if(m<60)return m+" mnt lalu";var h=Math.round(m/60);return h<24?h+" jam lalu":Math.round(h/24)+" hari lalu"}
function score(a){return (S.fav[a.url]?1e6:0)+(S.cnt[a.url]||0)}
function sorted(term,cat){
 return APPS.map(function(a,i){return{a:a,i:i}}).filter(function(o){var a=o.a;
  return (!cat||cat==="Semua"||a.cat===cat)&&(a.name+" "+a.cat+" "+a.platform).toLowerCase().indexOf(term)>-1})
  .sort(function(x,y){return score(y.a)-score(x.a)||x.i-y.i}).map(function(o){return o.a});
}
window.list=function(){return sorted(q.value.trim().toLowerCase(),active)};
function cur(){return list()[idx]}
function count(a){if(!a)return;S.cnt[a.url]=(S.cnt[a.url]||0)+1;S.last[a.url]=Date.now();save()}
function star(on){return '<svg width="13" height="13" viewBox="0 0 24 24" fill="'+(on?"currentColor":"none")+'" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>'}

/* ---------- status online/offline ---------- */
function check(a){
 var c=new AbortController(),t=Date.now(),to=setTimeout(function(){c.abort()},7000);
 return fetch(a.url,{mode:"no-cors",cache:"no-store",signal:c.signal})
  .then(function(){ST[a.url]={ok:1,ms:Date.now()-t}}).catch(function(){ST[a.url]={ok:0}})
  .then(function(){clearTimeout(to);paint()});
}
function checkAll(){APPS.forEach(check)}
function sched(){clearTimeout(tmr);tmr=setTimeout(checkAll,700)}
function paint(){
 document.querySelectorAll(".st").forEach(function(el){
  var s=ST[el.dataset.u];el.className="st "+(s?(s.ok?"on":"off"):"wait");
  var t=s?(s.ok?"Online \u00b7 "+s.ms+" ms":"Tidak merespons"):"Mengecek\u2026",em=el.querySelector("em");
  if(em)em.textContent=t;el.title=t;
 });
}
setInterval(function(){if(!document.hidden)checkAll()},60000);

/* ---------- tampilan kartu (favorit, status, QR) ---------- */
window.render=function(){
 var L=list(),n=L.length;if(idx>=n)idx=0;
 $("n").textContent=APPS.length;empty.hidden=n>0;
 if(!n){deck.innerHTML="";return}
 var f=L[idx],b=[],a=[],k=0;
 if(n>=3)b=[(idx-1+n)%n];
 if(n===2||n===3)a=[(idx+1)%n];else if(n>=4)a=[(idx+1)%n,(idx+2)%n];
 function side(i){var x=L[i];
  return '<button type="button" class="card" style="--k:'+(k++)+'" data-i="'+i+'">'+(S.fav[x.url]?'<span class="flag">'+star(1)+'</span>':'')+
  '<span class="st" data-u="'+esc(x.url)+'"><i></i><em></em></span><div class="disc">'+ico(x.icon,40)+'</div><h2>'+esc(x.name)+'</h2><div class="sub">Detail</div>'+
  '<div class="row"><span>Kategori</span><span>'+esc(x.cat)+'</span></div><div class="row"><span>Platform</span><span>'+esc(x.platform)+'</span></div></button>'}
 var c=S.cnt[f.url]||0,fav=!!S.fav[f.url];
 var fe='<article class="feat"><div class="fin '+(dir>0?"sr":dir<0?"sl":"s0")+'">'+
  (n>1?'<button class="arw l" data-s="-1" aria-label="Sebelumnya">'+arrL+'</button><button class="arw r" data-s="1" aria-label="Berikutnya">'+arrR+'</button>':"")+
  '<div class="disc">'+ico(f.icon,70,1.5)+'</div><h2>'+esc(f.name)+'</h2>'+
  '<div class="meta"><span class="st" data-u="'+esc(f.url)+'"><i></i><em></em></span><span>'+(c?"Dibuka "+c+"\u00d7 \u00b7 "+ago(S.last[f.url]):"Belum pernah dibuka")+'</span></div>'+
  '<div class="acts"><button type="button" class="pill fav" aria-pressed="'+fav+'">'+star(fav)+' Favorit</button><button type="button" class="pill qrb">QR</button></div>'+
  '<div class="frow"><b>Kategori</b><span>'+esc(f.cat)+chev+'</span></div><div class="frow"><b>Platform</b><span>'+esc(f.platform)+chev+'</span></div>'+
  '<a class="btn" href="'+esc(f.url)+'" target="_blank" rel="noopener">Buka aplikasi</a></div></article>';
 deck.innerHTML=b.map(side).join("")+fe+a.map(side).join("");
 $("go").href=f.url;paint();
};
deck.addEventListener("click",function(e){
 if(e.target.closest(".fav")){var a=cur();if(S.fav[a.url])delete S.fav[a.url];else S.fav[a.url]=1;save();idx=Math.max(0,list().indexOf(a));dir=0;render();return}
 if(e.target.closest(".qrb")){openQR(cur());return}
 if(e.target.closest(".btn"))count(cur());
});
$("go").addEventListener("click",function(){count(cur())});

/* ---------- banner pengumuman (baris "PENGUMUMAN" di Sheet) ---------- */
function showAnn(t){
 var el=$("ann"),d="";try{d=localStorage.getItem(DKEY)||""}catch(e){}
 if(!t||t===d){el.hidden=true;return}
 el.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg><span>'+esc(t)+'</span><button type="button" aria-label="Tutup pengumuman">\u00d7</button>';
 el.hidden=false;
 el.querySelector("button").onclick=function(){try{localStorage.setItem(DKEY,t)}catch(e){}el.hidden=true};
}
var _set=setApps;
window.setApps=function(rows){
 var ann=null,rs=[rows[0]];
 rows.slice(1).forEach(function(r){
  if(r&&String(r[0]).trim().toLowerCase()==="pengumuman"){if(String(r[5]||"ya").trim().toLowerCase()!=="tidak"&&r[1])ann=String(r[1])}
  else rs.push(r);
 });
 showAnn(ann);_set(rs);sched();
};

/* ---------- palet perintah ---------- */
var pal=$("pal"),pq=$("pq"),pl=$("pl"),pi=0,pr=[];
function fill(){
 pr=sorted(pq.value.trim().toLowerCase(),"").slice(0,8);if(pi>=pr.length)pi=0;
 pl.innerHTML=pr.length?pr.map(function(a,i){return '<button type="button" class="pi" role="option" data-i="'+i+'" aria-selected="'+(i===pi)+'"><span class="disc">'+ico(a.icon,20)+'</span><span><b>'+esc(a.name)+'</b><small>'+esc(a.cat)+' \u00b7 '+esc(a.platform)+'</small></span>'+(S.fav[a.url]?'<span class="flag" style="margin-left:auto">'+star(1)+'</span>':"")+'</button>'}).join(""):'<div class="pn">Tidak ada yang cocok.</div>';
}
function openPal(){pal.hidden=false;pq.value="";pi=0;fill();pq.focus()}
function closePal(){pal.hidden=true}
function go(a){if(!a)return;count(a);window.open(a.url,"_blank","noopener");closePal()}
pq.addEventListener("input",function(){pi=0;fill()});
pq.addEventListener("keydown",function(e){
 e.stopPropagation();
 if(e.key==="ArrowDown"){e.preventDefault();pi=(pi+1)%Math.max(pr.length,1);fill()}
 else if(e.key==="ArrowUp"){e.preventDefault();pi=(pi-1+pr.length)%Math.max(pr.length,1);fill()}
 else if(e.key==="Enter"){go(pr[pi])}
 else if(e.key==="Escape"){closePal()}
});
pl.addEventListener("click",function(e){var b=e.target.closest(".pi");if(b)go(pr[+b.dataset.i])});
pal.addEventListener("mousedown",function(e){if(e.target===pal)closePal()});
var kb=document.querySelector(".kb");
if(kb){kb.textContent=/Mac|iPhone|iPad/.test(navigator.platform)?"\u2318 K":"Ctrl K";kb.addEventListener("click",function(e){e.preventDefault();openPal()})}
document.addEventListener("keydown",function(e){
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();pal.hidden?openPal():closePal();return}
 if(e.key==="/"&&!/INPUT|TEXTAREA/.test(e.target.tagName)){e.preventDefault();openPal()}
 if(e.key==="Escape")$("qr").hidden=true;
});

/* ---------- QR code ---------- */
var qrEl=$("qr");
function openQR(a){
 if(!a)return;
 var box=$("qsvg");
 try{var qr=qrcode(0,"M");qr.addData(a.url);qr.make();box.innerHTML=qr.createSvgTag(6,2)}
 catch(e){box.innerHTML='<p style="margin:0;color:#444">QR belum bisa dimuat (cek koneksi).</p>'}
 $("qn").textContent=a.name;$("qu").textContent=a.url;$("qc").textContent="Salin link";
 $("qc").onclick=function(){var d=$("qc");
  (navigator.clipboard?navigator.clipboard.writeText(a.url):Promise.reject()).then(function(){d.textContent="Tersalin"}).catch(function(){d.textContent="Salin manual"})};
 qrEl.hidden=false;
}
$("qx").onclick=function(){qrEl.hidden=true};
qrEl.addEventListener("mousedown",function(e){if(e.target===qrEl)qrEl.hidden=true});

/* ---------- PWA: pasang ke HP / desktop ---------- */
window.addEventListener("beforeinstallprompt",function(e){e.preventDefault();dp=e;$("inst").hidden=false});
window.addEventListener("appinstalled",function(){$("inst").hidden=true});
$("inst").addEventListener("click",function(){if(!dp)return;dp.prompt();dp.userChoice.then(function(){dp=null;$("inst").hidden=true})});
if("serviceWorker" in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register("sw.js").catch(function(){});

render();sched();
})();
