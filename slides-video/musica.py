# Trilha original simples (sintetizada, sem direitos autorais): pad + arpejo + baixo, ~100 bpm, 16 s.
import numpy as np, wave
sr=44100; bpm=100; beat=60/bpm; dur=16.0
t=np.arange(int(sr*dur))/sr
def nota(m): return 440*2**((m-69)/12)
acordes=[(57,60,64),(53,57,60),(48,52,55),(55,59,62)]  # Am F C G
out=np.zeros_like(t)
comp=beat*4
for i in range(int(dur/comp)+1):
    ac=acordes[i%4]; s=int(i*comp*sr); e=min(len(t),int((i+1)*comp*sr))
    if s>=len(t): break
    tt=t[s:e]-t[s]
    env=np.minimum(1,tt/0.4)*np.minimum(1,(comp-tt)/0.5)
    pad=sum(np.sin(2*np.pi*nota(n)*tt)+0.4*np.sin(2*np.pi*nota(n)*2*tt) for n in ac)/6
    out[s:e]+=0.35*pad*env
    bass=np.sin(2*np.pi*nota(ac[0]-24)*tt)*np.exp(-tt*1.2)
    out[s:e]+=0.35*bass
    for k in range(8):  # arpejo em colcheias
        n=ac[k%3]+12*(k//3%2+1); st=k*beat/2; m=(tt>=st)
        tk=np.where(m,tt-st,0)
        pl=np.sin(2*np.pi*nota(n)*tk)*np.exp(-tk*7)*m
        out[s:e]+=0.16*pl
out*=np.minimum(1,t/0.5)*np.minimum(1,(dur-t)/1.5)
out=out/np.max(np.abs(out))*0.8
w=wave.open('musica.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr)
w.writeframes((out*32767).astype(np.int16).tobytes()); w.close()
