# Spec: Relatorio funcionalidades

> feature: relatorio-funcionalidades
> status: rascunho

## Contexto

O clubemm é um CRM de atendimento via WhatsApp (API oficial da Meta) usado pela equipe do Clube Melissa Marília para centralizar conversas, contatos, funil de vendas, campanhas e automações num único painel compartilhado, em vez de cada vendedor usar o WhatsApp comum no celular.

## Histórias

### US-001 — Atender clientes numa caixa de entrada compartilhada

Como atendente da loja, quero ver e responder as conversas de WhatsApp num painel único da equipe, para que o histórico fique compartilhado e nenhum cliente fique sem resposta.

#### AC-001 — Responder dentro da janela de 24h

- **Dado** que um cliente mandou mensagem para o número da loja há menos de 24 horas
- **Quando** o atendente digita e envia uma resposta em texto livre pela caixa de entrada
- **Então** a mensagem é entregue ao cliente no WhatsApp normalmente, sem exigir um modelo pré-aprovado

#### AC-002 — Ver quem da equipe está online

- **Dado** que vários atendentes estão logados no CRM ao mesmo tempo
- **Quando** um atendente abre a caixa de entrada
- **Então** ele vê um indicador (online / ausente / offline) ao lado do nome de cada colega, atualizado por batimentos periódicos (a cor muda para offline se o colega ficar mais de ~75s sem reportar presença)

#### AC-003 — Enviar mídia e reagir a mensagens

- **Dado** uma conversa aberta com um cliente
- **Quando** o atendente anexa uma imagem/arquivo ou reage a uma mensagem recebida com um emoji
- **Então** a mídia é enviada ao cliente pelo WhatsApp e a reação aparece na conversa, do mesmo jeito que um app de WhatsApp comum

#### AC-004 — Identificar contato duplicado ao criar conversa

- **Dado** que um número de telefone já existe cadastrado como contato na conta
- **Quando** uma nova mensagem chega desse mesmo número (mesmo com variação de prefixo/DDI)
- **Então** o sistema associa a conversa ao contato já existente em vez de criar um contato duplicado

### US-002 — Cadastrar e organizar contatos

Como atendente ou administrador, quero manter um cadastro único de cada cliente com tags e campos customizados, para que a equipe encontre e segmente contatos rapidamente.

#### AC-005 — Contato criado automaticamente na primeira mensagem

- **Dado** que um número novo (nunca visto) escreve para a loja
- **Quando** a mensagem chega pelo webhook do WhatsApp
- **Então** um novo contato é criado automaticamente na lista de Contatos, vinculado à conversa

#### AC-006 — Bloquear cadastro manual de telefone já existente

- **Dado** que o usuário está preenchendo o formulário de novo contato manualmente
- **Quando** ele digita um telefone que já pertence a um contato exato na conta
- **Então** o formulário impede o cadastro (bloqueio); se o número for apenas parecido (mesmo final de 8 dígitos, prefixo diferente), o formulário apenas avisa, sem bloquear

#### AC-007 — Importar lista de contatos por CSV sem duplicar

- **Dado** um arquivo CSV com uma lista de contatos, incluindo linhas com o mesmo telefone repetido
- **Quando** o usuário importa o arquivo pela tela de Contatos
- **Então** o sistema mantém só a primeira ocorrência de cada telefone e informa quantas linhas duplicadas foram descartadas

### US-003 — Acompanhar negociações num funil de vendas (Kanban)

Como atendente, quero mover um cliente entre etapas de negociação num quadro visual, para que a equipe veja de relance em que pé está cada venda.

#### AC-008 — Mover negociação entre etapas

- **Dado** uma negociação (deal) cadastrada num estágio do pipeline
- **Quando** o atendente arrasta o cartão da negociação para outra coluna (estágio)
- **Então** a negociação passa a aparecer na nova coluna e fica salva nesse estágio, vinculada à conversa do WhatsApp do cliente

### US-004 — Disparar campanhas em massa (Broadcasts)

Como administrador, quero enviar uma mensagem-modelo aprovada para uma lista de contatos de uma vez, para que a loja divulgue promoções sem violar as regras da Meta.

#### AC-009 — Disparo usa apenas templates aprovados

- **Dado** que o usuário está criando um novo disparo (broadcast)
- **Quando** ele escolhe a lista de contatos e o modelo de mensagem
- **Então** só aparecem para seleção os templates sincronizados da Meta com status aprovado

#### AC-010 — Acompanhar status do disparo e de cada destinatário

- **Dado** um broadcast em andamento
- **Quando** o usuário abre a página de detalhe do broadcast
- **Então** ele vê o status geral (rascunho, agendado, enviando, enviado, falhou) e o status individual de cada destinatário (pendente, enviado, entregue, lido, respondeu, falhou)

### US-005 — Automatizar respostas simples (Automações no-code)

Como administrador, quero criar regras "quando X acontece, faça Y" sem programar, para que respostas repetitivas aconteçam sem intervenção manual.

