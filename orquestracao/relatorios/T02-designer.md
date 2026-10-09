# T02 — Prisma (Frontend Designer)
Arquivos: `index.html`, `css/style.css`. Preview: http://localhost:8765/index.html (python http.server, HTTP 200).
- Todos os ids do CONTRATO (3.1–3.7) presentes (conferido por script). Direção: "arquivo de memórias": marfim, grafite, filete dourado, números e títulos em serifa itálica.
- Tokens em `:root`; `--accent-gold-ink #7A5C2E` para texto dourado (o `#B08D57` não passa AA em texto); verde-oliva (ok) e tijolo (nok).
- Convenções que a Forja deve seguir (fora do contrato):
  - Barras: o id fica no `.progress-bar-inner` (com `role=progressbar`). Setar `style.width` ou `--progress`; `aria-valuenow=100` pinta de verde.
  - Badge: o texto é do HTML/JS ("Aguardando", "Carregando…", "OK", "NOK"); o ícone vem do CSS via `data-status`.
  - Retry: atributo `hidden` (remover quando `nok`). Telas: `view-active` / `view-hidden`. Modais: `.modal-open` / `.modal-hidden`.
  - Stepper: `.is-active` / `.is-completed` no `.step-item`. Dossiê: `data-state` controla vazio/loading/conteúdo.
  - Acordeão: `.is-open` no `.accordion-item` + `aria-expanded` no botão. `#toggle-comparacao`: botões `data-mode="original|revisada"` com `aria-pressed`.
  - Modal de entidade: alternar `hidden` entre `#form-nova-pessoa` e `#form-novo-lugar` e trocar o título.
  - Chips: `.entity-chip[data-entity-type][data-status]` no editor (renderHTML do nó) e `.chip` no Dossiê. Placeholder do editor: classe `is-editor-empty` + `data-placeholder`.
- `importmap` do TipTap está no HTML; `js/main.js` é carregado como módulo (ainda não existe). `animacoes.js` entra na T07.
- Não verificado em navegador (sem captura de tela); polimento e auditoria ficam para a T08.
- Pendente: [AVISO DE PRIVACIDADE — PENDENTE] no rodapé (INFORMACOES.md). Pedir ao Ramo: commit em dev só de index.html e css/style.css, "feat(ui): estrutura html e tokens css (T02)".
