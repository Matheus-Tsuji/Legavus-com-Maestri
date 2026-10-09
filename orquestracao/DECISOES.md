# DECISOES (Fase 1: "ok" do usuario = aceitar todas as sugestoes padrao)
1. Data: input de calendario (type=date), exibida dd-mm-aaaa, obrigatoria, valida e no passado. Checkbox "Grau de exatidao" vira flag `dataAproximada` no payload; nao muda a regra.
2. Stepper 4 etapas: Narracao (ativa ate Revisar) -> Enviar p/ Analise e Registro (ativa apos 1o retorno do Leitor) -> Analise Ontologica (durante o envio, estado carregando) -> Registro (concluido, mock).
3. Estrutura: pagina unica, 3 telas em etapas (Preparacao -> Captura com Dossie ao lado), sem rotas.
4. Dossie: lista "Referencias marcadas por voce" com chips (tipo, label, id, status existing/new), separada do texto simples.
5. Gatilhos: so @ (Pessoa) e # (Lugar); arquitetura pronta para novos simbolos.
6. Titulo > 9 caracteres; Revisar exige >= 50 palavras; ids P001/L001 gerados no front (mock).
7. Nova Pessoa/Lugar: so memoria + mock salvarEntidadeNoArquivo.
8. Dados: somente placeholders [NOME PESSOA 1] etc. Empresa/slogan/LGPD: [PENDENTE] (placeholder).
9. Dossie: 5 secoes com [CONTEUDO DO LEITOR]; usuario nao responde as Perguntas de Validacao na POC.
10. Servir via servidor estatico local; Preview em portal do Maestri.
11. Git: autor Matheus-Tsuji <matheustcar@gmail.com>, repo so local (sem remoto), main+dev, tag v0.1-poc ao final.
12. Entrega final: README.md de vitrine (o que a ferramenta faz, telas, fluxo @/#, JSON, como rodar, onde trocar mocks, prints). Prisma/Forja fornecem conteudo e prints; Ramo commita em dev e, com aval, merge em main + tag v0.1-poc. Push para GitHub so com confirmacao do usuario (hoje nao ha remoto).
13. Fase 4: arvore de trabalho unica e agentes em paralelo => commits em dev por tarefa (Ramo, add so dos arquivos da tarefa), sem branches feat/ simultaneas.
14. TipTap: unificar em 2.27.3 (importmap Prisma + import pm no captura.js Forja). Mention aceita 1 suggestion: extensao propria com 2 Suggestion (achado da Forja, corrige pesquisa T01).
15. Correcao de layout (aprovada): cartao unico em 2 colunas em todas as telas; stepper de 5 fases (1 Preparacao, 2 Narracao, 3 Enviar p/ Analise e Registro, 4 Analise Ontologica, 5 Registro) no topo da esquerda; acao a esquerda, Dossie sempre visivel a direita; molde: referencias/layout-referencia.png. Branch fix/layout-2-colunas. Fase 6 (merge main, tag, README, push) so apos pergunta ao usuario.
16. QA-L2: 1024px fica em 2 colunas (prompt define desktop >= 1024); empilha abaixo de 1024.
17. Pedido do usuario: (a) coluna esquerda com campos como CAIXAS DE TEXTO visiveis (titulo, data, editor TipTap em caixa com toolbar, como referencias/layout-referencia.png); (b) Dossie com as 5 abas horizontais do acordeao SEMPRE visiveis, abrindo/fechando para baixo, inclusive no estado vazio (1. Parecer aberto com '(parecer narrativo gerado)'; 2 a 5 recolhidas).
18. CANCELADO: o usuario aprovou o layout atual de dev (Preparacao e Captura como esta). Nenhuma mudanca da T14 foi aplicada.
19. Pedido do usuario: remover o botao "Revisar" (por enquanto). Com titulo valido + data passada + >=50 palavras, "Enviar para Analise e Registro" habilita direto. Ao clicar: fase 3 ativa + Dossie carregando -> Dossie pronto -> fase 4 (Analise Ontologica, mock) -> todas concluidas (fase 5 registrada). Substitui os itens 2 e 6 neste ponto.