#### AC-011 — Criar automação por gatilho

- **Dado** que o usuário está na tela de Automações
- **Quando** ele cria uma nova regra escolhendo um gatilho (mensagem recebida, contato novo, palavra-chave ou agendamento) e uma ação
- **Então** a automação passa a rodar sozinha sempre que o gatilho ocorrer, sem precisar de um atendente

#### AC-012 — Consultar histórico de execuções

- **Dado** uma automação já ativa há algum tempo
- **Quando** o usuário abre a tela de logs da automação
- **Então** ele vê a lista de vezes que ela rodou, com data/hora e resultado (sucesso ou falha) de cada execução

### US-006 — Construir chatbot de atendimento automático (Flows)

Como administrador, quero desenhar um fluxo de conversa com várias etapas num editor visual, para que o cliente receba atendimento automático mais elaborado que uma automação simples.

#### AC-013 — Desenhar o fluxo visualmente

- **Dado** que o usuário está criando um novo Flow
- **Quando** ele adiciona blocos (enviar mensagem, esperar resposta, botões, lista, condição) e os conecta no editor em grafo
- **Então** o fluxo é salvo com essa estrutura e pode ser reaberto para edição posterior

#### AC-014 — Cliente responde por botões ou lista

- **Dado** um Flow ativo que chegou num bloco de botões ou lista de opções
- **Quando** o cliente toca numa das opções no WhatsApp
- **Então** o Flow segue para a próxima etapa correspondente à opção escolhida

#### AC-015 — Reprompt e handoff quando a resposta não bate com nenhuma opção

- **Dado** um Flow aguardando resposta a um menu de opções, com política de "reprompt" configurada
- **Quando** o cliente manda uma mensagem que não corresponde a nenhuma opção válida
- **Então** o sistema reenvia a mesma pergunta até o limite configurado de tentativas; esgotado o limite, a conversa é passada para atendimento humano (ou encerrada, conforme a política configurada)

### US-007 — Deixar a IA responder automaticamente (Agentes de IA)

Como administrador, quero que uma IA responda mensagens simples usando minha própria chave de API e uma base de conhecimento, para que o atendimento inicial não dependa de um humano disponível o tempo todo.

#### AC-016 — Ativar resposta automática por IA

- **Dado** que o administrador cadastrou uma chave de API própria (OpenAI ou Anthropic) e ativou o agente de IA
- **Quando** um cliente manda uma mensagem numa conversa elegível
- **Então** a IA gera e envia uma resposta automaticamente, sem um atendente precisar digitar

#### AC-017 — Resposta usa a base de conhecimento cadastrada

- **Dado** uma base de conhecimento com artigos/textos cadastrados pela loja
- **Quando** o cliente faz uma pergunta relacionada a esse conteúdo
- **Então** a resposta da IA é fundamentada no conteúdo da base (busca textual + semântica), não apenas em conhecimento genérico

#### AC-018 — IA transfere para humano quando necessário

- **Dado** uma conversa sendo respondida pela IA
- **Quando** a IA decide que não deve continuar sozinha (ex.: pedido fora do escopo, cliente insistindo em falar com humano)
- **Então** a conversa é marcada como pendente para um atendente humano, com uma nota interna resumindo quantas respostas a IA deu e qual foi a última mensagem do cliente

#### AC-019 — Acompanhar consumo de uso da IA

- **Dado** que o agente de IA está em uso há algum tempo
- **Quando** o administrador abre a tela de uso/configuração da IA
- **Então** ele vê o consumo (volume de respostas/tokens) associado à conta

### US-008 — Gerenciar equipe com papéis e permissões

Como proprietário da conta, quero convidar membros da equipe com papéis diferentes, para que cada pessoa só tenha acesso ao que precisa.

#### AC-020 — Convidar membro por link e definir papel

- **Dado** que o proprietário ou administrador quer adicionar alguém à equipe
- **Quando** ele gera um convite e escolhe o papel (administrador, atendente ou visualizador)
- **Então** a pessoa convidada consegue entrar na conta pelo link/token de convite já com esse papel atribuído

#### AC-021 — Visualizador não consegue agir, só consultar

- **Dado** um usuário com papel "visualizador"
- **Quando** ele tenta enviar uma mensagem, mover uma negociação ou editar uma configuração
- **Então** a ação é bloqueada e ele só consegue visualizar as informações, não alterá-las

#### AC-022 — Só o proprietário transfere a conta

- **Dado** um usuário com papel "administrador" (não proprietário)
- **Quando** ele tenta transferir a propriedade da conta para outro membro
- **Então** a ação é negada; apenas quem tem o papel de proprietário consegue completar essa transferência

### US-009 — Integrar sistemas externos via API e webhooks

Como administrador técnico, quero gerar chaves de API com permissões restritas e registrar webhooks de saída, para que outros sistemas troquem dados com o CRM de forma controlada.

