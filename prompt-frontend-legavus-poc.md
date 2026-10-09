# Prompt: Frontend da POC do LEGAVUS

## Papel
Você é um desenvolvedor front-end sênior e designer de interfaces, com referência de qualidade em sites premiados no Awwwards. Construa o **frontend** (somente interface, sem backend real) da **POC do LEGAVUS**, uma plataforma onde a pessoa registra experiências de vida em forma de narrativa. As experiências se conectam a um "Grafo da Vida" (pessoas, lugares, obras, experiências).

## Contexto do produto (resumo)
- O usuário escreve uma **narrativa** num editor de texto. Ao digitar **`@`** escolhe uma **Pessoa**; ao digitar **`#`** escolhe um **Lugar**. Funciona como as menções do Instagram: a lista filtra enquanto digita.
- O editor é o **TipTap**: um editor de texto rico (framework headless, extensível) que aqui será usado para **ler e reconhecer comandos de atalho dentro do texto** (`@`, `#` e outros símbolos que virão no futuro), cada um representando um tipo de entidade e abrindo uma busca contextual daquele tipo. Isso é feito com as extensões Mention + Suggestion. Ele **não** interpreta o sentido do texto, só captura o texto e as referências explícitas do usuário.
- A menção é inserida como **nó estruturado**, não como texto comum. Visualmente: `Fui viajar com @Maria Silva.` Internamente guarda id, tipo e status.
- Se a pessoa/lugar não existe, o menu mostra no final **"＋ Criar “[texto digitado]” como nova pessoa/lugar"**. Isso abre um pop-up pequeno (ver Tela 2.1).
- O usuário também pode escrever sem atalho ("Fui ao Rio com Carlos"). Isso é texto normal, e quem identifica a entidade depois é a IA. A interface deve deixar clara a diferença entre **referência explícita** (menção) e **texto simples**.
- Fluxo geral: `Usuário → TipTap (texto + referências) → Leitor Narrativo (IA) → [2ª POC: Analista Cognitivo] → Grafo da Vida`.

## Antes de começar: faça um "grill me"
Antes de escrever qualquer código, **me entreviste** com perguntas curtas e objetivas, em rodadas de no máximo 5 perguntas, até não restar ambiguidade relevante. Só comece a construir quando eu disser que pode. Cubra pelo menos:
- **Data:** a referência visual aceita "2024" ou "15/03/2024" com um checkbox "Grau de exatidão", mas a regra de negócio pede `dd-mm-aaaa` por calendário. Como unificar?
- **Fluxo de 4 etapas** da referência (Narração → Enviar p/ Análise e Registro → Análise Ontológica → Registro): qual etapa fica ativa em cada momento e o que muda na tela?
- Onde ficam as telas de Preparação e Captura (mesma página, em etapas, ou rotas separadas)?
- Como a seleção de menções deve ser mostrada no Dossiê.
- Qualquer dúvida visual, de comportamento ou de dados que você tiver.
Para cada pergunta, proponha uma sugestão de resposta padrão, para eu poder responder só "ok".

## Escopo desta entrega
**Fazer:** frontend completo das 3 telas abaixo, com dados simulados em arquivo separado e funções "fake" no lugar das chamadas de backend/IA.
**Não fazer:** backend, banco, chamadas reais de IA, autenticação, Analista Cognitivo (fica para a 2ª POC).

## Telas e regras de negócio

### Tela 1: Preparação
- Abre mostrando **dois passos**, cada um com seu botão de execução:
  1. **Carregar entidades fundamentais**
     - Barra/indicador de progresso para **Pessoas** e para **Lugares**, cada um terminando em **OK** ou **NOK**.
  2. **Conectar com a IA e ativar o Leitor Narrativo**
     - Duas etapas com progresso e OK/NOK: "Conectar IA" e "Ativar Leitor Narrativo".
- O passo 2 só habilita **depois** do passo 1 terminar com OK.
- Quando tudo estiver OK, libera o botão para ir à Tela de Captura.
- Mostrar o texto de carga: "Carregando referências do seu Grafo…" com contador, e depois "✓ Referências carregadas".
- Prever estados de erro (NOK) com botão "Tentar novamente".

