# Relatório T11 — Forja (Programador)
- Branch `fix/layout-2-colunas` (não trocada). Arquivos: `js/main.js`, `js/preparacao.js`, `js/retorno.js`. `captura.js` sem mudança (o `#msg-erro-entidade` já estava ligado desde a T05b). HTML/CSS intocados.
- Stepper de 5 fases: `stepper(n)` movido para `main.js` e exportado (retorno.js importa). Entrar na Captura → `stepper(2)`; retorno do Leitor → `stepper(3)`; Enviar → `stepper(4)`; fim → `stepper(6)` (todas ✓, `aria-current` na 5 pela própria função; o hack `[data-step=4]` saiu).
- `#indicador-ia`: "IA: conectando…" (loading) ao iniciar o passo 2, "IA: Leitor ativo" (ok) quando `ativarLeitorNarrativo` termina, "IA: falhou" (nok) em qualquer falha; o retry volta para loading.
- `mostrarTela` também rola `.col-esq-corpo` ao topo (no desktop é a coluna que rola).
- Playwright (Edge 1440, localhost:8765): NOK na carga → retry; NOK em conectarIA → indicador nok → retry → ok; Captura com fases 1✓ 2 ativa; validações; @ # e criar; erro do modal em `#msg-erro-entidade`; Cancelar volta ao menu; P006 new; 50 palavras; Ver JSON; NOK no Leitor → retry; fases 3 → 4 → todas ✓ (aria-current na 5). **Console: 0 erros.**
- Status: FEITO.
