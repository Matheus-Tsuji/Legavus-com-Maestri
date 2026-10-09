# RELATORIO-layout — QA (branch fix/layout-2-colunas)
Executado de verdade: Playwright (Edge) em http://localhost:8765, 1440/1024/768/375, scripts + prints; leitura de index.html, main.js, retorno.js, captura.js, style.css. Não alterei código.

1. 2 colunas desktop — PASSOU. Stepper no topo da esquerda (y=56), Dossiê à direita em todas as telas; `.col-esq-corpo` (overflow auto) e `.dossie-corpo` rolam sozinhos (scroll esq=60, dossiê=0, janela=0).
2. Stepper 5 fases — PASSOU. Preparação `A* F F F F` → Captura `C A*` → após Revisar `C C A*` → Enviar `C C C A*` → fim `C C C C C*`; `aria-current=step` sempre em 1 item.
3. Painel Dossiê — PASSOU. 5 itens de acordeão sempre no DOM; vazio → loading (skeleton + role=status) → preenchido (chips + 5 itens); Original x Revisada alterna (aria-pressed). Só [PLACEHOLDER]/[CONTEÚDO DO LEITOR].
4. Responsivo — PASSOU com ressalva. 768 e 375 empilham (stepper → ação → Dossiê), 0 rolagem horizontal. 1024 permanece em 2 colunas (503/457 px), sem overflow: é o desenho do T10/PLANO §3 (≥1024 = 2 col), mas o checklist pedia empilhar em 1024. Confirmar com o Orquestrador qual vale.
5. Regressões — PASSOU. Título ≤9 ("O título precisa ter mais de 9 caracteres."), data futura ("precisa estar no passado"), erros somem ao corrigir; contador 64/50 libera Revisar; @ lista 5 pessoas, # lugares; "Criar “xyzw” como nova pessoa" aparece; Criar via teclado abre modal com nome pré-preenchido; Cancelar fecha; Salvar insere chip (P006/P007, status=new); Ver JSON traz id,label,entityType,status (existing/new); Esc fecha. NOK (?nok=…): badge NOK + "Tentar novamente" visível, Avançar bloqueado, stepper fica na fase 1.
6. Teclado/foco/aria — PASSOU com bug. Skip-link é o 1º Tab; foco visível (outline 2px dourado); aria-live em contadores, IA, loading, narrativa. prefers-reduced-motion: classe `anim` ausente, 0 transições/animações >50ms, barras sem transição.
7. Visual — PASSOU. Serifa (Cormorant) + sans (Inter), off-white + dourado, cartão único; coerente com o molde (2 colunas, stepper, Dossiê com acordeão numerado). Diferença aceita: stepper tem Preparação (5 fases por DECISÕES 15).
8. Dados inventados/console — PASSOU. Só [NOME PESSOA n]/[ID …]/[CONTEÚDO DO LEITOR]; rodapé "[AVISO DE PRIVACIDADE — PENDENTE]". Console: 0 erros em todos os fluxos (desktop, 3 viewports, NOK, reduced-motion).

## Bugs
- QA-L1 (média, a11y): ao abrir qualquer modal (Nova pessoa/lugar e Ver JSON) o foco fica em BODY (`document.activeElement`=BODY após 600–800 ms), não no 1º campo/dialog; teclado/leitor de tela não são levados ao modal. Esperado: foco no campo Nome / título do modal. Provável: js/captura.js `abrirModal` (≈l.268–272) — `focar.focus()` falha (alvo sem tabindex/escondido por animação do animacoes.js) ou é roubado pelo editor ao sair do popup (l.309).
- QA-L2 (baixa, a validar): 1024 em 2 colunas vs. checklist (ver item 4).
Não testado: leitor de tela real; trap de foco completo dentro do modal.

Veredito: APROVADO COM RESSALVAS — corrigir QA-L1 e decidir QA-L2; reteste após correção.
