# GTArquive · mídia

Hospedagem pública dos vídeos do @gtarquive e renderizador dos Reels.

- `render/render.js`: gera um Reel vertical (1080x1920, 6 s) na identidade do GTArquive. O primeiro quadro já traz todo o conteúdo, então a capa nunca sai vazia.
- `render/fonts/`: fontes usadas (Archivo e JetBrains Mono, licença OFL).
- `reels/`: vídeos prontos. O endereço público de cada um é `https://raw.githubusercontent.com/BasiIio/gtarquive-midia/main/reels/<arquivo>.mp4`.

Uso: `NODE_PATH=$(npm root -g) node render/render.js '{"tipo":"noticia","selo":"OFICIAL","tema":"...","manchete":"...","apoio":"...","fonte":"..."}' saida`
