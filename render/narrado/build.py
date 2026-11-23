import subprocess,sys
R='/home/claude/gtarquive-midia/origem/rockstar/2026-11-13-'
T1=R+'trailer1-oficial-bruto.mp4';T2=R+'trailer2-oficial-bruto.mp4'
shots=[(0,3.9,T1,3),(3.9,6.6,T1,19.5),(6.6,9.3,T2,36),(9.3,12.4,T2,120),(12.4,13.7,T2,42),(13.7,15.0,T2,27),(15.0,16.4,T2,33),(16.4,18.6,T2,87),(18.6,22.1,T2,126),(22.1,24.8,T2,77),(24.8,27.4,T1,12),(27.4,29.0,T1,36),(29.0,31.8,T1,72),(31.8,36.4,T2,153)]
ov=0.4
for i,(s,e,src,ss) in enumerate(shots):
    L=e-s+ov+0.2
    d=1 if i%2==0 else -1
    pan = "(iw-1080)*(0.30+0.40*t/%.2f)"%L if d==1 else "(iw-1080)*(0.70-0.40*t/%.2f)"%L
    fc=(f"[0:v]split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=45:10,eq=brightness=-0.28:saturation=1.1[bg];"
        f"[b]scale=-2:1300,crop=1080:1300:x='{pan}':y=0,format=rgba[f];[1:v]format=gray[m];[f][m]alphamerge[fa];"
        f"[bg][fa]overlay=0:310:format=auto,eq=contrast=1.07:saturation=0.92,colorbalance=rs=.04:bs=-.03:rh=.03:bh=-.02,vignette=PI/4.5,noise=alls=7:allf=t,fps=30,format=yuv420p[o]")
    cmd=['ffmpeg','-v','error','-y','-ss',str(ss),'-t',f'{L:.2f}','-i',src,'-loop','1','-t',f'{L:.2f}','-i','mask.png','-filter_complex',fc,'-map','[o]','-an','-c:v','libx264','-preset','veryfast','-crf','17',f'shot{i:02d}.mp4']
    subprocess.run(cmd,check=True); print('shot',i,flush=True)