### Tela 2.1: Registro da experiência (Captura)
Campos:
- **Título**: obrigatório, mais de 9 caracteres.
- **Período**: data `dd-mm-aaaa`, escolhida por **calendário**, válida e **no passado**.
- **Narrativa**: editor **TipTap** com os gatilhos `@` (Pessoa) e `#` (Lugar).
  - Menu de sugestões filtra conforme a digitação (`includes`, sem diferenciar maiúsculas, máx. 10 itens).
  - Último item fixo do menu: **"＋ Criar “[texto]” como nova pessoa/lugar"**, separado por uma linha.
  - Menção aparece como "chip" discreto, com cor/ícone diferente para Pessoa e Lugar.
  - Cancelar e fechar o menu não pode perder o texto digitado.
Botões:
- **"Revisar"** (enviar ao Leitor Narrativo) e **"Enviar para Análise e Registro"** começam **desabilitados**.
- "Revisar" só habilita com: narrativa com **no mínimo 50 palavras** + título válido + data passada válida. Mostrar um contador de palavras (ex.: "32/50").
- "Enviar para Análise e Registro" só habilita **depois do primeiro retorno** do Leitor Narrativo.

Pop-up "Nova Pessoa / Novo Lugar" (abre ao escolher "＋ Criar…"):
- **Pessoa:** Nome (já preenchido com o texto digitado), Idade, Sexo. O id é gerado automaticamente.
- **Lugar:** Nome (pré-preenchido), País, UF, Cidade. O id é gerado automaticamente.
- Botões **Cancelar** (volta à lista de sugestões) e **Salvar** (adiciona à lista em memória, insere a menção no texto e marca `status: "new"`).
- Simular a gravação no "arquivo texto fonte das entidades" com uma função mock `salvarEntidadeNoArquivo(entidade)`.

### Tela 2.2: Retorno do Leitor Narrativo ("Dossiê Narrativo")
- Fica no **painel da direita**, ao lado da captura (ver "Referência visual"). Título: **"Dossiê Narrativo — Experiência 001"**, em formato de **acordeão** com 5 seções:
  1. **Parecer Narrativo**
  2. **Narrativa Revisada**
  3. **Lacunas Identificadas**
  4. **Perguntas de Validação**
  5. **Dossiê Narrativo**
- Antes do primeiro envio, o painel mostra estado vazio com `(parecer narrativo gerado)`; depois do envio, mostra o estado de carregamento e então o conteúdo `[CONTEÚDO DO LEITOR]` em cada seção.
- **Sempre manter** o texto original do usuário e a narrativa revisada, com comparação visual (ex.: slider/alternância dentro da seção "Narrativa Revisada").
- O usuário pode usar a revisão para ajustar sua narrativa e reenviar.
- Mostrar as **referências estruturadas** reconhecidas (tipo, label, id, status `existing`/`new`), diferenciando "marcado por você" de texto simples.
- O conteúdo exato de cada seção não está definido nos documentos: use placeholders e deixe fácil de ajustar.

## Estrutura de dados (mock)
Crie `data/entidades.js` (ou `.json`) **somente com placeholders**, no formato abaixo, para eu trocar depois pelos dados reais:

```js
export const entidades = {
  pessoas: [ { id: "[ID PESSOA 1]", label: "[NOME PESSOA 1]", entityType: "Pessoa", status: "Existente" } /* ... */ ],
  lugares: [ { id: "[ID LUGAR 1]", label: "[NOME LUGAR 1]", entityType: "Lugar",  status: "Existente" } /* ... */ ]
};
```
- Coloque uns 4 a 6 itens placeholder por lista, só para o autocomplete funcionar visualmente.
- Os campos `obras` e `experiencias` existem no modelo geral, mas **não entram nesta POC** (só Pessoa e Lugar). Deixe preparado para extensão futura (novos gatilhos).
- Crie funções mock isoladas em `services/mock.js`: `carregarEntidadesDoUsuario()`, `conectarIA()`, `ativarLeitorNarrativo()`, `enviarAoLeitorNarrativo(payload)`, `salvarEntidadeNoArquivo(entidade)`, todas com `setTimeout`/Promise para simular espera e sucesso/erro. Cada uma comentada com "TROCAR PELO BACKEND".
- Não invente nomes reais, textos de narrativa ou respostas finais da IA: use `[PLACEHOLDER]`.

