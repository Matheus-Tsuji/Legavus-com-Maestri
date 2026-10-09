# T10 — Prisma: layout 2 colunas (substitui T08)
Arquivos: `index.html`, `css/style.css`, `js/animacoes.js`, `PLANO.md` §3 (contrato atualizado). Branch fix/layout-2-colunas. Testado em http://localhost:8765 (Playwright/Edge, 1440/1024/768/375): fluxo completo, 0 erros de console, 0 overflow horizontal. Prints 01–09 (desktop/notebook/tablet/mobile) em `orquestracao/pesquisa/prints/`.
- Estrutura: `#app.app-card` = cartão único. Esquerda `.col-esq`: `#stepper-fluxo` (fora das views) + `.col-esq-corpo` com `#view-preparacao`/`#view-captura` (views = só a coluna esquerda). Direita: `#painel-dossie` fora das views, sempre visível. Desktop ≥1024: cartão na altura útil, cada coluna rola sozinha. <1024: empilha (stepper rolável na horizontal → ação → Dossiê).
- Impeccable (polish): ícones SVG desenhados (máscara CSS) no lugar de glifos (✓ ✕ ◍ ◆), `::selection`, caret e scrollbar temados, `html.lenis body` corrigido (lenis.css quebrava a altura), contraste AA (placeholder `#736D66`, número do passo ativo grafite sobre dourado), menu @/# confere dentro da viewport a 375px.
- **A Forja precisa ligar:**
  1. `retorno.js` `stepper(n)`: agora são 5 fases e a Preparação é a 1. Antiga N vira N+1: após Revisar `stepper(3)` (fase 3 ativa); Enviar → `stepper(4)`; fim → `stepper(6)` (todas ✓) e o `aria-current` na 5 (o hack `[data-step="4"]` passa a `"5"`).
  2. `main.js`/`preparacao.js`: ao entrar na Captura chamar `stepper(2)` (1 concluída, 2 ativa); na Preparação a fase 1 já vem `is-active` + `aria-current`. `stepper` hoje vive em retorno.js: exportar ou mover para main.js.
  3. `#indicador-ia` (novo, `.status-badge`, `data-status="idle|loading|ok|nok"`, texto "IA: aguardando"): atualizar durante `conectarIA`/`ativarLeitorNarrativo` (ex.: "IA: conectando…", "IA: Leitor ativo", "IA: falhou").
  4. `#msg-erro-entidade` (T07) continua à espera de ligação em captura.js.
- Sem pin/parallax (decisão T07 mantida). Saída de modal/menu é instantânea. Acordeão numerado (1.–5.) seguindo o molde, pois é sequência.
- Ramo commita: `index.html`, `css/style.css`, `js/animacoes.js`, `orquestracao/PLANO.md`, prints, relatório.
