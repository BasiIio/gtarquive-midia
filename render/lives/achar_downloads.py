# uso: python3 achar_downloads.py listagem.txt tamanho1 tamanho2 ...  -> imprime o nome do arquivo de cada tamanho (mais recente)
import re,sys
t=open(sys.argv[1]).read(); want=set(sys.argv[2:]); best={}
for m in re.finditer(r'\{[^{}]*?"name":\s*"([^"]*)"[^{}]*?"size":\s*(\d+)[^{}]*?"mtimeMs":\s*([\d.]+)[^{}]*?\}',t):
    n,s,mt=m.group(1),m.group(2),float(m.group(3))
    if s in want and (s not in best or mt>best[s][1]): best[s]=(n,mt)
for s in sys.argv[2:]: print(s, best.get(s,('NAO_ACHEI',0))[0])