## Regras do TipTap
- Usar `@tiptap/core`, `StarterKit` e `@tiptap/extension-mention` com **múltiplos gatilhos** (`@` e `#`), via CDN ESM (ex.: esm.sh) ou bundle simples.
- Criar uma extensão própria baseada em Mention (ex.: `EntityReference`) com atributos: `id`, `label`, `entityType` (`Pessoa`/`Lugar`) e `status` (`existing`/`new`).
- Uma **única função de busca** reutilizada pelos dois gatilhos (`buscarEntidades(lista, query)`).
- A lista é carregada **uma vez** na abertura da Captura e fica em memória. Deixar o ponto de troca para API assíncrona bem marcado em comentário.
- **Salvar a narrativa em JSON nativo do TipTap** (`editor.getJSON()`), não só HTML, para não perder o vínculo com o id. Mostrar um botão/painel de depuração "Ver JSON" que exibe o JSON do documento e o payload que seria enviado ao Leitor:
  ```json
  { "texto": "...", "referencias": [ { "tipo": "Pessoa", "idGrafo": "...", "texto": "...", "status": "Existente" } ] }
  ```
- O frontend **não** faz nenhuma análise semântica do texto.

## Referência visual (primeira tentativa, só como molde)
Há uma imagem anexa com um **primeiro rascunho simples** da tela. Use-a como **molde de estrutura e de organização**, **não** como estilo final: o visual deve ser muito mais refinado, conforme a seção "Design" abaixo. Ela mostra:
- **Layout em 2 colunas** dentro de um cartão, separadas por uma linha vertical fina.
- **Coluna esquerda, "Captura da Experiência":**
  - Fluxo de 4 etapas no topo, em caixas ligadas por setas: *Narração da Experiência → Enviar p/ Análise e Registro → Análise Ontológica da Experiência → Registro da Experiência*. Transforme em um **stepper elegante**, com a etapa atual destacada.
  - Campos lado a lado: **Título da Experiência** (placeholder "Ex: Negociação com fornecedor") e **Data da Experiência** (placeholder "Ex: 2024 ou 15/03/2024") com o checkbox **"Grau de exatidão"** logo abaixo.
  - **Narrativa da Experiência**: editor TipTap com **barra de ferramentas** (negrito, itálico, tachado, H1, H2, H3, parágrafo, lista, lista numerada, citação, código, linha divisória, desfazer, refazer) e placeholder "(narrativa do usuário aqui)".
  - Botão principal alinhado à direita: **"Enviar p/ Análise e Registro →"**.
- **Coluna direita, "Dossiê Narrativo":** acordeão de 5 seções, a primeira aberta com `(parecer narrativo gerado)`.
- Aprimore o que o rascunho não resolve: hierarquia visual, espaçamento, tipografia, estados (hover, foco, desabilitado, erro, carregando), responsividade (no celular as colunas empilham) e a integração com os menus `@` e `#`.
- A tela de Preparação (Tela 1) não aparece na imagem: desenhe-a no mesmo padrão visual.

## Design
- **Estilo:** elegante e premium, bastante espaço em branco, tipografia grande e refinada. Serifa elegante nos títulos (ex.: Cormorant Garamond, Playfair Display ou Fraunces) + sans-serif limpa no texto (ex.: Inter ou DM Sans).
- **Paleta (claro):** fundo off-white/marfim, texto em grafite escuro quase preto, acento **dourado discreto** (ex.: `#B08D57`), cinzas quentes para bordas. Alto contraste, sobriedade. Usar variáveis CSS.
- **Conceito:** a sensação é de um "diário/arquivo de memórias" sofisticado, não de um sistema corporativo. Sem poluição visual.
- Chips de menção: Pessoa e Lugar distintos por ícone e tom sutil, nunca por cor sozinha (acessibilidade).
- 100% responsivo (celular, tablet, desktop). O menu de sugestões e o pop-up devem funcionar bem em tela pequena.

