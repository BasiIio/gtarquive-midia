// uso: NODE_PATH=$(npm root -g) node overlay_narrado.js cfg.json outdir
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const C=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const F=path.resolve(__dirname,'..','fonts')+'/';
const esc=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const css=`@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;font-family:A,sans-serif;color:#fff}`;
const seloCor=(C.selo==='OFICIAL')?'#25E2E0':(C.selo==='IMPRENSA'?'#FFB347':'#FF3E9A');
const base=`<div style="position:absolute;left:44px;top:70px;background:rgba(0,0,0,.55);border:3px solid #ff2d95;padding:10px 22px;font-weight:900;font-size:38px">GTArchived</div>
<div style="position:absolute;right:44px;top:70px;text-align:right;max-width:600px"><div style="display:inline-block;background:${seloCor};color:#1A0B2E;padding:8px 22px;font-weight:900;font-size:38px;letter-spacing:2px;transform:skew(-6deg)">${esc(C.selo)}</div><div style="font-weight:600;font-size:26px;margin-top:10px;text-shadow:0 2px 10px #000">${esc(C.credito)}</div></div>
<div style="position:absolute;left:60px;right:60px;top:250px"><div style="display:inline-block;background:#ff2d95;padding:8px 22px;font-weight:900;font-size:36px;letter-spacing:3px;transform:skew(-6deg)">${esc(C.kicker)}</div><div style="font-weight:900;font-size:${C.tituloPx||104}px;line-height:1.02;margin-top:22px;text-transform:uppercase;text-shadow:0 8px 40px #000">${esc(C.titulo)}</div></div>`;
const cap=t=>`<div style="position:absolute;left:60px;right:60px;top:1340px;font-weight:900;font-size:70px;line-height:1.08;text-shadow:0 6px 30px #000"><span style="background:linear-gradient(transparent 62%,rgba(255,45,149,.9) 62%)">${esc(t)}</span></div>`;
const end=`<div style="position:absolute;inset:0;background:#0b0b12"></div><div style="position:absolute;left:0;right:0;top:760px;text-align:center"><div style="font-weight:900;font-size:130px;line-height:1">SIGA O</div><div style="font-weight:900;font-size:150px;color:#ff2d95;line-height:1.05">GTArchived</div><div style="font-weight:600;font-size:46px;margin-top:40px;color:#00e5ff">tudo de GTA 6 até o lançamento</div></div>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
const shot=async(name,html,omit=true)=>{await p.setContent(`<style>${css}</style><body>${html}</body>`);await p.waitForTimeout(350);await p.screenshot({path:path.join(OUT,name),omitBackground:omit});};
await shot('base.png',base); await shot('end.png',end,false);
for(let i=0;i<C.frases.length;i++) await shot(`cap${i}.png`,cap(C.frases[i].texto));
await b.close();})();
