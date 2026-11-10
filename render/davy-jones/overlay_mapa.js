const { chromium } = require('playwright');
const F='/home/claude/gtarquive-midia/render/fonts/';
const css=`@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;font-family:A,sans-serif;color:#fff}`;
const pages={
title:`<div style="position:absolute;left:70px;right:70px;top:560px;text-align:left">
<div style="display:inline-block;background:#ff2d95;padding:10px 26px;font-weight:900;font-size:44px;letter-spacing:3px;transform:skew(-6deg)">EXCLUSIVO</div>
<div style="font-weight:900;font-size:128px;line-height:1.0;margin-top:30px;text-transform:uppercase;text-shadow:0 8px 40px #000">Informações exclusivas do <span style="color:#00e5ff">Davy Jones</span> sobre <span style="color:#ff2d95">GTA 6!</span></div>
<div style="font-weight:600;font-size:42px;margin-top:40px;opacity:.9">Ele viu 2 horas de gameplay na Rockstar</div></div>`,
seal:`<div style="position:absolute;left:44px;top:70px;background:rgba(0,0,0,.55);border:3px solid #ff2d95;padding:10px 22px;font-weight:900;font-size:38px;letter-spacing:1px">GTArchived</div>
<div style="position:absolute;right:44px;top:78px;font-weight:600;font-size:30px;text-shadow:0 2px 10px #000;text-align:right">EXCLUSIVO · DAVY JONES<br><span style="font-size:24px;opacity:.85">Crédito: Gameplay RJ / Flow Games</span></div>`,
end:`<div style="position:absolute;inset:0;background:#0b0b12"></div>
<div style="position:absolute;left:0;right:0;top:760px;text-align:center"><div style="font-weight:900;font-size:130px;line-height:1">SIGA O</div><div style="font-weight:900;font-size:150px;color:#ff2d95;line-height:1.05">GTArchived</div><div style="font-weight:600;font-size:46px;margin-top:40px;color:#00e5ff">tudo de GTA 6 até o lançamento</div></div>`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [k,v] of Object.entries(pages)){await p.setContent(`<style>${css}</style><body>${v}</body>`);await p.waitForTimeout(400);await p.screenshot({path:k+'.png',omitBackground:k!=='end'});}
await b.close();})();
