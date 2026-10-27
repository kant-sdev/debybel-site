# Debybel — Stream

Site de uma página, em português e inglês, para a comunidade da Debybel na Twitch.

## Rodar localmente

Requer Node.js 20.19+ (ou 22.12+).

```sh
npm install
npm run dev
```

Para validar e gerar os arquivos de produção: `npm run typecheck` e `npm run build`.

## Editar o conteúdo

Textos em PT/EN, links, jogos, regras, comandos e tabelas de recompensas ficam em `src/data/site.ts`. Links sem URL permanecem desativados até serem preenchidos. As quatro capas de jogos são placeholders.

O status AO VIVO/OFFLINE é consultado pela função serverless `api/twitch-status.ts`, usando as credenciais `TWITCH_CLIENT_ID` e `TWITCH_CLIENT_SECRET` configuradas no ambiente da Vercel ou em `.env.local` durante o desenvolvimento. O Vite carrega essas variáveis no processo do servidor e executa os handlers localmente, sem expô-las no bundle do navegador. O hook `src/hooks/useTwitchStatus.ts` consulta `/api/twitch-status` ao montar e a cada 60 segundos. Não exponha as credenciais no código do navegador.

Os detalhes dos jogos podem ser consultados pela função serverless `api/steam-games.ts`, sem chave de API. Use `/api/steam-games?appids=730,292030` (ou repita o parâmetro `appids`); a resposta inclui o ID, nome, imagem de cabeçalho e descrição curta de cada jogo e usa cache compartilhado por uma hora.

Para testar as funções localmente, configure as credenciais em `.env.local` e rode `npm run dev`. O `vite.config.ts` registra as rotas no `vite-plugin-vercel` e fornece o middleware de desenvolvimento para executar os handlers de `api/`.

Para gerar os arquivos com caminho de publicação do GitHub Pages deste repositório: `GITHUB_PAGES=true npm run build`.