#### AC-023 — Chave de API limitada por escopo

- **Dado** que o administrador está criando uma nova chave de API
- **Quando** ele seleciona só os escopos necessários (ex.: apenas "ler contatos", sem "enviar mensagens")
- **Então** a chave gerada só consegue realizar as ações desses escopos; chamadas para ações fora do escopo são recusadas

#### AC-024 — Webhook de saída assinado

- **Dado** um endpoint de webhook cadastrado para receber eventos do CRM
- **Quando** o CRM envia uma notificação de evento para esse endpoint
- **Então** a requisição chega com um cabeçalho de assinatura (HMAC com timestamp) que o receptor pode conferir para confirmar que a mensagem realmente veio do CRM e não foi alterada no caminho

### US-010 — Proteger dados sensíveis do WhatsApp e dos clientes

Como proprietário do negócio, quero que credenciais e mensagens recebidas da Meta sejam tratadas com segurança, para reduzir o risco de vazamento ou de mensagens forjadas.

#### AC-025 — Token de acesso da Meta nunca fica em texto puro

- **Dado** que o token de acesso da API do WhatsApp é salvo na configuração da conta
- **Quando** o registro é gravado no banco de dados
- **Então** o token é armazenado criptografado (AES-256-GCM), não em texto legível

#### AC-026 — Webhook da Meta tem assinatura conferida antes de processar

- **Dado** uma notificação recebida no endpoint de webhook do WhatsApp
- **Quando** o CRM processa essa notificação
- **Então** ele primeiro confere a assinatura enviada pela Meta; se a assinatura não bater, a notificação é rejeitada e não é tratada como legítima

### US-011 — Ver visão geral do negócio (Dashboard)

Como proprietário ou administrador, quero um painel com números e gráficos do atendimento, para acompanhar o volume de conversas e resultado das campanhas sem abrir cada tela.

#### AC-027 — Dashboard resume métricas do período

- **Dado** que a conta já tem conversas, contatos e broadcasts registrados
- **Quando** o usuário abre a tela de Dashboard
- **Então** ele vê gráficos e números resumidos (ex.: volume de conversas, novos contatos, desempenho de broadcasts) referentes ao período selecionado

## Fora de escopo

- O app não é o WhatsApp Business App comum instalável no celular — funciona só via API oficial da Meta (Cloud API), e o mesmo número não pode estar simultaneamente nos dois.
- O app não cria nem aprova templates de mensagem — eles são criados e aprovados no painel da própria Meta e só sincronizados (importados) para dentro do CRM.
- O app não gerencia cobrança/faturamento das mensagens junto à Meta — isso é feito direto no WhatsApp Manager da Meta, fora do CRM.
- O app não oferece emissão de nota fiscal, controle de estoque ou processamento de pagamento — é só CRM de atendimento e funil, não um ERP.
- O servidor MCP (`mcp-server/`) que expõe o CRM a assistentes de IA externos não foi incluído nas histórias acima por ser uma integração técnica auxiliar, não uma funcionalidade de uso direto da equipe da loja.

## Suposições

| ID | Suposição | Status | Resolução |
|---|---|---|---|
| ASM-001 | Os papéis "atendente" do manual do proprietário correspondem ao valor `agent` no código (`account_role_enum`: owner/admin/agent/viewer) — a nomenclatura em português da UI não foi conferida tela a tela. | aberta | — |
| ASM-002 | O comportamento de handoff da IA para humano (AC-018) é decidido pelo próprio modelo de IA a partir do prompt/contexto configurado, não por uma lista fixa de regras determinísticas no código — inferido de `src/lib/ai/handoff.ts`, que só formata a nota de transferência, não decide quando ela ocorre. | aberta | — |
| ASM-003 | O preset LGPD-educação da skill onp-spec (focado em notas escolares e menores de idade) não se aplica a este CRM; optou-se pelo preset `base` em vez de forçar princípios de domínio educacional a um contexto de dados de clientes de varejo. | confirmada | Decisão registrada no relatório de entrega. |

## Perguntas em aberto

| ID | Pergunta | Status | Resposta |
|---|---|---|---|
| Q-001 | Existe algum processo formal (dentro ou fora do CRM) para atender pedido de exclusão de dados de um cliente (direito do titular via LGPD), ou isso hoje é feito manualmente apagando o contato pela tela? | aberta | — |
| Q-002 | O consentimento de marketing mencionado no manual (obrigatório para campanhas) é registrado em algum campo/flag do contato dentro do CRM, ou é um controle inteiramente fora do sistema (ex.: formulário do site) que a equipe apenas confia? | aberta | — |
| Q-003 | Quais automações/flows estão de fato configurados e ativos hoje para o Clube Melissa Marília (vs. o que é só capacidade genérica do template wacrm)? Não foi possível confirmar isso lendo só o código-fonte, pois a configuração ativa vive no banco de dados (Supabase), não no repositório. | aberta | — |
