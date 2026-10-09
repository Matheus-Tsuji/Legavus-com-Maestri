# Relatório T06 — Forja (Programador)
- Arquivos: `js/retorno.js`, `js/main.js` (`iniciarRetorno(iniciarCaptura(entidades))`). HTML/CSS não alterados.
- Revisar: painel `data-state="loading"`, Revisar travado, stepper fica na etapa 1, chama `enviarAoLeitorNarrativo(montarPayload())`. Falha: painel volta ao estado anterior + aviso em `#msg-validacao-narrativa`.
- Pronto: `data-state="ready"`; chips `.chip[data-entity-type][data-status]` com label + `<small>tipo · id · status</small>`; 5 seções preenchidas (lacunas e perguntas como `<ul>`, perguntas só leitura). Tudo por `textContent` (texto do usuário nunca vira HTML).
- Acordeão: `.is-open` + `aria-expanded` por clique (vários abertos ao mesmo tempo). `#toggle-comparacao`: Original (`payload.texto`) × Revisada, com `aria-pressed`.
- Stepper (DECISOES 2): após o retorno, 1 concluída / 2 ativa e Enviar habilitado. Enviar → 3 ativa ("Análise ontológica em andamento…") → 1,2s → 1–4 concluídas + "✓ Experiência registrada (simulação)".
- Ponto de troca: o envio para Análise/Registro é um `setTimeout` em retorno.js com `// TROCAR PELO BACKEND`; não há função para isso em mock.js (a T03 lista só 5).
- Teste Playwright (Edge) em localhost:8765: falha do Leitor + retry, chips, 5 seções, acordeão, alternância, stepper 1→2→3→4, texto `<b>` sem injeção → OK. Console: só os 2 erros do HTML (SplitType ESM, favicon; ver T04).
- Não feito: botão "usar revisão no editor" (fora do contrato); o usuário edita e revisa de novo. Depois do registro, editar o texto reabilita o Revisar.
- Status: FEITO.
