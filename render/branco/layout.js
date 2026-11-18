// uso: NODE_PATH=$(npm root -g) node layout.js params.json outdir
// Gera header.png (fundo branco 1080x1920 com logo, nome+verificado, @, titulo), pill.png (credito, transparente) e end.png.
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const P=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const F=path.resolve(__dirname,'..','fonts')+'/'; const LOGO=path.resolve(__dirname,'..','..','marca','logo-gtarchived.jpg');
const Y0=P.videoY||560, VH=P.videoH||1000;
const esc=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const css=`@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;font-family:A,sans-serif}`;
const badge=`<svg width="44" height="44" viewBox="0 0 24 24" style="margin-left:10px;flex:none"><path fill="#1d9bf0" d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.65.15-.44.23-.91.23-1.4 0-2.21-1.71-4-3.82-4-.47 0-.92.08-1.34.25C14.81 2.33 13.5 1.5 12 1.5s-2.8.83-3.38 2.2c-.42-.17-.88-.25-1.35-.25-2.12 0-3.82 1.79-3.82 4 0 .49.08.96.23 1.4C2.38 9.55 1.5 10.92 1.5 12.5c0 1.5.79 2.8 1.96 3.52-.02.16-.03.32-.03.48 0 2.21 1.71 4 3.82 4 .47 0 .93-.09 1.35-.25.58 1.37 1.88 2.25 3.38 2.25 1.51 0 2.81-.88 3.38-2.25.42.16.88.25 1.35.25 2.12 0 3.82-1.79 3.82-4 0-.16-.01-.32-.03-.48 1.17-.72 1.96-2.02 1.96-3.52z"/><path fill="#fff" d="M10.7 16.3l-3.8-3.8 1.4-1.4 2.4 2.4 5.2-5.2 1.4 1.4z"/></svg>`;
const head=`<div style="position:absolute;inset:0;background:#fff"></div>
<div style="position:absolute;left:0;right:0;top:${P.headY||110}px;display:flex;justify-content:center;align-items:center;gap:26px">
 <img src="file://${LOGO}" style="width:150px;height:150px;border-radius:50%;border:5px solid #ff2d95">
 <div><div style="display:flex;align-items:center;font-weight:900;font-size:56px;color:#111">${esc(P.nome||'GTArchived')}${badge}</div>
 <div style="font-weight:600;font-size:38px;color:#7a7a85;margin-top:4px">${esc(P.handle||'@gtarchived.oficial')}</div></div></div>
<div style="position:absolute;left:56px;right:56px;top:${(P.headY||110)+180}px;bottom:${1920-Y0+24}px;display:flex;align-items:center;justify-content:center;text-align:center">
 <div style="font-weight:900;font-size:${P.tituloPx||62}px;line-height:1.12;color:#111">${esc(P.titulo)}</div></div>
<div style="position:absolute;left:0;right:0;top:${Y0-8}px;height:8px;background:#ff2d95"></div>
<div style="position:absolute;left:0;right:0;top:${Y0+VH}px;height:8px;background:#ff2d95"></div>
<div style="position:absolute;left:0;right:0;top:${Y0+VH+30}px;text-align:center;font-weight:600;font-size:34px;color:#555">${esc(P.creditoBaixo||'')}</div>`;
const pill=`<div style="position:absolute;left:28px;top:${Y0+24}px;background:rgba(0,0,0,.62);border-radius:40px;padding:10px 24px 10px 18px;font-weight:900;font-size:32px;color:#fff;display:flex;align-items:center;gap:12px"><span style="width:16px;height:16px;border-radius:50%;background:#9146ff;display:inline-block"></span>${esc(P.credito)}</div>`;
const end=`<div style="position:absolute;inset:0;background:#fff"></div><div style="position:absolute;left:0;right:0;top:600px;text-align:center">
<img src="file://${LOGO}" style="width:260px;height:260px;border-radius:50%;border:8px solid #ff2d95"><div style="font-weight:900;font-size:120px;line-height:1;margin-top:60px;color:#111">SIGA O</div>
<div style="font-weight:900;font-size:140px;color:#ff2d95;line-height:1.05">GTArchived</div><div style="font-weight:600;font-size:44px;margin-top:36px;color:#555">tudo de GTA 6, todo dia</div></div>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [k,v,t] of [['header',head,false],['pill',pill,true],['end',end,false]]){const hf=path.join(OUT,k+'.html');fs.writeFileSync(hf,`<!doctype html><meta charset=utf-8><style>${css}</style><body style="background:transparent">${v}</body>`);await p.goto('file://'+hf);await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);await p.screenshot({path:path.join(OUT,k+'.png'),omitBackground:t});}
await b.close();})();
