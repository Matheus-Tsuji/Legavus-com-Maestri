# T15 — Prisma: envio direto
- `index.html`: removido `#btn-revisar`; a ajuda do estado vazio do Dossiê agora cita "Enviar para Análise e Registro" (não "Revisar").
- `css/style.css`: removidas as regras `.btn-secondary` (só o Revisar usava). `js/animacoes.js` sem mudança. `PLANO.md` §3.3 e §5.1: `#btn-revisar` removido; `#btn-enviar-analise` habilita direto.
- Forja liga: habilitar `#btn-enviar-analise` com título + data + ≥50 palavras; tirar referências a `#btn-revisar` (captura.js `validar`, retorno.js); textos de `#msg-validacao-narrativa` ("Faltam N palavras para enviar").
- Não testei no navegador (só edição de HTML/CSS/docs).
