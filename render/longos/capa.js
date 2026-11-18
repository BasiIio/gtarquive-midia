// uso: NODE_PATH=$(npm root -g) node capa.js params.json saida.png
// params: {frame, face (png facecam recortada, opcional), nome ("ALANZOKA"), art ("DO"/"DA"), cor ("#ffe14d")}
const { chromium } = require('playwright'); const fs=require('fs'); const path=require('path');
const P=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const OUT=path.resolve(process.argv[3]);
const F=path.resolve(__dirname,'..','fonts')+'/'; const LOGO=path.resolve(__dirname,'..','..','marca','logo-gtarchived.jpg');
const cor=P.cor||'#ffe14d';
const html=`<!doctype html><meta charset=utf-8><style>
@font-face{font-family:A;font-weight:900;src:url(file://${F}archivo-latin-900-normal.woff2)}
@font-face{font-family:A;font-weight:600;src:url(file://${F}archivo-latin-600-normal.woff2)}
*{margin:0;box-sizing:border-box}html,body{width:1280px;height:720px;overflow:hidden;font-family:A,sans-serif;background:#000}
.bg{position:absolute;inset:0;background:url(file://${path.resolve(P.frame)}) center/cover;filter:saturate(1.35) contrast(1.12) brightness(.95)}
.sh{position:absolute;inset:0;background:linear-gradient(100deg,rgba(10,0,30,.92) 0%,rgba(10,0,30,.78) 38%,rgba(10,0,30,0) 72%)}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse at 85% 110%,rgba(255,45,149,.55),transparent 55%)}
.tag{position:absolute;left:56px;top:48px;background:#ff2d95;color:#fff;font-weight:900;font-size:30px;letter-spacing:2px;padding:8px 22px;border-radius:10px;transform:skewX(-8deg)}
.t1{position:absolute;left:56px;top:122px;font-weight:900;font-size:64px;color:#fff;line-height:1;text-shadow:0 4px 0 #000,0 0 24px rgba(0,0,0,.6)}
.t2{position:absolute;left:52px;top:176px;font-weight:900;font-size:230px;line-height:.95;color:${cor};text-shadow:0 8px 0 #7a1b52,0 0 40px rgba(255,45,149,.55);letter-spacing:-4px}
.t3{position:absolute;left:56px;top:432px;font-weight:900;font-size:${P.nomePx||92}px;line-height:1;color:#fff;text-shadow:0 5px 0 #000,0 0 24px rgba(0,0,0,.6)}
.t4{position:absolute;left:56px;top:${P.t4top||540}px;font-weight:900;font-size:92px;line-height:1;color:#fff;text-shadow:0 5px 0 #000}
.t4 b{color:#ff2d95}
.face{position:absolute;right:46px;bottom:44px;width:300px;height:300px;border-radius:50%;border:10px solid #ff2d95;box-shadow:0 0 0 6px #fff,0 18px 40px rgba(0,0,0,.6);background:url(file://${P.face?path.resolve(P.face):''}) center/cover}
.logo{position:absolute;right:58px;top:40px;width:104px;height:104px;border-radius:50%;border:6px solid #ff2d95;box-shadow:0 8px 24px rgba(0,0,0,.5)}
.cred{position:absolute;left:56px;bottom:40px;font-weight:600;font-size:26px;color:#fff;background:rgba(0,0,0,.55);padding:8px 18px;border-radius:30px}
</style><div class=bg></div><div class=sh></div><div class=glow></div>
<div class=tag>PRIMEIRAS IMPRESSÕES</div>
<div class=t1>OS PRIMEIROS</div><div class=t2>10 MIN</div>
<div class=t3>${P.art} ${P.nome}</div><div class=t4>NO <b>GTA 6</b></div>
${P.face?'<div class=face></div>':''}
<img class=logo src="file://${LOGO}"><div class=cred>${P.cred||''}</div>`;
(async()=>{const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:720}}); await p.setContent(html); await p.waitForTimeout(800); await p.evaluate(()=>document.fonts.ready); await p.screenshot({path:OUT}); await b.close(); console.log('ok',OUT)})();
