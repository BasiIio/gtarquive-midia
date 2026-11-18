# uso: MARGINV=410 python3 legendas.py words.json offset_s saida.ass [pular_ini-pular_fim ...]
# Estilo do layout branco: amarelo com contorno preto, centralizado perto da base do video.
# words.json: lista [{"text","start","end"}] (ElevenLabs Scribe). Gera ASS 1080x1920, blocos de ate 4 palavras.
import json,sys,os
W=json.load(open(sys.argv[1])); off=float(sys.argv[2]); out=sys.argv[3]
skip=[tuple(map(float,s.split('-'))) for s in sys.argv[4:]]
W=[w for w in W if w.get('type','word')=='word' and not any(a<=w['start']<b for a,b in skip)]
def t(s):
    s=max(0,s); h=int(s//3600); m=int(s%3600//60); return f"{h}:{m:02d}:{s%60:05.2f}"
blocks=[];cur=[]
for i,w in enumerate(W):
    if cur and (len(cur)>=4 or w['start']-cur[-1]['end']>0.6): blocks.append(cur);cur=[]
    cur.append(w)
    if w['text'][-1:] in '.?!,' and len(cur)>=2: blocks.append(cur);cur=[]
if cur: blocks.append(cur)
hdr="""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: L,Archivo SemiBold Black,76,&H004DE1FF,&H004DE1FF,&H00000000,&H96000000,0,0,0,0,100,100,0,0,1,6,2,2,70,70,@MV@,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
L=[]
for j,b in enumerate(blocks):
    s=b[0]['start']+off; e=b[-1]['end']+off
    nxt=blocks[j+1][0]['start']+off if j+1<len(blocks) else e+0.4
    e=min(max(e+0.15,s+0.5),nxt)
    txt=' '.join(w['text'] for w in b).replace('{','').replace('}','')
    L.append(f"Dialogue: 0,{t(s)},{t(e)},L,,0,0,0,,{txt}")
hdr=hdr.replace('@MV@',os.environ.get('MARGINV','410'))
open(out,'w').write(hdr+'\n'.join(L)+'\n')
print(len(L),'legendas')
