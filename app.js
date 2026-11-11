// Portal Aplikasi: logika tampilan + pembacaan data dari Google Sheets
// Tambah aplikasi baru: cukup tambah satu baris. icon: bus | wrench | clip
var SHEET_ID="1y8K1DVWHKwfN8-yvmoszNV3iY4YpeqUq1RH5sI25HwU"; // Google Sheet: Database Portal Aplikasi
// Cadangan jika Sheet tidak bisa dibaca; data utama diambil dari Sheet
var APPS=[
 {name:"Collecting PT AMI",url:"https://vercel.com/pradanag65-hues-projects/collecting-pt-ami",cat:"Operasional",platform:"Web · Vercel",icon:"clip"},
 {name:"Laporan Sparepart",url:"https://laporan-sparepart.vercel.app/",cat:"Operasional",platform:"Web · Vercel",icon:"wrench"}
];
var ICON={
 bus:'<path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/>',
 wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
 clip:'<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>'
};
function ico(n,s,w){return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="currentColor" stroke-width="'+(w||1.6)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICON[n]||ICON.bus)+'</svg>'}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var $=function(i){return document.getElementById(i)};
var deck=$("deck"),q=$("q"),nav=$("nav"),empty=$("empty");
var cats=["Semua"].concat(APPS.map(function(a){return a.cat}).filter(function(c,i,r){return c&&r.indexOf(c)===i}));
var active="Semua",idx=0,dir=0;
$("logo").innerHTML=ico("bus",26,1.8);
$("tg").innerHTML=ico("bus",16,2)+'<span>Portal aplikasi</span>';
var chev='<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
var arrL='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';
var arrR='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>';
function list(){var s=q.value.trim().toLowerCase();return APPS.filter(function(a){return (active==="Semua"||a.cat===active)&&(a.name+" "+a.cat+" "+a.platform).toLowerCase().indexOf(s)>-1})}
function side(a,i,k){return '<button type="button" class="card" style="--k:'+k+'" data-i="'+i+'"><div class="disc">'+ico(a.icon,40)+'</div><h2>'+esc(a.name)+'</h2><div class="sub">Detail</div><div class="row"><span>Kategori</span><span>'+esc(a.cat)+'</span></div><div class="row"><span>Platform</span><span>'+esc(a.platform)+'</span></div><div class="row"><span>Akses</span><span>Tab baru</span></div></button>'}
function render(){
 var L=list(),n=L.length;if(idx>=n)idx=0;
 $("n").textContent=APPS.length;empty.hidden=n>0;
 if(!n){deck.innerHTML="";return}
 var f=L[idx],b=[],a=[];
 if(n>=3)b=[(idx-1+n)%n];
 if(n===2||n===3)a=[(idx+1)%n];else if(n>=4)a=[(idx+1)%n,(idx+2)%n];
 var k=0,h=b.map(function(i){return side(L[i],i,k++)}).join("");
 var fe='<article class="feat"><div class="fin '+(dir>0?'sr':dir<0?'sl':'s0')+'">'+
  (n>1?'<button class="arw l" data-s="-1" aria-label="Sebelumnya">'+arrL+'</button><button class="arw r" data-s="1" aria-label="Berikutnya">'+arrR+'</button>':'')+
  '<div class="disc">'+ico(f.icon,70,1.5)+'</div><h2>'+esc(f.name)+'</h2>'+
  '<div class="frow"><b>Kategori</b><span>'+esc(f.cat)+chev+'</span></div><div class="frow"><b>Platform</b><span>'+esc(f.platform)+chev+'</span></div><div class="frow"><b>Akses</b><span>Tab baru'+chev+'</span></div>'+
  '<a class="btn" href="'+esc(f.url)+'" target="_blank" rel="noopener">Buka aplikasi</a></div></article>';
 deck.innerHTML=h+fe+a.map(function(i){return side(L[i],i,k++)}).join("");
 $("go").href=f.url;
}
function step(d){var n=list().length;if(n<2)return;dir=d;idx=(idx+d+n)%n;render()}
deck.addEventListener("click",function(e){
 var s=e.target.closest(".arw");if(s){step(+s.dataset.s);return}
 var c=e.target.closest(".card");if(c){var i=+c.dataset.i,n=list().length,d=i-idx;dir=d>0?1:-1;idx=i;render()}
});
function drawNav(){nav.innerHTML=cats.map(function(c){return '<button aria-pressed="'+(c===active)+'" data-c="'+esc(c)+'">'+esc(c)+'</button>'}).join("")}
nav.addEventListener("click",function(e){var b=e.target.closest("button");if(!b)return;active=b.dataset.c;idx=0;dir=0;drawNav();render()});
q.addEventListener("input",function(){idx=0;dir=0;render()});
document.addEventListener("keydown",function(e){if(e.target===q)return;if(e.key==="ArrowRight")step(1);if(e.key==="ArrowLeft")step(-1)});
drawNav();render();

// Baca daftar aplikasi dari Google Sheets (kolom: nama, url, kategori, platform, ikon, aktif)
function status(t){var s=document.querySelector("#tg span");if(s)s.textContent=t}
function rowsOf(res){
 var p=res&&res.payload;
 if(p&&p.content&&p.content[0]&&p.content[0].text)p=p.content[0].text;
 if(typeof p==="string"){try{p=JSON.parse(p)}catch(e){p=null}}
 return p&&p.values?p.values:null;
}
function setApps(rows){
 var out=[];
 rows.slice(1).forEach(function(r){
  if(!r||!r[0]||!r[1])return;
  if(String(r[5]||"ya").toLowerCase().trim()==="tidak")return;
  out.push({name:String(r[0]),url:String(r[1]),cat:r[2]||"Lainnya",platform:r[3]||"Web",icon:String(r[4]||"bus").trim()});
 });
 if(!out.length)return;
 APPS=out;
 cats=["Semua"].concat(APPS.map(function(a){return a.cat}).filter(function(c,i,r){return c&&r.indexOf(c)===i}));
 active="Semua";idx=0;dir=0;drawNav();render();status("Portal aplikasi · Sheets");
}
var CSV_URL="https://docs.google.com/spreadsheets/d/"+SHEET_ID+"/gviz/tq?tqx=out:csv";
function parseCSV(t){var rows=[],r=[],f="",q=false;
 for(var i=0;i<t.length;i++){var c=t[i];
  if(q){if(c==='"'){if(t[i+1]==='"'){f+='"';i++}else q=false}else f+=c}
  else if(c==='"')q=true;
  else if(c===","){r.push(f);f=""}
  else if(c==="\n"||c==="\r"){if(c==="\r"&&t[i+1]==="\n")i++;r.push(f);rows.push(r);r=[];f=""}
  else f+=c}
 if(f!==""||r.length){r.push(f);rows.push(r)}
 return rows}
var KEY="portal_apps_v1";
try{var cached=JSON.parse(localStorage.getItem(KEY)||"null");if(cached)setApps(cached)}catch(e){}
var ok=false;
// 1) apps.json hasil build.py (cepat, tanpa tergantung Google saat dibuka)
fetch("apps.json",{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(rows){ok=true;setApps(rows)}).catch(function(){});
// 2) data terbaru langsung dari Google Sheets
fetch(CSV_URL,{cache:"no-store"}).then(function(r){if(!r.ok)throw 0;return r.text()}).then(function(t){
 var rows=parseCSV(t);setApps(rows);
 try{localStorage.setItem(KEY,JSON.stringify(rows))}catch(e){}
}).catch(function(){if(!ok)status("Portal aplikasi \u00b7 offline")});
