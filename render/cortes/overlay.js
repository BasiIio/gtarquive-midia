// uso: NODE_PATH=$(npm root -g) node overlay.js params.json outdir
// params: {"gancho":"texto do titulo","etiqueta":"EXCLUSIVO","credito":"Crédito: Canal X","faixaTag":"TEMA","faixaTitulo":"frase curta"}
const { chromium } = require('playwright');
const fs=require('fs'); const path=require('path');
const P=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const OUT=process.argv[3]; fs.mkdirSync(OUT,{recursive:true});
const F=path.resolve(__dirname,'..','fonts')+'/';
const esc=s=>String(s||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const css=`@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;font-family:A,sans-serif;color:#fff}`;
const selo=`<div style="position:absolute;left:44px;top:70px;background:rgba(0,0,0,.55);border:3px solid #ff2d95;padding:10px 22px;font-weight:900;font-size:38px">GTArchived</div>
<div style="position:absolute;right:44px;top:78px;font-weight:600;font-size:28px;text-shadow:0 2px 10px #000;text-align:right;max-width:560px">${esc(P.etiqueta||'')}<br><span style="font-size:24px;opacity:.9">${esc(P.credito||'')}</span></div>`;
const faixa=P.faixaTitulo?`<div style="position:absolute;left:60px;right:60px;top:1360px"><div style="display:inline-block;background:#ff2d95;padding:8px 22px;font-weight:900;font-size:38px;letter-spacing:2px;transform:skew(-6deg)">${esc(P.faixaTag||'')}</div><div style="font-weight:900;font-size:72px;line-height:1.05;margin-top:22px;text-shadow:0 6px 30px #000">${esc(P.faixaTitulo)}</div></div>`:'';
const pages={
seal:selo+faixa,
title:`<div style="position:absolute;left:70px;right:70px;top:540px"><div style="display:inline-block;background:#ff2d95;padding:10px 26px;font-weight:900;font-size:44px;letter-spacing:3px;transform:skew(-6deg)">${esc(P.etiqueta||'EXCLUSIVO')}</div><div style="font-weight:900;font-size:118px;line-height:1.0;margin-top:30px;text-transform:uppercase;text-shadow:0 8px 40px #000">${esc(P.gancho)}</div></div>`,
end:`<div style="position:absolute;inset:0;background:#0b0b12"></div><div style="position:absolute;left:0;right:0;top:760px;text-align:center"><div style="font-weight:900;font-size:130px;line-height:1">SIGA O</div><div style="font-weight:900;font-size:150px;color:#ff2d95;line-height:1.05">GTArchived</div><div style="font-weight:600;font-size:46px;margin-top:40px;color:#00e5ff">tudo de GTA 6 até o lançamento</div></div>`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [k,v] of Object.entries(pages)){await p.setContent(`<style>${css}</style><body>${v}</body>`);await p.waitForTimeout(400);await p.screenshot({path:path.join(OUT,k+'.png'),omitBackground:k!=='end'});}
await b.close();})();
