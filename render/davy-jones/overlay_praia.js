const { chromium } = require('playwright');
const F='/home/claude/gtarquive-midia/render/fonts/';
const css=`@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1920px;background:transparent;font-family:A,sans-serif;color:#fff}`;
const pages={
seal2:`<div style="position:absolute;left:44px;top:70px;background:rgba(0,0,0,.55);border:3px solid #ff2d95;padding:10px 22px;font-weight:900;font-size:38px">GTArchived</div>
<div style="position:absolute;right:44px;top:78px;font-weight:600;font-size:30px;text-shadow:0 2px 10px #000;text-align:right">EXCLUSIVO · DAVY JONES<br><span style="font-size:24px;opacity:.85">Crédito: Gameplay RJ / Flow Games</span></div>
<div style="position:absolute;left:60px;right:60px;top:1360px"><div style="display:inline-block;background:#ff2d95;padding:8px 22px;font-weight:900;font-size:38px;letter-spacing:2px;transform:skew(-6deg)">A PRAIA DE GTA 6</div>
<div style="font-weight:900;font-size:76px;line-height:1.05;margin-top:22px;text-shadow:0 6px 30px #000">Casal, cachorro, <span style="color:#00e5ff">briga</span> e NPCs que reagem a você</div></div>`,
titlep:`<div style="position:absolute;left:70px;right:70px;top:560px"><div style="display:inline-block;background:#ff2d95;padding:10px 26px;font-weight:900;font-size:44px;letter-spacing:3px;transform:skew(-6deg)">EXCLUSIVO</div>
<div style="font-weight:900;font-size:128px;line-height:1.0;margin-top:30px;text-transform:uppercase;text-shadow:0 8px 40px #000">Informações exclusivas do <span style="color:#00e5ff">Davy Jones</span> sobre <span style="color:#ff2d95">GTA 6!</span></div></div>`,
capa:`<div style="position:absolute;left:70px;right:70px;top:430px"><div style="display:inline-block;background:#ff2d95;padding:10px 26px;font-weight:900;font-size:44px;letter-spacing:3px;transform:skew(-6deg)">DAVY JONES VIU</div>
<div style="font-weight:900;font-size:150px;line-height:.98;margin-top:30px;text-transform:uppercase;text-shadow:0 8px 40px #000">A <span style="color:#00e5ff">praia</span> de <span style="color:#ff2d95">GTA 6</span></div>
<div style="font-weight:600;font-size:46px;margin-top:36px;text-shadow:0 4px 20px #000">NPCs que reagem a tudo</div></div>`
};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [k,v] of Object.entries(pages)){await p.setContent(`<style>${css}</style><body>${v}</body>`);await p.waitForTimeout(400);await p.screenshot({path:k+'.png',omitBackground:true});}
await b.close();})();
