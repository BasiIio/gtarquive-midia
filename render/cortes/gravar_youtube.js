// Cole no javascript_tool da aba do YouTube (navegador do PC). Grava o trecho em tempo real e baixa um .webm em Downloads.
// Ajuste INICIO e FIM (segundos do vídeo) e NOME. Nao aguarde o fim: leia window.__st ate state:'done'.
(async()=>{
const INICIO=0, FIM=60, NOME='corte_bruto.webm';
const p=document.getElementById('movie_player'); try{p.setPlaybackQualityRange('hd1080','hd1080');}catch(e){}
const v=document.querySelector('video'); v.muted=false; v.currentTime=INICIO; await v.play(); await new Promise(r=>setTimeout(r,2500));
const rec=new MediaRecorder(v.captureStream(),{mimeType:'video/webm;codecs=vp9,opus',videoBitsPerSecond:9000000,audioBitsPerSecond:160000});
const ch=[]; rec.ondataavailable=e=>ch.push(e.data); window.__st={state:'rec',start:v.currentTime};
rec.onstop=()=>{const b=new Blob(ch,{type:'video/webm'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=NOME; document.body.appendChild(a); a.click(); window.__st={state:'done',size:b.size,end:v.currentTime};};
rec.start(1000);
const iv=setInterval(()=>{ if(v.paused&&v.currentTime<FIM){v.play();} if(v.currentTime>=FIM||v.ended){clearInterval(iv); rec.stop(); v.pause();}},500);
})();
