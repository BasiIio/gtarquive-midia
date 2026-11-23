import numpy as np, scipy.signal as sg, scipy.io.wavfile as wf
sr=44100; T=37.0; n=int(sr*T); out=np.zeros(n)
bpm=66; beat=60/bpm
chords=[("A",[57,60,64]),("F",[53,57,60]),("C",[48,52,55]),("G",[55,59,62])]
f=lambda m:440*2**((m-69)/12)
def pluck(freq,dur,vel=1):
    t=np.arange(int(sr*dur))/sr; s=0
    for h,a in [(1,1),(2,.5),(3,.25),(4,.12),(5,.06)]:
        s=s+a*np.sin(2*np.pi*freq*h*t)*np.exp(-t*(2.2+h*1.1))
    return s*vel*np.minimum(1,t*400)
def pad(freq,dur):
    t=np.arange(int(sr*dur))/sr; s=0
    for d in (-.3,0,.3): s=s+sg.sawtooth(2*np.pi*(freq+d)*t)
    b,a=sg.butter(2,900/(sr/2)); s=sg.lfilter(b,a,s)/3
    env=np.minimum(1,t/1.2)*np.minimum(1,(dur-t)/1.5); return s*env
def add(x,s,t0):
    i=int(t0*sr); out_len=min(len(s),n-i)
    if out_len>0: x[i:i+out_len]+=s[:out_len]
pad_l=np.zeros(n); pl=np.zeros(n)
bar=4*beat; k=0; t=0.0
while t<T-0.5:
    name,notes=chords[k%4]
    for m in notes: add(pad_l,pad(f(m-12),bar+1.2)*0.5,t)
    add(pl,pluck(f(notes[0]-12),bar*1.0,0.9),t)
    arp=[notes[0],notes[1],notes[2],notes[1]+12,notes[2],notes[1]]
    for j,m in enumerate(arp*2):
        tt=t+j*beat/2
        if tt<t+bar: add(pl,pluck(f(m+12),2.0,0.55 if j%2 else 0.75),tt)
    t+=bar; k+=1
mix=pl*0.9+pad_l*0.55
# reverb
ir=np.random.RandomState(1).randn(int(sr*2.6))*np.exp(-np.arange(int(sr*2.6))/sr*2.2)
wet=sg.fftconvolve(mix,ir)[:n]*0.05
y=mix*0.7+wet
y=y/np.max(np.abs(y))*0.9
fade=np.minimum(1,np.arange(n)/(sr*2.0))*np.minimum(1,(n-np.arange(n))/(sr*3.0))
y*=fade
wf.write('music.wav',sr,(y*32767).astype(np.int16))
