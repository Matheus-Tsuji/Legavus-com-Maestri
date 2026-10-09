# Relatório T03 — Forja (Programador)
- Arquivos: `data/entidades.js`, `services/mock.js` (ES modules). Nada mais alterado.
- `entidades`: 5 pessoas + 5 lugares, só placeholders (`[ID PESSOA 1]`, `[NOME LUGAR 1]`...), status "Existente".
- `mock.js` exporta as 5 funções (cada uma com `// TROCAR PELO BACKEND`), todas Promise + setTimeout aleatório 400–1200ms.
- `carregarEntidadesDoUsuario()` devolve cópia (structuredClone) de `entidades`.
- `enviarAoLeitorNarrativo(payload)` devolve a resposta do PLANO 4.3 com `[CONTEUDO DO LEITOR: ...]`; `referenciasIdentificadas` vem de `payload.referencias`.
- `salvarEntidadeNoArquivo(entidade)` devolve `{...entidade, id, status: "new"}` com ids P006, P007... / L006...; falha não consome id. Incluir na lista em memória fica com captura.js (T05).
- Falha NOK: `simulacao.falhar.add("conectarIA")` no código, ou URL `?nok=conectarIA,ativarLeitorNarrativo`.
- Teste: script node (assert) cobrindo contagens, placeholders, tempos, P006/L006/P007, rejeição NOK e 5 comentários TROCAR PELO BACKEND → "OK T03".
- Status: FEITO. Commit pedido ao Ramo em `dev`.
