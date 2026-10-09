[66 lines total]
INFORMACOES.md: dados do projeto LEGAVUS (POC frontend)

Como usar: preencha o que souber e salve em orquestracao\INFORMACOES.md. Os agentes consultam este arquivo antes de usar qualquer dado. O que estiver vazio ou como [PENDENTE] vira placeholder: ninguém inventa. Prioridade: 🔴 bloqueia o início · 🟡 necessário antes da entrega · 🟢 pode ficar para depois.

1. Marca e produto
Item	Valor	Prior.
Nome do produto (grafia exata)	LEGAVUS	🔴
Empresa responsável / quem assina o produto	[PENDENTE]	🔴
Slogan / frase de impacto (se houver)	[PENDENTE]	🟡
Descrição em 1 frase (o que é o LEGAVUS)	[PENDENTE]	🟡
Público-alvo (quem escreve as narrativas)	[PENDENTE]	🟡
Tom de voz (formal, acolhedor, poético...)	[PENDENTE]	🟡
Idioma da interface	Português do Brasil	🔴
Logo (arquivo SVG/PNG) e onde está	[PENDENTE]	🟢
Cores/fontes oficiais da marca (se existirem)	Sem marca definida: usar off-white + dourado do prompt	🟡
2. Telas e textos
Item	Valor	Prior.
Nome oficial de cada tela (Preparação, Captura, Retorno/Dossiê)	[PENDENTE]	🟡
Textos de botões e mensagens de erro/sucesso (usar os do prompt se vazio)	[PENDENTE]	🟢
Textos de ajuda (o que é @, o que é #)	[PENDENTE]	🟡
Rodapé / aviso de privacidade (LGPD)	[PENDENTE]	🟡
3. Regras de negócio (confirmar)
Item	Valor atual	Prior.
Título: mínimo de caracteres	> 9 (documento)	🔴
Narrativa: mínimo de palavras para "Revisar"	50	🔴
Data: formato e regra	Conflito: documento pede dd-mm-aaaa por calendário; rascunho aceita "2024" ou "15/03/2024" com "Grau de exatidão". Decidir.	🔴
Atalhos: @ Pessoa, # Lugar. Outros (Obras, Experiências) entram agora? Qual símbolo?	Só @ e # na POC	🔴
Campos de Pessoa	Nome, Idade, Sexo (id automático)	🟡
Campos de Lugar	Nome, País, UF, Cidade (id automático)	🟡
Padrão dos ids (ex.: P001, L001)	Documento usa P001/L001	🟡
"Nova Pessoa/Lugar": gravar só em memória ou simular arquivo?	Simular o "arquivo texto fonte"	🟡
4. Leitor Narrativo e Dossiê (retorno da IA)
Item	Valor	Prior.
Conteúdo e formato de cada seção: Parecer, Narrativa Revisada, Lacunas, Perguntas de Validação, Dossiê	[PENDENTE] (placeholders na POC)	🟡
Tempo simulado de resposta e exemplo de resposta de erro	[PENDENTE]	🟢
O usuário responde às "Perguntas de Validação" na tela?	[PENDENTE]	🟡
Fluxo das 4 etapas (Narração → Enviar → Análise Ontológica → Registro): o que fica ativo em cada momento	[PENDENTE]	🔴
"Experiência 001": numeração automática?	[PENDENTE]	🟢
5. Dados de exemplo
Item	Valor	Prior.
Usar só placeholders ou dados fictícios de exemplo?	Só placeholders ([NOME PESSOA 1])	🔴
Se houver exemplos reais autorizados: arquivo e quem autorizou	[PENDENTE]	🟢
6. Técnico
Item	Valor	Prior.
Navegadores/dispositivos alvo	[PENDENTE] (sugestão: Chrome, Edge, Safari, Firefox atuais; celular, tablet, desktop)	🟡
Como a página será aberta (servidor estático local, arquivo direto, hospedagem)	[PENDENTE]	🟡
Versões fixas de TipTap/GSAP/Lenis (conferidas pelo Firecrawl na fonte)	Definir no PLANO	🟡
Pasta do projeto	~\OneDrive\Desktop\Projetos Claude\Tela Captura da Experiência Legavus Maestri	🔴
Documentos de referência	3 arquivos Word da arquitetura TipTap + prompt-frontend-legavus-poc.md	🔴
7. Backend futuro (só registrar, não implementar agora)
Item	Valor	Prior.
Banco de grafos (ex.: Neo4j) e quem mantém	[PENDENTE]	🟢
Endpoints (Pessoas, Lugares, Obras, Leitor Narrativo) e formato de autenticação	[PENDENTE]	🟢
Serviço de IA usado pelo Leitor Narrativo	[PENDENTE]	🟢
Decisão: carregar listas em memória x API síncrona	Em aberto; POC usa lista em memória	🟢
8. Privacidade e segurança
Item	Valor	Prior.
As narrativas citam terceiros (nomes, relações). Há texto de consentimento/LGPD a exibir?	[PENDENTE]	🟡
Dados reais podem entrar no repositório?	Não	🔴
9. Git e entrega
Item	Valor	Prior.
Repositório remoto (URL do GitHub, ou "só local")	[PENDENTE]	🟡
Nome e e-mail para os commits	[PENDENTE]	🔴
gh (GitHub CLI) instalado e logado?	[PENDENTE]	🟢
Quem aprova plano e entrega	Eu (usuário)	🔴
Prazo e critério de "POC pronta"	[PENDENTE]	🟡
