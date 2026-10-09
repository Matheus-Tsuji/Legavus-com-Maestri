# Relatório T05b — Forja (Programador)
- `js/captura.js`: imports `@tiptap/pm` (state/view) de 2.11.5 → 2.27.3, igual ao importmap unificado pelo Prisma.
- Modal de entidade: erro de `salvarEntidadeNoArquivo` agora vai para `#msg-erro-entidade` (elemento novo do Prisma); botão volta a "Salvar"; mensagem limpa ao abrir/salvar.
- Playwright (Edge, localhost:8765): 1 só core carregado (`core@2.27.3`); T05 completo + falha/retry do salvar + T06 completo → OK. Console sem erros (SplitType e favicon resolvidos pelo Prisma).
- Status: FEITO.
