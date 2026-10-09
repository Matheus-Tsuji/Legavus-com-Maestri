# TAREFAS DE EXECUÇÃO — LEGAVUS POC

Mapeamento de tarefas da POC do Frontend LEGAVUS a partir de T02, com donos estritos, dependências lógicas, arquivos designados e critérios de aceite verificáveis.

---

## T02: Estrutura HTML Semântica, Tokens CSS e Layout Base das 3 Telas
- **Dono:** Prisma (Frontend Designer)
- **Dependências:** T01
- **Arquivos:** `index.html`, `css/style.css`
- **Critérios de Aceite:**
  1. `index.html` contém estrutura HTML5 semântica completa e importa as fontes Google (`Cormorant Garamond` e `Inter`) e as bibliotecas via CDN (TipTap ESM, GSAP, SplitType, Lenis).
  2. Implementa rigorosamente todos os identificadores (IDs, classes e `data-*`) estabelecidos no **CONTRATO** do `PLANO.md` (containers `#app`, `#view-preparacao`, `#view-captura`, `#stepper-fluxo`, `#editor-toolbar`, `#editor-tiptap`, `#painel-dossie`, `#modal-entidade`, `#modal-json`).
  3. `css/style.css` declara tokens de design em `:root` (paleta off-white `#FAF8F5`, grafite `#1F1E1D`, dourado `#B08D57`, cinzas neutros `#E5E0D8`).
  4. Layout responsivo da Tela 2 estruturado em 2 colunas no desktop (Coluna esquerda Captura, Coluna direita Dossiê), prevendo empilhamento limpo em dispositivos móveis.
  5. Estrutura do modal `#modal-entidade` (com abas/formulários para Pessoa e Lugar) e do modal `#modal-json` posicionadas e estilizadas.
  6. Foco visível acessível (`:focus-visible`) e estados de botão (`:hover`, `:active`, `:disabled`) estilizados com sobriedade.

---

## T03: Entidades Mock e Serviços Assíncronos Simulados
- **Dono:** Forja (Programador)
- **Dependências:** T01
- **Arquivos:** `data/entidades.js`, `services/mock.js`
- **Critérios de Aceite:**
  1. `data/entidades.js` exporta o objeto `entidades` com 5 itens de `pessoas` e 5 itens de `lugares`, utilizando exclusivamente placeholders padronizados (`[ID PESSOA 1]`, `[NOME PESSOA 1]`, etc.) e sem dados reais inventados.
  2. `services/mock.js` implementa e exporta: `carregarEntidadesDoUsuario()`, `conectarIA()`, `ativarLeitorNarrativo()`, `enviarAoLeitorNarrativo(payload)` e `salvarEntidadeNoArquivo(entidade)`.
  3. Todas as funções retornam Promises simulando tempo de espera com `setTimeout` (entre 400ms e 1200ms) e possuem suporte a simulação de falha (NOK) para testes de resiliência.
  4. Todas as funções trazem o comentário obrigatório `// TROCAR PELO BACKEND`.
  5. `salvarEntidadeNoArquivo(entidade)` simula a persistência gerando novo id incremental (ex.: `P006`, `L006`) e marcando `status: "new"`.

---

## T04: Lógica e Fluxo da Tela 1 (Preparação)
- **Dono:** Forja (Programador)
- **Dependências:** T02, T03
- **Arquivos:** `js/preparacao.js`, `js/main.js`
- **Critérios de Aceite:**
  1. Ao clicar em `#btn-passo-1`, aciona `carregarEntidadesDoUsuario()`; anima barras `#progresso-pessoas` e `#progresso-lugares` até 100% e atualiza status para `ok`.
  2. Elemento `#contador-referencias` exibe progresso gradual (`"Carregando referências do seu Grafo... [X/10]"`) e finaliza com `"✓ Referências carregadas"`.
  3. Botão `#btn-passo-2` só é habilitado após o Passo 1 concluir com `ok`.
  4. Ao clicar em `#btn-passo-2`, executa `conectarIA()` e `ativarLeitorNarrativo()`, atualizando barras e badges para `ok`.
  5. Botão `#btn-avancar-captura` torna-se habilitado apenas após o Passo 2 estar com status `ok`.
  6. Clique em `#btn-avancar-captura` oculta `#view-preparacao` e exibe `#view-captura` através da transição orquestrada em `main.js`.
  7. Estados de falha (NOK) exibem `#btn-retry-passo-1` e `#btn-retry-passo-2`, permitindo reexecutar a etapa sem recarregar a página.

---

## T05: Editor TipTap com Menções (@ e #), Pop-up Nova Entidade e Validações
- **Dono:** Forja (Programador)
- **Dependências:** T02, T03, T04
- **Arquivos:** `js/captura.js`
- **Critérios de Aceite:**
  1. Instanciação do editor TipTap em `#editor-tiptap` com StarterKit e extensão customizada `EntityReference` via CDN ESM.
  2. Gatilho `@` aciona busca em memória para `Pessoa`; gatilho `#` aciona busca para `Lugar` com busca case-insensitive limitando a 10 itens.
  3. Renderização das menções no editor como chips visuais com atributos estruturados (`id`, `label`, `entityType`, `status`).
  4. Último item da lista de sugestões exibe `"＋ Criar “[texto digitado]” como nova pessoa/lugar"`.
  5. Ao selecionar criação, abre o modal `#modal-entidade` com nome pré-preenchido; o salvamento cadastra no grafo em memória com `status: "new"`, chama `salvarEntidadeNoArquivo()` e insere a menção no texto sem perder o texto digitado; o cancelamento fecha o modal e mantém o foco no editor.
  6. Validação do título (> 9 caracteres) e da data (campo `type="date"`, obrigatória e com verificação de data estritamente no passado) com avisos em `#msg-erro-titulo` e `#msg-erro-data`. Checkbox `#check-data-aproximada` controla a flag booleana `dataAproximada`.
  7. Contador de palavras `#contador-palavras` atualiza a cada tecla digitada (ex: `"32/50 palavras"`).
  8. Botão `#btn-revisar` só é habilitado quando: título > 9 caracteres, data válida no passado e narrativa com pelo menos 50 palavras.
  9. Botão `#btn-ver-json` abre modal `#modal-json` renderizando o documento em `editor.getJSON()` e o payload estruturado completo.

