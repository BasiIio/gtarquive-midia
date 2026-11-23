import subprocess
shots=[(0,3.9),(3.9,6.6),(6.6,9.3),(9.3,12.4),(12.4,13.7),(13.7,15.0),(15.0,16.4),(16.4,18.6),(18.6,22.1),(22.1,24.8),(24.8,27.4),(27.4,29.0),(29.0,31.8),(31.8,36.4)]
ov=0.4
ins=[]
for i in range(len(shots)): ins+=['-i',f'shot{i:02d}.mp4']
ins+=['-loop','1','-t','40','-i','/home/claude/gtarquive-midia/marca/logo-gtarchived.jpg','-i','/home/claude/gtarquive-midia/audio/voz/2026-11-23-13anos.mp3','-i','music.wav']
N=len(shots)
fc=''
prev='[0:v]'
for k in range(1,N):
    off=shots[k][0]-ov
    fc+=f"{prev}[{k}:v]xfade=transition=fade:duration={ov}:offset={off:.2f}[x{k}];"
    prev=f'[x{k}]'
F="/usr/share/fonts/opentype/inter/InterDisplay-SemiBold.otf"
FB="/usr/share/fonts/opentype/inter/InterDisplay-Bold.otf"
def esc(s): return s.replace(":","\\:").replace("'","\u2019")
def cap(txt,a,b,y=1700,size=64,font=F,col='white'):
    return (f"drawtext=fontfile={font}:text='{esc(txt)}':fontsize={size}:fontcolor={col}:x=(w-text_w)/2:y={y}:"
            f"shadowcolor=black@0.7:shadowx=2:shadowy=3:line_spacing=10:alpha='if(lt(t,{a}),0,if(lt(t,{a+0.25}),(t-{a})/0.25,if(lt(t,{b-0.25}),1,if(lt(t,{b}),({b}-t)/0.25,0))))'")
o=0.4
phr=[("Em 2013, você tinha uns 12 anos.",0,3.2),("Foi quando saiu o último GTA,",3.6,6.0),("e a gente achou que o próximo\nvinha logo.",6.5,8.9),("Não veio.",9.3,10.2),("Vieram 13 anos.",10.5,12.0),("Você terminou a escola,",12.3,13.6),("mudou de cidade, arrumou um emprego,",13.7,16.0),("alguns de nós já têm filhos.",16.3,18.2),("E o tempo todo, uma coisa não mudou.",18.4,21.7),("A gente nunca parou de esperar.",22.1,24.3),("Hoje o jogo existe,",24.8,26.4),("e ele chegou para quem cresceu\nesperando por ele.",26.4,29.0),("Onde você estava em 2013?",29.1,31.4)]
filters=[]
for t,a,b in phr: filters.append(cap(t,a+o,b+o))
filters.append(cap("2013",0.5,9.4,y=95,size=170,font=FB,col='white@0.92'))
filters.append(cap("13 ANOS",10.6,17.9,y=95,size=170,font=FB,col='white@0.92'))
filters.append(cap("2026",24.8,29.6,y=95,size=170,font=FB,col='white@0.92'))
filters.append(f"drawtext=fontfile={F}:text='Imagens\\: Rockstar Games':fontsize=24:fontcolor=white@0.45:x=(w-text_w)/2:y=1862:enable='lt(t,31.8)'")
filters.append("drawbox=x=0:y=0:w=1080:h=1920:color=black@0.80:t=fill:enable='between(t,31.8,40)'")
fc+=f"{prev}"+",".join(filters)+"[v0];"
fc+=f"[{N}:v]scale=420:420,format=rgba,fade=t=in:st=31.9:d=0.5:alpha=1[lg];[v0][lg]overlay=330:640:enable='gte(t,31.8)'[v1];"
fc+=f"[v1]drawtext=fontfile={FB}:text='Segue a GTArchived':fontsize=64:fontcolor=white:x=(w-text_w)/2:y=1130:alpha='if(lt(t,32.2),0,min(1,(t-32.2)/0.4))',drawtext=fontfile={F}:text='tudo de GTA 6, todo dia':fontsize=40:fontcolor=white@0.8:x=(w-text_w)/2:y=1225:alpha='if(lt(t,32.4),0,min(1,(t-32.4)/0.4))'[vout];"
fc+=f"[{N+1}:a]adelay=400|400,volume=1.35,asplit[va][vb];[{N+2}:a]volume=0.55[mu];[mu][vb]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[va][md]amix=inputs=2:duration=longest:normalize=0,afade=t=out:st=35:d=1.4,loudnorm=I=-15:TP=-1.5[aout]"
cmd=['ffmpeg','-v','error','-y']+ins+['-filter_complex',fc,'-map','[vout]','-map','[aout]','-t','36.4','-c:v','libx264','-preset','medium','-crf','22','-maxrate','2400k','-bufsize','4800k','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','13anos.mp4']
subprocess.run(cmd,check=True)
