# Relatório T13 — Forja (QA-L3 e QA-L4)
- QA-L3: listener do acordeão saiu do `retorno.js` e foi para o boot do `main.js` (liga uma vez, painel visível desde a Preparação). Playwright: na Preparação a 1440 e 375, os 5 cliques alternam `aria-expanded`/`.is-open` (tffff → ftttt); na Captura 1 clique muda só 1 seção (sem listener duplicado).
- QA-L4: `prenderFoco` no keydown que já existia no `captura.js` (sem dependência): Tab/Shift+Tab circulam entre os focáveis visíveis do `.modal.modal-open` (pula o form escondido e os desabilitados); se o foco estiver fora, volta ao 1º/último.
- Playwright: Pessoa (6 Tab: nome > idade > sexo > Cancelar > Salvar > nome; 6 Shift+Tab ao contrário), Lugar (6 Tab circulam), Ver JSON (Fechar > pre > pre > Fechar). Esc devolve o foco ao gatilho (editor / "Ver JSON"); fora do modal o Tab segue livre.
- Regressão: fluxo completo da T11 (NOK carga/IA/Leitor + retry, validações, @ #, modal com erro, P006, JSON, stepper até 5✓) → OK. Console: 0 erros.
- Status: FEITO.
