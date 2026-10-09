# Relatório T11b — Forja (QA-L1: foco do modal em BODY)
- Causa: `js/animacoes.js` l.69 (Prisma), não o captura.js. `abrirModal` foca certo (`pessoa-nome` / `btn-fechar-json` a 0 e 100 ms); ao terminar o `gsap.from(el /* .modal */, { opacity: 0, …, clearProps: "all" })` (~250 ms), o foco cai em BODY (focusout com relatedTarget null). Provado no Playwright: sem a l.69 ou sem o animacoes.js → foco mantido.
- **Correção para o Prisma (testada via rota no Playwright):** l.69 → `clearProps: "opacity"` no lugar de `"all"`. Resultado: foco em `pessoa-nome` e em `btn-fechar-json` a 0/100/300/800 ms, 0 erros no console.
- Fechar já devolve o foco: Cancelar/Salvar/Esc da entidade → editor (ProseMirror focado, conferido); Ver JSON → o botão "Ver JSON" que o abriu (padrão WAI-ARIA; se quiserem o editor, é 1 linha).
- captura.js sem mudança. Trap de foco completo dentro do modal segue fora do escopo.
- Status: FEITO (correção depende de 1 linha no animacoes.js pelo Prisma).
