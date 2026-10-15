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

O status AO VIVO/OFFLINE é simulado em `src/data/site.ts`. `src/lib/twitch.ts` explica como trocar o mock por um endpoint seguro no futuro; nunca coloque um segredo da Twitch no código do navegador.

Para gerar os arquivos com caminho de publicação do GitHub Pages deste repositório: `GITHUB_PAGES=true npm run build`.
