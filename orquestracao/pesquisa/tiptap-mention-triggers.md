# Pesquisa: TipTap Mention & Suggestion com Múltiplos Gatilhos

## Documentação Oficial
- **TipTap Mention Extension:** https://tiptap.dev/docs/editor/extensions/nodes/mention
- **TipTap Suggestion Utility:** https://tiptap.dev/docs/editor/api/utilities/suggestion
- **TipTap Vanilla JavaScript:** https://tiptap.dev/docs/editor/getting-started/install/vanilla-javascript

## Funcionamento e Implementação

### 1. Suporte a Múltiplos Gatilhos (`@` e `#`)
A extensão oficial `Mention` do TipTap suporta a configuração `suggestions: [...]` contendo múltiplos objetos de gatilho, ou o registro de extensões personalizadas estendendo `Mention`.
No caso do LEGAVUS:
- Gatilho `@`: busca de entidades do tipo **Pessoa**.
- Gatilho `#`: busca de entidades do tipo **Lugar**.

### 2. Extensão Customizada (`EntityReference`)
Estendendo `Mention.extend({ name: 'entityReference' })`:
- **Atributos do Nó:**
  - `id`: identificador da entidade no grafo (ex: `P001`, `L001`).
  - `label`: nome da entidade exibido no texto.
  - `entityType`: tipo da entidade (`"Pessoa"` ou `"Lugar"`).
  - `status`: status da entidade (`"existing"` ou `"new"`).
- **Renderização HTML (`renderHTML`):**
  Renderiza um elemento semântico `<span class="mention-chip mention-{tipo} mention-{status}" data-type="entity-reference" data-id="..." data-label="..." data-entity-type="..." data-status="...">@Nome</span>`.

### 3. Utilitário de Sugestão (`render`)
O ciclo de vida do render do `Suggestion` expõe:
- `onStart(props)`: cria o container do popup flutuante, calcula a posição a partir de `props.clientRect()`.
- `onUpdate(props)`: atualiza a lista de itens renderizados e selecionados.
- `onKeyDown(props)`: captura teclado (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) para acessibilidade sem perder o foco do editor.
- `onExit(props)`: destrói ou esconde o popup ao fechar ou confirmar seleção.
- `command(item)`: insere a menção com os atributos completos.

### 4. Último Item Fixo: "＋ Criar nova entidade"
Na filtragem de itens (`items({ query })`), quando a query não for vazia, adiciona-se ao final da lista o item especial de criação `{ isCreateOption: true, query, entityType }`. Ao selecionar este item via clique ou tecla `Enter`, o popup do TipTap fecha e abre o modal de cadastro de Nova Pessoa / Novo Lugar.