---

## T06: Retorno do Leitor Narrativo, Dossiê e Stepper
- **Dono:** Forja (Programador)
- **Dependências:** T05
- **Arquivos:** `js/retorno.js`, `js/main.js`
- **Critérios de Aceite:**
  1. Clique em `#btn-revisar` coloca `#painel-dossie` no estado `data-state="loading"` (stepper permanece na etapa 1) e dispara `enviarAoLeitorNarrativo(payload)`.
  2. Ao receber resposta da IA mock, altera o painel para `data-state="ready"`.
  3. Renderiza a lista de chips em `#dossie-chips-container` com as referências marcadas pelo usuário (`Pessoa`/`Lugar`, label, id e status `existing`/`new`).
  4. Popula as 5 seções do acordeão: Parecer Narrativo, Narrativa Revisada, Lacunas Identificadas, Perguntas de Validação (somente leitura) e Dossiê Narrativo com os placeholders do retorno.
  5. Acordeão opera com abertura/fechamento suave por clique nos cabeçalhos.
  6. Seção "Narrativa Revisada" disponibiliza alternância/comparação `#toggle-comparacao` entre a narrativa original digitada e a narrativa revisada sugerida.
  7. Habilita o botão `#btn-enviar-analise` e avança o stepper para a etapa 2 (*Enviar p/ Análise e Registro*, ativa), conforme DECISOES.md item 2.
  8. Ao clicar em `#btn-enviar-analise`, stepper vai à etapa 3 (*Análise Ontológica*, estado carregando mock) e depois à etapa 4 (*Registro*, concluída), com feedback de sucesso.

---

## T07: Animações GSAP, ScrollTrigger, SplitType e Lenis Smooth Scroll
- **Dono:** Prisma (Frontend Designer)
- **Dependências:** T02, T06
- **Arquivos:** `js/animacoes.js`, `css/style.css`
- **Critérios de Aceite:**
  1. Inicialização do Lenis sincronizado perfeitamente com o ticker do GSAP e ScrollTrigger.
  2. Animação de revelação tipográfica com `split-type` nos títulos principais e cabeçalhos de tela.
  3. Transição fluida de tela (fade e leve slide) ao avançar da Preparação para a Captura.
  4. Animação progressiva das barras e números na Tela de Preparação.
  5. Abertura/fechamento animado suave para o popup de sugestões do TipTap, acordeão do Dossiê e modais.
  6. Cursor personalizado sutil com microinterações em cards e botões; cursor customizado estritamente desativado ao passar sobre o editor TipTap (`.ProseMirror`).
  7. Suporte a `prefers-reduced-motion`: quando a preferência do sistema estiver ativa, transições físicas e rolagem inercial são desabilitadas em favor de estados instantâneos.

---

## T08: Polimento Visual, Microinterações e Responsividade
- **Dono:** Prisma (Frontend Designer)
- **Dependências:** T07
- **Arquivos:** `css/style.css`, `index.html`
- **Critérios de Aceite:**
  1. Responsividade impecável em Desktop (1440px), Notebook (1024px), Tablet (768px) e Mobile (375px a 425px).
  2. Na versão mobile, as colunas de Captura e Dossiê empilham de forma elegante, mantendo o editor e o acordeão confortáveis para toque.
  3. O menu flutuante de sugestões `@` e `#` posiciona-se corretamente sem ultrapassar os limites da viewport no celular.
  4. Auditoria de contraste (mínimo WCAG AA 4.5:1) em todos os textos e fundos.
  5. Estados interativos (`hover`, `focus-visible`, `active`, `disabled`, `empty`, `loading`, `error`) polidos no mais alto padrão de acabamento visual.

---

## T09: Homologação Integrada, Testes de Critérios de Aceite e Relatório de QA
- **Dono:** Lupa (QA / Revisor)
- **Dependências:** T08
- **Arquivos:** `orquestracao/qa/RELATORIO-T09.md`
- **Critérios de Aceite:**
  1. Verificação de ausência de dados reais no código ou nos textos: estrito uso de placeholders `[PLACEHOLDER]`.
  2. Teste completo da jornada da Tela 1: progressos, badges de OK, tratamento de retry em caso de falha e transição para Tela 2.
  3. Teste do TipTap: funcionamento dos gatilhos `@` e `#`, inserção de nós estruturados e integridade do pop-up de nova entidade com geração de ID automático.
  4. Teste de todas as regras de bloqueio: título curto bloqueia, data futura/inválida bloqueia, texto com menos de 50 palavras desabilita o botão Revisar.
  5. Teste da exportação JSON: botão "Ver JSON" renderiza o JSON nativo do TipTap e o payload completo de integração.
  6. Teste da Tela 2.2: acordeão, comparativo entre original e revisado, avanço de todas as 4 etapas do Stepper.
  7. Verificação de acessibilidade e `prefers-reduced-motion`.
  8. Emissão do relatório formal em `orquestracao/qa/RELATORIO-T09.md` documentando os testes e aprovando a POC.
