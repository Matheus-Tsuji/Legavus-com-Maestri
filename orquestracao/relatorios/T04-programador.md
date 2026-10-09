# Relatório T04 — Forja (Programador)
- Arquivos: `js/preparacao.js`, `js/main.js`. HTML/CSS não alterados.
- Passo 1: `carregarEntidadesDoUsuario()`; barras via `--progress` + `aria-valuenow` (100 = verde), badges via `data-status` + texto (Aguardando/Carregando…/OK/NOK).
- `#contador-referencias`: "Carregando referências do seu Grafo… [X/10]" item a item (Pessoas, depois Lugares) → "✓ Referências carregadas".
- `#btn-passo-2` só habilita após passo 1 OK; passo 2 roda `conectarIA()` → `ativarLeitorNarrativo()`; no retry, etapas já OK são puladas.
- NOK: badge `nok`, barra volta a 0, retry (`hidden` removido). `#btn-avancar-captura` habilita só com passo 2 OK.
- `main.js`: `mostrarTela(nome)` alterna `view-active`/`view-hidden`, rola ao topo e foca o h1 da tela (gancho para a transição GSAP da T07).
- Teste Playwright (Edge) em localhost:8765: fluxo OK, NOK em `ativarLeitorNarrativo` + retry, NOK em `carregarEntidadesDoUsuario` → todos corretos.
- Para o Prisma (console): `Unexpected token 'export'` vem do `<script defer src=".../split-type@0.3.4/dist/index.js">` (é ESM); usar `.../split-type@0.3.4/umd/index.min.js`. 404 do `favicon.ico`: adicionar `<link rel="icon" href="data:,">` ou um ícone.
- Status: FEITO.
