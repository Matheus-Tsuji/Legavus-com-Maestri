# Relatório T15 — Forja (envio direto, DECISÕES 19)
- Branch `fix/envio-direto`. Arquivos: `js/captura.js`, `js/retorno.js`. Nenhuma referência a `#btn-revisar` nem a "Revisar" em js/ (testado com e sem o botão no HTML).
- `#btn-enviar-analise` habilita com título > 9 + data passada válida + ≥ 50 palavras; trava enquanto `estado.ocupado` (exposto pela captura). Mensagem: "Faltam N palavras para enviar." / "Falta 1 palavra…".
- Clique: fase 3 + Dossiê `loading` → `enviarAoLeitorNarrativo` → `ready` (chips, 5 abas, Original × Revisada) → fase 4 "Análise ontológica em andamento…" (1,2 s mock) → todas ✓ com `aria-current` na 5 + "✓ Experiência registrada (simulação)".
- Falha do Leitor: Dossiê e stepper voltam ao estado anterior, aviso "O Leitor Narrativo não respondeu. Tente enviar novamente.", botão liberado. Depois do registro o botão fica travado até o usuário editar; editar durante a análise não o libera.
- Playwright (localhost:8765, `?nok=enviarAoLeitorNarrativo`): validações, NOK → reenvio, fluxo completo, edição pós-registro → 2º envio, Ver JSON → OK. Console: 0 erros.
- Status: FEITO.
