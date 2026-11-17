# GTArquive · mídia

Hospedagem pública dos vídeos do @gtarquive e renderizador dos Reels.

- `render/render.js`: gera um Reel vertical (1080x1920, 6 s) na identidade do GTArquive. O primeiro quadro já traz todo o conteúdo, então a capa nunca sai vazia.
- `render/fonts/`: fontes usadas (Archivo e JetBrains Mono, licença OFL).
- `reels/`: vídeos prontos. O endereço público de cada um é `https://raw.githubusercontent.com/BasiIio/gtarquive-midia/main/reels/<arquivo>.mp4`.

Uso: `NODE_PATH=$(npm root -g) node render/render.js '{"tipo":"noticia","selo":"OFICIAL","tema":"...","manchete":"...","apoio":"...","fonte":"..."}' saida`

## Regra: variedade visual entre posts seguidos
- Nunca publicar posts seguidos com o mesmo plano/imagem de capa ou o mesmo trecho de vídeo.
- Antes de montar, conferir a capa e os clipes dos últimos 6 posts no grid (reels/ e capas/) e escolher cena diferente.
- Capa nunca pode ser quadro escuro/preto: validar o primeiro frame.
- Se só houver uma fonte de imagem, variar o ponto (ss) do clipe e o enquadramento, ou usar carrossel/card em vez de vídeo.

## Regra: mostrar o detalhe de que se fala
- Em vídeo de "detalhes", cada item precisa mostrar o detalhe em destaque: recorte com zoom (crop + scale) no objeto, seta ou círculo no lugar, pausa/congelar o quadro por 1 a 2 s enquanto a voz cita.
- Nunca deixar o trailer rolando solto sobre uma fala que cita um objeto específico.
- Se o quadro do detalhe não foi achado e conferido, o item não entra no vídeo.
- Conferir na folha de contato: o detalhe está legível e ocupa boa parte da tela quando a voz o cita.
