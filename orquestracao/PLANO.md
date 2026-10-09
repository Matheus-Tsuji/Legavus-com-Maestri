# PLANO ARQUITETURAL E CONTRATO DE INTERFACE — LEGAVUS POC

## 1. Visão Geral e Arquitetura do Sistema

A POC do **LEGAVUS** é uma aplicação web frontend de página única (SPA sem roteador/framework pesado), construída com HTML5 semântico, CSS3 moderno com Design Tokens (variáveis CSS), JavaScript vanilla em módulos ES6, e as bibliotecas especializadas **TipTap** (editor rico e captura de menções), **GSAP** (animações e transições) e **Lenis** (rolagem suave).

### 1.1 Divisão de Responsabilidades
- **Prisma (Frontend Designer):** Responsável por `index.html`, `css/style.css` e `js/animacoes.js`. Garante o visual premium (estilo Awwwards, off-white e dourado), hierarquia tipográfica, responsividade, acessibilidade (WCAG AA) e as animações suaves.
- **Forja (Programador):** Responsável por `js/main.js`, `js/preparacao.js`, `js/captura.js`, `js/retorno.js`, `data/entidades.js` e `services/mock.js`. Implementa o gerenciamento de estado, ciclo de vida dos passos, integração com TipTap Mention (@ e #), validações e simulação de serviços assíncronos.
- **Lupa (QA / Revisor):** Executa bateria de testes funcionais, validação dos critérios de aceite, conformidade com o contrato e acessibilidade.

---

## 2. Estrutura de Pastas e Módulos

```
/
├── index.html                  # Prisma: Estrutura semântica e containers
├── css/
│   └── style.css               # Prisma: Design tokens, layout flex/grid, componentes, estados
├── js/
│   ├── main.js                 # Forja: Orquestração do app, navegação entre telas, estado global
│   ├── preparacao.js           # Forja: Lógica da Tela 1 (cargas com barra de progresso e conexão IA)
│   ├── captura.js              # Forja: Lógica da Tela 2.1 (TipTap, atalhos @/#, validações e pop-up)
│   ├── retorno.js              # Forja: Lógica da Tela 2.2 (Dossiê, acordeão, comparação original x revisado)
│   └── animacoes.js            # Prisma: GSAP, ScrollTrigger, SplitType e Lenis smooth scroll
├── data/
│   └── entidades.js            # Forja: Mocks de Pessoas e Lugares (somente placeholders)
├── services/
│   └── mock.js                 # Forja: Funções assíncronas simuladas ("TROCAR PELO BACKEND")
└── orquestracao/               # Documentação, pesquisas, relatórios e planos
```

### 2.1 CDNs e Dependências Externas Fixas
- **TipTap v2.11.5 (ESM via esm.sh):**
  - `@tiptap/core@2.11.5`
  - `@tiptap/starter-kit@2.11.5`
  - `@tiptap/extension-mention@2.11.5`
  - `@tiptap/suggestion@2.11.5`
- **GSAP v3.12.5 (Script UMD ou ESM):** `gsap.min.js`, `ScrollTrigger.min.js`
- **SplitType v0.3.4 (Script UMD / ESM):** Divisão tipográfica para animações
- **Lenis v1.3.26:** `lenis.min.js` + `lenis.css` (Smooth Scroll)
- **Google Fonts:** `Cormorant Garamond` (serifa elegante) e `Inter` (sans limpa)

---

## 3. CONTRATO de Elementos HTML entre Prisma e Forja

Este contrato estabelece os **IDs**, **classes CSS** e atributos **`data-*`** imutáveis. Nem Prisma nem Forja podem alterar esses identificadores sem alinhamento prévio.

### 3.1 Containers de Telas e Navegação
- `#app`: Elemento raiz da aplicação (T10: é o **cartão único em 2 colunas** `.app-card`; esquerda `.col-esq` = `#stepper-fluxo` + `.col-esq-corpo` com as views; direita = `#painel-dossie`, **sempre visível**).
- `#view-preparacao`: Container da Tela 1 (Preparação).
  - Atributo: `data-view="preparacao"`
  - Classe ativa: `view-active` (exibida) / `view-hidden` (oculta via CSS/display).
- `#view-captura`: Container da Tela 2.1 (Narração/Captura). T10: o Dossiê saiu daqui; as views são só a coluna esquerda alternada.
  - Atributo: `data-view="captura"`
  - Classe ativa: `view-active` / `view-hidden`.

### 3.2 Tela 1: Preparação
- `#btn-passo-1`: Botão "Carregar entidades fundamentais".
- `#btn-passo-2`: Botão "Conectar com a IA e ativar Leitor Narrativo" (`disabled` por padrão).
- `#btn-avancar-captura`: Botão "Avançar para Captura da Experiência →" (`disabled` por padrão).
- **Indicadores de Progresso do Passo 1:**
  - `#progresso-pessoas`: Barra de progresso para Pessoas (`.progress-bar-inner`).
  - `#status-pessoas`: Badge de status textual/ícone (`data-status="idle|loading|ok|nok"`).
  - `#progresso-lugares`: Barra de progresso para Lugares (`.progress-bar-inner`).
  - `#status-lugares`: Badge de status (`data-status="idle|loading|ok|nok"`).
  - `#contador-referencias`: Texto com o total de referências carregadas (ex.: "Carregando referências do seu Grafo... [0/10]" → "✓ Referências carregadas").
- **Indicadores de Progresso do Passo 2:**
  - `#progresso-conectar-ia`: Barra de progresso da conexão IA.
  - `#status-conectar-ia`: Badge (`data-status="idle|loading|ok|nok"`).
  - `#progresso-ativar-leitor`: Barra de progresso do Leitor Narrativo.
  - `#status-ativar-leitor`: Badge (`data-status="idle|loading|ok|nok"`).
- **Retentativas:**
  - `#btn-retry-passo-1`: Botão "Tentar novamente" (exibido apenas se status for `nok`).
  - `#btn-retry-passo-2`: Botão "Tentar novamente" (exibido apenas se status for `nok`).

### 3.3 Tela 2.1: Captura da Experiência (Coluna Esquerda)
- `#stepper-fluxo`: Stepper de **5 fases** (T10; antes eram 4). Agora fica **fora das views**, no topo da coluna esquerda, **compartilhado** por Preparação e Captura (`<ol>`, itens `.step-item`, `data-step="1..5"`, número dentro de `.step-dot`). Estado: `.is-active` (+ `aria-current="step"` só no ativo, a Forja deve manter) / `.is-completed` (CSS troca o número por ✓) / nenhum = futura.
  - `[data-step="1"]`: *Preparação* (ativa na Tela 1; concluída ao avançar para a Captura).
  - `[data-step="2"]`: *Narração da Experiência* (ativa na Captura até o 1º retorno do Leitor).
  - `[data-step="3"]`: *Enviar p/ Análise e Registro* (ativa após o 1º retorno do Leitor).
  - `[data-step="4"]`: *Análise Ontológica da Experiência* (ativa durante o envio, mock).
  - `[data-step="5"]`: *Registro da Experiência* (concluída ao final; todas ✓).
  - Mapeamento antigo → novo: etapa antiga N vira N+1 (a Preparação é a nova 1). `stepper(n)` em `retorno.js` hoje usa 1–4 e `stepper(5)` = "tudo concluído": passa a usar 2, 3, 4 e 6 (6 = todas concluídas).
- `#input-titulo`: Campo de texto do título (`type="text"`, placeholder `Ex: Negociação com fornecedor`).
- `#msg-erro-titulo`: Mensagem de validação do título (regra: > 9 caracteres).
- `#input-data`: Campo de calendário da data (`type="date"`, regra: obrigatória e no passado).
- `#msg-erro-data`: Mensagem de validação da data.
- `#check-data-aproximada`: Checkbox "Grau de exatidão" (determina a flag `dataAproximada: true|false`).
- **Editor TipTap e Barra de Ferramentas:**
  - `#editor-toolbar`: Container com botões de formatação.
    - Botões com `data-command="bold|italic|strike|heading-1|heading-2|heading-3|paragraph|bulletList|orderedList|blockquote|codeBlock|horizontalRule|undo|redo"`.
  - `#editor-tiptap`: Elemento onde o TipTap instancia o `.ProseMirror`.
  - `#contador-palavras`: Elemento que exibe a contagem (ex.: `"0 / 50 palavras"`).
  - `#msg-validacao-narrativa`: Mensagem de status da narrativa.
- **Botões de Ação:**
  - `#btn-enviar-analise`: Botão "Enviar para Análise e Registro →". Habilitado direto quando: título > 9 chars, data válida no passado e narrativa >= 50 palavras (T15: o botão "Revisar" `#btn-revisar` foi removido; ao clicar: Dossiê `loading` → `ready`, fases 3 → 4 → todas concluídas).
  - `#btn-ver-json`: Botão de depuração para inspecionar o JSON nativo do TipTap e o payload.

### 3.4 Menu de Sugestões TipTap (`@` e `#`)
- Elemento flutuante gerenciado pelo render do TipTap Suggestion:
  - `.tiptap-suggestions-popup`: Container do dropdown flutuante.
  - `.suggestion-list`: Lista de itens (`<ul role="listbox">`).
  - `.suggestion-item`: Item individual (`<li role="option">`), com atributo `data-index="N"`.
  - `.suggestion-item.is-selected`: Item destacado no teclado.
  - `.suggestion-item-create`: Último item fixo separado por linha divisória: `"＋ Criar “[query]” como nova pessoa/lugar"`.

### 3.5 Pop-up Modal: "Nova Pessoa / Novo Lugar"
- `#modal-entidade`: Container do diálogo modal (`role="dialog"`, `aria-modal="true"`, classe `.modal-hidden` ou `.modal-open`).
- `#modal-entidade-titulo`: Título do modal ("Adicionar Nova Pessoa" ou "Adicionar Novo Lugar").
- `#form-nova-pessoa`: Formulário de Pessoa:
  - `#pessoa-nome`: Input Nome (pré-preenchido com o texto digitado).
  - `#pessoa-idade`: Input Idade.
  - `#pessoa-sexo`: Select Sexo (`[MASCULINO / FEMININO / OUTRO]`).
- `#form-novo-lugar`: Formulário de Lugar:
  - `#lugar-nome`: Input Nome (pré-preenchido com o texto digitado).
  - `#lugar-pais`: Input País.
  - `#lugar-uf`: Input UF.
  - `#lugar-cidade`: Input Cidade.
- `#btn-cancelar-entidade`: Botão Cancelar (fecha o modal e restaura o foco no editor).
- `#btn-salvar-entidade`: Botão Salvar (adiciona à memória, salva mock e insere chip com `status: "new"`).

### 3.6 Tela 2.2: Dossiê Narrativo (Coluna Direita)
- `#painel-dossie`: Painel da coluna direita, **fora de `#view-*`, visível em todas as telas** (T10).
  - `#indicador-ia`: badge `.status-badge` no cabeçalho do painel, `data-status="idle|loading|ok|nok"` + texto (hoje "IA: aguardando"). **Novo: a Forja liga** (ex.: loading ao conectar, ok quando `ativarLeitorNarrativo` termina; texto "IA: conectada" / "Leitor ativo").
  - Atributo de estado: `data-state="empty|loading|ready"`.
- `#dossie-vazio`: Mensagem quando vazio (`(parecer narrativo gerado)`). T12: agora fica **dentro do corpo da aba 1** (Parecer), visível só com `data-state="empty"`.
- `#dossie-loading`: Indicador de análise e estado carregando com skeleton screens.
- `#dossie-conteudo`: Container visível quando `data-state="ready"`. T12: contém só "Referências marcadas por você"; o acordeão saiu dele e fica **sempre visível** (5 abas em todos os estados). Em cada corpo: `.acc-wait` "(aguardando análise)" (estados empty/loading; na aba 1 só em loading) e `.acc-real` (conteúdo real, visível só em `ready`; os ids `#dossie-*-texto`/`#toggle-comparacao` estão dentro). Tudo por CSS via `data-state`; a Forja não muda nada.
- `#dossie-chips-container`: Container da seção **"Referências marcadas por você"**:
  - Lista de chips interativos com badge de tipo (`Pessoa` / `Lugar`), label e status (`existing` / `new`).
- **Acordeão com 5 Seções:**
  - `.dossie-accordion`: Container do acordeão.
  - `.accordion-item`: Cada seção com cabeçalho (`.accordion-header`) e corpo (`.accordion-body`).
  - `[data-accordion="parecer"]`: **1. Parecer Narrativo** (conteúdo em `#dossie-parecer-texto`).
  - `[data-accordion="narrativa-revisada"]`: **2. Narrativa Revisada** (com `#toggle-comparacao` alternando Original × Revisada e `#dossie-narrativa-texto`).
  - `[data-accordion="lacunas"]`: **3. Lacunas Identificadas** (conteúdo em `#dossie-lacunas-texto`).
  - `[data-accordion="perguntas"]`: **4. Perguntas de Validação** (conteúdo em `#dossie-perguntas-texto`, não interativo na POC).
  - `[data-accordion="dossie-resumo"]`: **5. Dossiê Narrativo** (resumo ontológico em `#dossie-resumo-texto`).

### 3.7 Modal de Depuração JSON
- `#modal-json`: Container modal do inspecionador JSON.
- `#json-tiptap-output`: Bloco `<pre><code>` com o resultado de `editor.getJSON()`.
- `#json-payload-output`: Bloco `<pre><code>` com o payload estruturado para o backend/IA.
- `#btn-fechar-json`: Botão de fechar o modal.

---

## 4. Formato de Dados, Entidades e Payloads

### 4.1 Entidades Mock (`data/entidades.js`)
Somente com placeholders padronizados:
```javascript
export const entidades = {
  pessoas: [
    { id: "[ID PESSOA 1]", label: "[NOME PESSOA 1]", entityType: "Pessoa", status: "Existente" },
    { id: "[ID PESSOA 2]", label: "[NOME PESSOA 2]", entityType: "Pessoa", status: "Existente" },
    { id: "[ID PESSOA 3]", label: "[NOME PESSOA 3]", entityType: "Pessoa", status: "Existente" },
    { id: "[ID PESSOA 4]", label: "[NOME PESSOA 4]", entityType: "Pessoa", status: "Existente" },
    { id: "[ID PESSOA 5]", label: "[NOME PESSOA 5]", entityType: "Pessoa", status: "Existente" }
  ],
  lugares: [
    { id: "[ID LUGAR 1]", label: "[NOME LUGAR 1]", entityType: "Lugar", status: "Existente" },
    { id: "[ID LUGAR 2]", label: "[NOME LUGAR 2]", entityType: "Lugar", status: "Existente" },
    { id: "[ID LUGAR 3]", label: "[NOME LUGAR 3]", entityType: "Lugar", status: "Existente" },
    { id: "[ID LUGAR 4]", label: "[NOME LUGAR 4]", entityType: "Lugar", status: "Existente" },
    { id: "[ID LUGAR 5]", label: "[NOME LUGAR 5]", entityType: "Lugar", status: "Existente" }
  ]
};
```

### 4.2 Payload Enviado ao Leitor Narrativo (`enviarAoLeitorNarrativo`)
```json
{
  "titulo": "[TITULO DA EXPERIENCIA]",
  "data": "2024-03-15",
  "dataAproximada": false,
  "texto": "Fui viajar com @[NOME PESSOA 1] para #[NOME LUGAR 1].",
  "tiptapJson": {
    "type": "doc",
    "content": [
      {
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Fui viajar com " },
          {
            "type": "entityReference",
            "attrs": {
              "id": "P001",
              "label": "[NOME PESSOA 1]",
              "entityType": "Pessoa",
              "status": "existing"
            }
          },
          { "type": "text", "text": " para " },
          {
            "type": "entityReference",
            "attrs": {
              "id": "L001",
              "label": "[NOME LUGAR 1]",
              "entityType": "Lugar",
              "status": "existing"
            }
          },
          { "type": "text", "text": "." }
        ]
      }
    ]
  },
  "referencias": [
    {
      "tipo": "Pessoa",
      "idGrafo": "P001",
      "texto": "[NOME PESSOA 1]",
      "status": "existing"
    },
    {
      "tipo": "Lugar",
      "idGrafo": "L001",
      "texto": "[NOME LUGAR 1]",
      "status": "existing"
    }
  ]
}
```

### 4.3 Resposta Mock do Leitor Narrativo
```json
{
  "sucesso": true,
  "parecer": "[CONTEUDO DO LEITOR: Parecer Narrativo sobre a coerência e riqueza da narrativa]",
  "narrativaRevisada": "[CONTEUDO DO LEITOR: Versão polida e estilizada da narrativa mantendo os fatos]",
  "lacunas": [
    "[CONTEUDO DO LEITOR: Lacuna cronológica identificada entre a saída e a chegada]",
    "[CONTEUDO DO LEITOR: Ausência de motivação explícita para a escolha do local]"
  ],
  "perguntasValidacao": [
    "[CONTEUDO DO LEITOR: Qual foi o impacto emocional deste acontecimento?]",
    "[CONTEUDO DO LEITOR: Houve outros participantes que não foram citados?]"
  ],
  "dossieResumo": "[CONTEUDO DO LEITOR: Mapeamento ontológico preliminar estruturado para o Grafo da Vida]",
  "referenciasIdentificadas": [
    {
      "tipo": "Pessoa",
      "id": "P001",
      "label": "[NOME PESSOA 1]",
      "status": "existing",
      "origem": "marcado_pelo_usuario"
    },
    {
      "tipo": "Lugar",
      "id": "L001",
      "label": "[NOME LUGAR 1]",
      "status": "existing",
      "origem": "marcado_pelo_usuario"
    }
  ]
}
```

---

## 5. Decisões de UX, Acessibilidade e Design System

### 5.1 Jornada do Usuário
1. **Entrada na Tela 1 (Preparação):** O usuário inicia a sessão carregando os dados do grafo local. As barras de progresso animadas dão clareza temporal e segurança.
2. **Conexão IA:** Uma vez validadas as entidades, o usuário ativa a inteligência narrativa e avança para a captura.
3. **Escrita Imersiva (Captura):** Na coluna esquerda da Tela 2, digita título e data. Ao narrar no TipTap, os atalhos `@` e `#` abrem instantaneamente as listas de sugestões contextuais, sem tirar o foco da escrita.
4. **Criação Rápida de Entidades:** Caso a pessoa ou lugar não exista na memória, seleciona a opção "＋ Criar..." e preenche um modal sucinto, retornando ao texto sem perda de continuidade.
5. **Revisão Inteligente:** Atingidos os requisitos mínimos (50 palavras, título > 9 caracteres, data válida no passado), o botão "Enviar para Análise e Registro" acende.
6. **Leitura do Dossiê:** A coluna direita carrega com feedback de progresso e apresenta a análise da IA com acordeão e comparativo lado a lado.
7. **Finalização:** Com o dossiê em mãos, o botão "Enviar para Análise e Registro" é liberado, avançando o stepper para conclusão mock.

### 5.2 Estados de Interface (Matriz de Estados)
- **Vazio:** Dossiê exibe card convidativo com mensagem discreta `(parecer narrativo gerado)`.
- **Carregando:** Barras com transição suave no Passo 1 e 2; skeleton loader e spinner dourado na coluna do Dossiê durante análise.
- **Sucesso:** Ícone de check dourado (`✓ Referências carregadas`), badge verde-oliva sutil, habilitação fluida de botões.
- **Erro:** Banner/badge de NOK com botão "Tentar novamente" mantendo o estado anterior preservado.
- **Desabilitado:** Botões com opacidade reduzida (0.4), `cursor: not-allowed` e tooltip/aviso explicativo dos critérios faltantes.

### 5.3 Tokens de Design (Paleta e Tipografia)
- `--bg-primary: #FAF8F5;` (Off-white marfim quente)
- `--bg-surface: #FFFFFF;` (Branco puro para cards)
- `--bg-secondary: #F3EFEA;` (Fundo sutil de seções e acordeões)
- `--text-primary: #1F1E1D;` (Grafite escuro de alto contraste)
- `--text-secondary: #6B6661;` (Grafite médio para legendas e metadados)
- `--accent-gold: #B08D57;` (Dourado de prestígio clássico)
- `--accent-gold-hover: #9A7B4A;`
- `--accent-gold-light: #F7F3EB;`
- `--border-subtle: #E5E0D8;`
- `--font-title: 'Cormorant Garamond', Georgia, serif;`
- `--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;`

### 5.4 Acessibilidade (WCAG AA)
- Relação de contraste mínima de 4.5:1 em todos os textos sobre fundos claros.
- Teclado total: `Tab` lógico entre campos; setas para cima/baixo, `Enter` e `Escape` no popup de menções; foco visível destacado (`focus-visible: 2px solid var(--accent-gold)`).
- Regiões `aria-live="polite"` para o contador de referências, mensagens de validação e contador de palavras.
- Detecção de `prefers-reduced-motion`: transições físicas substituídas por opacidade simples, Lenis desacoplado de inércia e GSAP sem saltos de posição.