## Animações e interatividade
Usar **GSAP via CDN** com ScrollTrigger, SplitText, **Lenis** (ou ScrollSmoother) e outros que façam sentido. Mesmo nível de cuidado em todas as telas:
- Entrada com texto revelado por linha/letra nos títulos.
- Rolagem suave em toda a página.
- Fade/slide suave dos blocos conforme o scroll.
- Transições elegantes entre as telas (Preparação → Captura → Retorno).
- Barras de progresso e OK/NOK da Preparação animados, com contadores animados.
- Abertura/fechamento suave do menu de sugestões e do pop-up.
- Tela de Retorno com comparação original × revisado interativa (slider arrastável ou revelação controlada por scroll).
- Pin/parallax em pontos estratégicos, sem atrapalhar a digitação.
- Cursor personalizado discreto e hover sutil em botões e cards (desligar o cursor custom sobre o editor).
- Tudo suave, sem exagero. **Respeitar `prefers-reduced-motion`** (desativar ou reduzir animações e Lenis).

## Requisitos técnicos
- **HTML, CSS e JavaScript puros** (sem React/Vue/etc.), módulos ES, GSAP e TipTap via CDN.
- Estrutura sugerida:
  ```
  index.html
  css/style.css
  js/main.js            (navegação entre telas)
  js/preparacao.js
  js/captura.js         (TipTap + validações)
  js/retorno.js
  js/animacoes.js
  data/entidades.js     (placeholders)
  services/mock.js      (funções fake, marcadas "TROCAR PELO BACKEND")
  ```
- Código organizado e comentado de forma simples, em português.
- Boa performance: animações leves, imagens otimizadas (se houver).
- Acessibilidade: semântica HTML, contraste AA, foco visível, navegação por teclado no menu de sugestões (setas, Enter, Esc), `aria-live` nos estados de progresso, rótulos nos campos.
- Todos os textos da interface em **português do Brasil**.

## Entrega
Projeto simples, pronto para abrir no navegador (via servidor estático local, se necessário por causa dos módulos ES), com um breve `README` de 5 linhas explicando como rodar e onde trocar os mocks pelo backend.

## Regra final
**Não invente dados reais** (nomes, textos, resultados da IA). Onde faltar informação, use placeholders claros como `[NOME PESSOA 1]`.

---

## Adendo: ferramentas e poderes extras que você tem

Além do que está descrito acima, você pode (e deve) usar:

- **MCP do Firecrawl** para pesquisar e ler páginas da web. Use **antes** de implementar, para consultar a documentação **oficial e atual** do TipTap (extensões **Mention** e **Suggestion**, múltiplos gatilhos, `items` assíncrono, extensões customizadas), do GSAP (ScrollTrigger, SplitText), do Lenis, e para buscar **referências visuais** de sites premiados (Awwwards) alinhadas ao estilo "elegante, premium, off-white + dourado". Confira versões de CDN na fonte. Registre o que aprendeu em resumos curtos com link.
- **Skills exclusivas do Claude Code: `frontend-design` e `impeccable`.**
  - Use `frontend-design` para definir a direção visual (tipografia, paleta, tokens) **antes** de escrever CSS, evitando visual genérico.
  - Use `impeccable` na fase final para **polir e auditar**: hierarquia, espaçamento, estados (hover, foco, erro, carregando, desabilitado), acessibilidade e responsividade.
  - Confirme que as skills existem no seu ambiente. Se não existirem, avise e siga sem elas.
- **Execução por um orquestrador:** se você foi chamado por um Orquestrador (Maestri), **não faça o "grill me" diretamente comigo**. Envie suas dúvidas ao Orquestrador, que conduz a entrevista. Respeite os arquivos que são seus (o Orquestrador informa) e relate ao final de cada tarefa em `orquestracao\relatorios\`.
- O rascunho visual e os documentos da arquitetura são **molde**, não verdade absoluta. Se algo se contradisser, pergunte em vez de decidir sozinho.
