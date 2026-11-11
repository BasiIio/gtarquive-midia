# uso: python3 montar_narrado.py cfg.json saida.mp4   (rodar de qualquer pasta; usa caminhos absolutos no cfg)
import json,subprocess,sys,os,tempfile
cfg=json.load(open(sys.argv[1])); out=os.path.abspath(sys.argv[2]); here=os.path.dirname(os.path.abspath(__file__))
D=tempfile.mkdtemp(); FPS=30
vd=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',cfg['voz']]).decode())
LEAD=0.35; T=round(LEAD+vd+0.6,2); ENDD=2.6; M=round(T-ENDD,2)
subprocess.run(['node',os.path.join(here,'overlay_narrado.js'),sys.argv[1],D],check=True,env=dict(os.environ,NODE_PATH=subprocess.check_output(['npm','root','-g']).decode().strip()))
clips=cfg['clips']; n=len(clips); seg=M/n
inp=[]; fc=[]; lab=[]; CARDY=640
for i,c in enumerate(clips):
    dur=round(seg,3); frames=max(1,round(dur*FPS))
    inp+=['-ss',str(c['ss']),'-t',str(dur+0.5),'-i',c['src']]
    if c['src'].lower().endswith(('.jpg','.png')): inp[-5:]=['-loop','1','-t',str(dur+0.5),'-i',c['src']]
    fc.append(f"[{i}:v]fps={FPS},trim=duration={dur},setpts=PTS-STARTPTS,split[a{i}][b{i}]")
    fc.append(f"[a{i}]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=26,eq=brightness=-0.3:saturation=1.2[bg{i}]")
    fc.append(f"[b{i}]scale=-2:608,crop=1080:608,zoompan=z='1+0.10*on/{frames}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x608:fps={FPS},eq=contrast=1.06:saturation=1.1[fg{i}]")
    fc.append(f"[bg{i}][fg{i}]overlay=0:{CARDY},drawbox=x=0:y={CARDY-4}:w=1080:h=4:color=0xFF3E9A@1:t=fill,drawbox=x=0:y={CARDY+608}:w=1080:h=4:color=0x25E2E0@1:t=fill,setsar=1,format=yuv420p[v{i}]")
    lab.append(f"[v{i}]")
fc.append(''.join(lab)+f"concat=n={n}:v=1:a=0[main]")
nin=len(clips)
inp+=['-i',f'{D}/base.png','-loop','1','-t',str(ENDD),'-framerate',str(FPS),'-i',f'{D}/end.png','-i',cfg['voz']]
for i in range(len(cfg['frases'])): inp+=['-i',f'{D}/cap{i}.png']
ib=nin; ie=nin+1; iv=nin+2; ic0=nin+3
chain='[main]'+f'[{ib}:v]overlay=0:0[m0]'.replace('[main]','')
fc.append(f"[main][{ib}:v]overlay=0:0[m0]"); cur='m0'
for i,f in enumerate(cfg['frases']):
    t0=LEAD+f['t0']; t1=LEAD+f['t1'] if i<len(cfg['frases'])-1 else M
    fc.append(f"[{cur}][{ic0+i}:v]overlay=0:0:enable='between(t,{t0:.2f},{t1:.2f})'[m{i+1}]"); cur=f'm{i+1}'
fc.append(f"[{ie}:v]format=yuv420p,setsar=1[ev]")
fc.append(f"[{cur}]format=yuv420p[mv]")
fc.append(f"[mv][ev]concat=n=2:v=1:a=0[v]")
fc.append(f"[{iv}:a]aresample=44100,aformat=channel_layouts=stereo,adelay={int(LEAD*1000)}|{int(LEAD*1000)},apad,atrim=0:{T},loudnorm=I=-14:TP=-1.5:LRA=9[a]")
cmd=['ffmpeg','-y','-loglevel','error']+inp+['-filter_complex',';'.join(fc),'-map','[v]','-map','[a]','-c:v','libx264','-preset','veryfast','-crf','21','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',str(T),out]
r=subprocess.run(cmd,capture_output=True,text=True); print(r.stderr[-2000:]); r.check_returncode(); print('ok',out,T)
