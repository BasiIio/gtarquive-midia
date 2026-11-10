// uso: NODE_PATH=$(npm root -g) node capa_novo_trailer.js bg.png saida.jpg "TITULO" "DATA" "SUBTITULO"
const { chromium } = require('playwright'); const path=require('path');
const [bg,out,titulo,data,sub]=process.argv.slice(2); const F=path.resolve(__dirname,'..','fonts')+'/';
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1080,height:1920}});
await p.setContent(`<style>@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}body{width:1080px;height:1920px;position:relative;overflow:hidden;background:#0b0b12;font-family:A,sans-serif;color:#fff}
.bg{position:absolute;inset:0;background:url(data:image/png;base64,${require('fs').readFileSync(bg).toString('base64')}) center/cover;filter:blur(34px) brightness(.6) saturate(1.4);transform:scale(1.25)}
.fr{position:absolute;left:0;top:250px;width:1080px;height:540px;background:url(data:image/png;base64,${require('fs').readFileSync(bg).toString('base64')}) center/cover;box-shadow:0 20px 80px rgba(0,0,0,.7);border-top:6px solid #ff2d95;border-bottom:6px solid #00e5ff}
.g{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,11,18,.55) 0%,rgba(11,11,18,.05) 28%,rgba(11,11,18,.55) 52%,rgba(11,11,18,.94) 100%)}
.tag{position:absolute;left:54px;top:70px;background:rgba(0,0,0,.55);border:3px solid #ff2d95;padding:10px 24px;font-weight:900;font-size:40px}
.live{position:absolute;right:54px;top:74px;background:#ff2d95;padding:10px 26px;font-weight:900;font-size:36px;letter-spacing:3px;transform:skew(-6deg)}
.box{position:absolute;left:54px;right:54px;bottom:210px}
.b1{display:inline-block;background:#00e5ff;color:#0b0b12;padding:10px 26px;font-weight:900;font-size:46px;letter-spacing:3px;transform:skew(-6deg)}
h1{font-weight:900;font-size:150px;line-height:.95;text-transform:uppercase;margin-top:26px;text-shadow:0 10px 50px #000}
h1 span{color:#ff2d95}
.d{margin-top:34px;display:flex;gap:18px;align-items:center}
.date{background:#fff;color:#0b0b12;padding:12px 30px;font-weight:900;font-size:70px;transform:skew(-6deg)}
.s{font-weight:600;font-size:44px;text-shadow:0 4px 20px #000}
.src{position:absolute;left:54px;bottom:90px;font-weight:600;font-size:34px;opacity:.9;text-shadow:0 2px 10px #000}
</style><body><div class=bg></div><div class=g></div><div class=fr></div><div class=tag>GTArchived</div><div class=live>OFICIAL</div>
<div class=box><div class=b1>NOVO TRAILER</div><h1>${titulo}</h1><div class=d><div class=date>${esc(data)}</div><div class=s>${esc(sub)}</div></div></div>
<div class=src>Fonte: Rockstar Games</div></body>`); await p.waitForTimeout(700);
await p.screenshot({path:out,type:'jpeg',quality:93}); await b.close();})();
