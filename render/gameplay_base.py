# Monta o vídeo base (cortes do trailer oficial em 1080x1920) a partir de gameplay.json.
import json, subprocess, sys
cfg = json.load(open(sys.argv[1])); src = sys.argv[2]; out = sys.argv[3]
FPS = 30; cuts = cfg['cuts']; T = cfg['total']
inputs = []; fc = []; labels = []
CARDY = 620
for i, c in enumerate(cuts):
    t0 = c['t']; t1 = cuts[i+1]['t'] if i+1 < len(cuts) else cfg['end']
    dur = round(t1 - t0, 3); sp = c.get('speed', 1.0); n = max(1, round(dur*FPS))
    inputs += ['-ss', str(c['src']), '-t', str(round(dur*sp+0.4, 3)), '-i', src]
    base = f"[{i}:v]setpts=(PTS-STARTPTS)/{sp},fps={FPS},trim=duration={dur},setpts=PTS-STARTPTS"
    zoom = 0.10 if c['mode'] == 'card' else 0.12
    if c['mode'] == 'card':
        fc.append(f"{base},split[a{i}][b{i}]")
        fc.append(f"[a{i}]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=26,eq=brightness=-0.2:saturation=1.2[bg{i}]")
        fc.append(f"[b{i}]zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x608:fps={FPS},eq=contrast=1.06:saturation=1.1[fg{i}]")
        fc.append(f"[bg{i}][fg{i}]overlay=0:{CARDY},drawbox=x=0:y={CARDY-4}:w=1080:h=4:color=0xFF3E9A@1:t=fill,drawbox=x=0:y={CARDY+608}:w=1080:h=4:color=0x25E2E0@1:t=fill,setsar=1,format=yuv420p[v{i}]")
    else:
        cx = c.get('cx', 0.5)
        fc.append(f"{base},crop=608:1080:x='max(0,min(1312,1920*{cx}-304))':y=0,scale=1080:1920:flags=lanczos,zoompan=z='1+{zoom}*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1080x1920:fps={FPS},eq=contrast=1.08:saturation=1.12,setsar=1,format=yuv420p[v{i}]")
    labels.append(f"[v{i}]")
endd = round(T - cfg['end'], 3)
fc.append(f"color=c=0x120726:s=1080x1920:r={FPS}:d={endd},setsar=1,format=yuv420p[vend]"); labels.append("[vend]")
fc.append("".join(labels) + f"concat=n={len(labels)}:v=1:a=0[vout]")
cmd = ['ffmpeg', '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', ';'.join(fc), '-map', '[vout]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', out]
r = subprocess.run(cmd, capture_output=True, text=True)
print(r.stderr[-1500:])
r.check_returncode()
print('base ok')
