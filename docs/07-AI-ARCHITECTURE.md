# ARQUITETURA DE IA — LIFE OS
# Chief of Staff System

> Documento definitivo de arquitetura do sistema de Inteligência Artificial do Life OS.
> A IA não é um chatbot — é um Chief of Staff digital que conhece toda a vida do usuário.

**Versão:** 1.0 | **Criado:** 2026-06-27

---

## VISÃO

O usuário deve sentir que tem um Chief of Staff trabalhando 24h para ele:

- Conhece seus objetivos, hábitos, finanças e agenda
- Antecipa problemas antes que aconteçam
- Sugere a próxima melhor ação sempre que relevante
- Executa ações reais no sistema (cria tarefas, agenda eventos, categoriza gastos)
- Aprende e evolui com o tempo — quanto mais usa, mais útil fica
- Nunca interrompe sem motivo — proativo, não invasivo

---

## PRINCÍPIOS DA IA

| Princípio | Definição |
|---|---|
| **Contextual** | Toda resposta usa dados reais do usuário, nunca suposições |
| **Proativa** | Age antes de ser pedido quando a confiança é alta |
| **Explicável** | Sempre diz POR QUE está sugerindo algo |
| **Não intrusiva** | Insights aparecem em momentos naturais, nunca interrompem o fluxo |
| **Confiável** | Confirma antes de agir em algo irreversível |
| **Evoluível** | Cada interação melhora o modelo de compreensão do usuário |

---

## STACK TÉCNICA

```
LLM Principal:      Claude Sonnet 4.6 (raciocínio, chat, análise)
LLM Heavy:          Claude Opus 4.8 (revisões profundas, análise financeira)
LLM Rápido:         Claude Haiku 4.5 (classificação, extração simples)
Embeddings:         OpenAI text-embedding-3-small (1536 dims)
Vector Store:       pgvector no PostgreSQL (Supabase)
Cache:              Redis (Upstash) — respostas, contextos, rate limits
Filas:              BullMQ — jobs de insights, sync, consolidação
Transcrição:        OpenAI Whisper (áudio → texto)
```

### Escolha de modelo por tarefa

| Tarefa | Modelo | Justificativa |
|---|---|---|
| Chat contextual diário | Sonnet 4.6 | Balanço custo/qualidade |
| Extrair action items de reunião | Sonnet 4.6 | Estruturação média |
| Revisão semanal profunda | Opus 4.8 | Análise longitudinal |
| Análise financeira mensal | Opus 4.8 | Precisão crítica |
| Classificar item do inbox | Haiku 4.5 | Tarefa simples, alto volume |
| Extrair memórias de conversa | Haiku 4.5 | Extração estruturada |
| Gerar embeddings | text-embedding-3-small | Melhor custo-benefício |
| Transcrição de áudio | Whisper-1 | Único provider confiável |

---

## 1. ARQUITETURA DE MEMÓRIA

### 1.1 Tipos de Memória

```typescript
type MemoryCategory =
  | 'profile'       // Identidade: nome, profissão, empresa, cidade
  | 'preference'    // "prefiro manhãs para trabalho criativo", "não gosta de reuniões sexta"
  | 'goal'          // "quer atingir R$ 50k MRR até dezembro 2026"
  | 'project'       // "projeto X está em fase de lançamento"
  | 'person'        // "João Silva é sócio. Ana Costa é cliente prioritária."
  | 'decision'      // "decidiu focar em SaaS B2B em março/2026"
  | 'pattern'       // "procrastina design tasks, mais produtivo 7h-10h"
  | 'context'       // "está num momento de transição de carreira"
  | 'learning'      // "aprendeu que sprints de 2 semanas funcionam melhor para ele"
  | 'constraint'    // "não pode trabalhar depois das 19h por causa da família"
```

### 1.2 Estrutura de uma Memória

```typescript
interface AiMemory {
  id:          string
  workspaceId: string
  userId:      string

  content:     string          // texto da memória em linguagem natural
  category:    MemoryCategory
  importance:  number          // 1-10 (auto-calculado + manual)
  confidence:  number          // 0-1 (certeza do sistema sobre a memória)
  source:      MemorySource    // 'conversation' | 'behavior' | 'manual' | 'integration'
  sourceRef:   string | null   // ID da conversa/evento que gerou

  embedding:   number[]        // vetor 1536 dims para busca semântica
  tags:        string[]        // tags para filtragem

  accessCount: number          // quantas vezes foi recuperada
  lastAccessAt:DateTime | null
  expiresAt:   DateTime | null // null = permanente

  createdAt:   DateTime
  updatedAt:   DateTime
}
```

### 1.3 O que armazenar — por categoria

**profile (permanente, importance 8-10):**
- Nome preferido, pronomes
- Profissão, empresa, setor
- Cidade/timezone
- Estado civil, filhos (se mencionado)
- Idioma de preferência

**preference (permanente, importance 5-8):**
- Horários de pico de produtividade
- Tipo de trabalho preferido (criativo vs analítico vs operacional)
- Estilo de comunicação preferido da IA (conciso vs detalhado)
- Aversões conhecidas ("não gosto de reuniões sem pauta")
- Ferramentas e métodos favoritos

**goal (expiração na data da meta, importance 7-10):**
- Objetivos de curto prazo (< 3 meses)
- Objetivos de longo prazo (> 3 meses)
- Metas financeiras com valor e prazo
- Objetivos de saúde/hábitos
- Status atual do progresso

**person (permanente, importance 6-9):**
- Nome + papel (sócio, cliente, amigo, mentor)
- Empresa/contexto
- Última interação
- Tópicos de interesse / sensibilidades
- Pendências com a pessoa

**pattern (permanente, atualizado com novos dados, importance 6-8):**
- Horário de maior produtividade
- Tipos de tarefa que procrastina
- Padrão de conclusão (começa muitas coisas, termina poucas?)
- Padrão financeiro (gastos em estresse, economia irregular)
- Padrão de hábitos (melhor em sequências curtas)

**decision (permanente, importance 7-9):**
- Decisões estratégicas tomadas com data
- Motivo/contexto da decisão
- Resultado esperado
- Retrospectiva (foi boa decisão? — adicionada depois)

**constraint (permanente, importance 8-10):**
- Limitações de tempo (família, saúde)
- Restrições financeiras
- Restrições geográficas
- Valores não negociáveis

### 1.4 Quando armazenar

```
TRIGGER 1 — Fim de cada conversa com a IA
  → Haiku extrai memórias candidatas
  → Confidence > 0.7: salvar automaticamente
  → Confidence 0.4-0.7: salvar com flag 'needs_review'
  → Confidence < 0.4: descartar

TRIGGER 2 — Comportamento observado (BullMQ job diário)
  → Usuário sempre completa tarefas de manhã → pattern memory
  → Usuário cancelou 3 reuniões seguidas sexta → preference memory
  → Usuário nunca usa módulo de diário → preference (não gosta?)

TRIGGER 3 — Evento significativo
  → Projeto concluído → memory de aprendizado
  → Meta atingida → memory de conquista
  → Usuário editou manualmente uma tarefa de IA → memory de preferência

TRIGGER 4 — Manual pelo usuário
  → "Lembre-se que..." no chat → extrai e salva imediatamente
  → Interface de memórias: usuário adiciona diretamente
```

### 1.5 Quando esquecer / expirar

```
EXPIRAR (expiresAt definido):
  - Contextos temporários: "está de férias até X" → expira na data
  - Eventos passados: "reunião sobre Y" → expira após 90 dias
  - Objetivos com data: expira na data + 30 dias

NUNCA EXPIRAR (expiresAt = null):
  - Perfil, preferências core
  - Decisões estratégicas
  - Pessoas importantes
  - Padrões comportamentais
  - Aprendizados

CONSOLIDAR (job semanal):
  - 2+ memórias muito similares → merge na de maior importance
  - Memória contradiz outra mais recente → marcar antiga como 'superseded'
  - Memória acessada 0x em 90 dias + importance < 5 → arquivar
```

### 1.6 Priorização na recuperação

```
Score de recuperação = (1 - distância_vetorial) × 0.5
                     + (importance / 10) × 0.3
                     + recência × 0.2

recência = 1 / (1 + dias_desde_último_acesso / 30)

Sempre trazer as top-10 por score antes de injetar no contexto.
Limite: 2000 tokens de memórias por conversa.
```

---

## 2. CONTEXT ENGINE

### 2.1 Arquitetura do contexto

O Context Engine monta o payload que a IA recebe antes de responder. Diferente por módulo e por tipo de query.

```
CONTEXT = SISTEMA_BASE + MEMÓRIAS + DADOS_HOJE + DADOS_RECENTES + QUERY_ESPECÍFICO
```

### 2.2 Contexto base (sempre presente)

```
- Nome e timezone do usuário
- Data e hora atual
- Módulo ativo
- Plano do workspace (para saber o que pode fazer)
- Top 10 memórias relevantes para a query atual
```

### 2.3 Contexto de dados (por módulo)

**Dashboard / Assistente Executivo:**
```
HOJE:
  - Tarefas agendadas para hoje (max 20, com status e prioridade)
  - Eventos de hoje (agenda)
  - Hábitos do dia (quais feitos, quais pendentes)
  - Insights não lidos do dia

SEMANA:
  - Tarefas vencendo esta semana
  - Próximos 5 eventos
  - Projetos ativos (nome, % progresso, próxima tarefa)

LONGO PRAZO:
  - Objetivos ativos (nome, progresso atual vs meta)
  - Top 3 projetos por prioridade
```

**Finanças:**
```
  - Saldo atual de cada conta
  - Gastos do mês atual por categoria (top 5)
  - Receitas do mês
  - Comparativo vs mês anterior
  - Metas financeiras com progresso
  - Últimas 10 transações
```

**Reunião (extração de action items):**
```
  - Texto completo das notas da reunião
  - Participantes e seus papéis
  - Projeto vinculado
  - Tarefas existentes relacionadas ao projeto
```

**Hábitos:**
```
  - Lista de hábitos com frequência
  - Histórico dos últimos 30 dias (streak, taxa de conclusão)
  - Padrões detectados
  - Hábitos em risco de quebrar streak
```

### 2.4 Compressão de contexto

```
Token budget total por resposta: 8.000 tokens
  - Sistema: 800 tokens
  - Memórias: 2.000 tokens
  - Dados do módulo: 4.000 tokens
  - Histórico da conversa: 1.200 tokens

Se dados > budget: comprimir priorizando:
  1. Dados de hoje (nunca comprimir)
  2. Dados críticos (atrasado, urgente, em risco)
  3. Contexto do módulo ativo
  4. Histórico recente (últimas 3 mensagens)
  5. Compressão semântica de mensagens antigas
```

---

## 3. AGENTES ESPECIALIZADOS

### 3.1 Agente: Assistente Executivo

**Responsabilidade:** Planejar o dia, priorizar tarefas, organizar agenda, criar planos de ação.

**Quando é ativado:**
- Abertura do app (proativo) — gera briefing do dia
- Query: "O que devo fazer agora?", "Organize minha semana"
- Tarefa urgente sem data criada → sugere encaixar na agenda
- Conflito de agenda detectado

**Ferramentas disponíveis:**
```typescript
tools: [
  'list_tasks',          // listar com filtros
  'create_task',         // criar tarefa
  'update_task',         // atualizar prioridade/data
  'reorder_tasks',       // reordenar por critério
  'get_calendar',        // ver agenda do dia/semana
  'create_event',        // criar evento
  'update_event',        // mover evento
  'get_projects',        // ver projetos e progresso
  'get_goals',           // ver objetivos e progresso
  'send_insight',        // enviar insight para o usuário
]
```

**Comportamento proativo:**
```
Diariamente às 7h (configurável):
  → Montar briefing: "Bom dia! Aqui está seu dia:"
  → 3 prioridades selecionadas pela IA
  → 1 insight do dia ("Você tem reunião às 14h. Reserve 30min antes para preparação")
  → Alerta de tarefas vencendo
  → Sugestão de ordem de execução

Threshold de intervenção: apenas quando pode agregar valor claro.
Nunca enviar mais de 3 notificações proativas por dia.
```

**Lógica de priorização:**
```
Score de prioridade = urgência × 0.4
                    + impacto × 0.3
                    + esforço_inverso × 0.2
                    + contexto_agenda × 0.1

urgência:          dias_para_vencer (1=hoje, 0=sem data)
impacto:           prioridade do usuário (URGENT=1.0, HIGH=0.75...)
esforço_inverso:   estimativa de tempo (<30min = 1.0, >2h = 0.3)
contexto_agenda:   tem slot livre próximo? (1.0 = sim, 0 = dia cheio)
```

---

### 3.2 Agente: Coach de Hábitos

**Responsabilidade:** Acompanhar consistência, motivar, detectar padrões, sugerir ajustes.

**Quando é ativado:**
- Check-in diário de hábitos (abertura do módulo)
- Hábito em risco de quebrar streak (> 1 dia sem marcar)
- Query sobre hábitos: "Como estão meus hábitos?", "Por que não consigo manter X?"
- Revisar semanal (seção de hábitos)

**Ferramentas:**
```typescript
tools: [
  'get_habits',             // listar com histórico
  'get_habit_history',      // histórico detalhado (30/60/90 dias)
  'log_habit',              // registrar conclusão
  'update_habit',           // ajustar frequência, horário
  'create_habit',           // criar novo hábito
  'get_patterns',           // padrões de comportamento das memórias
  'send_motivation_insight',// insight motivacional
]
```

**Comportamento:**
```
Daily check (18h, se hábito pendente):
  → "Você ainda não marcou [Exercício] hoje. Ainda dá tempo!"
  → Com contexto: "Você normalmente faz às 18h. São 18h agora."

Streak em risco (48h sem marcar):
  → "Sua sequência de [Meditação] está em risco (7 dias). Que tal 5 minutos agora?"

Análise semanal:
  → "Esta semana você completou 5/7 dias de exercício — sua melhor semana em 3 semanas!"
  → "Padrão identificado: você falha mais às sextas. Quer ajustar para 5x/semana?"

Tom: encorajador, nunca punitivo. Celebrar consistência, não perfeição.
```

---

### 3.3 Agente: Assistente Financeiro

**Responsabilidade:** Analisar gastos, detectar padrões, alertar orçamento, projetar metas.

**Quando é ativado:**
- Abertura do módulo Finanças
- Novo lançamento criado (categorização automática)
- Query: "Como estão minhas finanças?", "Vou atingir minha meta?"
- Fim do mês (relatório automático)
- Gasto categorizado em "outros" → sugere categoria

**Ferramentas:**
```typescript
tools: [
  'get_accounts',           // saldo e tipo de cada conta
  'get_transactions',       // com filtros (período, categoria, conta)
  'categorize_transaction', // sugerir/aplicar categoria
  'get_spending_by_category',
  'get_monthly_summary',
  'get_goal_progress',      // metas financeiras
  'project_goal',           // projeção: vai atingir a meta?
  'create_alert',           // alerta de orçamento
]
```

**Comportamento proativo:**
```
Ao criar transação sem categoria:
  → "Identifiquei como possível [Alimentação]. Confirmar?"

Ao atingir 80% do orçamento da categoria:
  → "Você já usou 80% do orçamento de [Alimentação] este mês (R$ 400/R$ 500)"

Relatório mensal (1º de cada mês):
  → Resumo: receitas, despesas, saldo
  → Top 3 categorias de gasto
  → Comparativo vs mês anterior
  → Projeção das metas financeiras

IMPORTANTE: Nunca recomendar investimentos específicos.
            Nunca fazer afirmações sobre rentabilidade futura.
            Redirecionar para profissional quando necessário.
```

---

### 3.4 Agente: Assistente de Conhecimento

**Responsabilidade:** Organizar ideias, conectar informações, resumir conteúdos, busca semântica.

**Quando é ativado:**
- Módulo de Notas ou Ideias
- Query: "O que sei sobre X?", "Conecte essa ideia com meus projetos"
- Nova nota criada → sugestão de tags e conexões
- Busca semântica explícita

**Ferramentas:**
```typescript
tools: [
  'search_notes',           // busca semântica em notas
  'search_ideas',           // busca em ideias
  'get_related_content',    // encontrar conteúdos relacionados
  'create_note',
  'update_note',
  'add_tags',
  'create_idea',
  'convert_idea_to_project',
  'summarize_content',      // resumir nota/documento longo
  'find_connections',       // "esta nota conecta com X, Y, Z"
]
```

**Comportamento:**
```
Ao criar nota:
  → Sugerir tags baseadas no conteúdo
  → "Esta nota tem relação com [Projeto X] e [Nota Y sobre mesmo tema]"

Ao buscar ("⌘K → busca"):
  → Busca semântica: retorna resultado mesmo se palavras forem diferentes
  → "Você escreveu sobre isso em [nota de 2 meses atrás]"

Ao criar ideia:
  → "Você teve uma ideia parecida em [data]: [resumo]. Deseja ver?"
  → Sugerir: "Esta ideia poderia virar projeto? [Transformar]"
```

---

### 3.5 Agente: Assistente de Reuniões

**Responsabilidade:** Resumir, extrair ações, criar tarefas, conectar ao projeto.

**Quando é ativado:**
- Clicar "Extrair próximos passos" após reunião
- Clicar "Resumir" em notas de reunião
- Query em notas: "O que ficou combinado na reunião com X?"

**Ferramentas:**
```typescript
tools: [
  'get_meeting_notes',      // texto completo das notas
  'extract_action_items',   // lista estruturada de ações
  'create_task',            // criar tarefas a partir das ações
  'get_project',            // contexto do projeto vinculado
  'get_person_context',     // contexto de participantes (memórias)
  'create_meeting_summary', // gerar resumo executivo
  'send_summary_email',     // (P2) enviar por email
]
```

**Fluxo de extração:**
```
1. Receber texto das notas
2. Identificar action items (padrão: "X vai fazer Y até Z")
3. Para cada action item:
   - Quem é o responsável?
   - Qual a tarefa específica?
   - Existe prazo mencionado?
   - Qual a prioridade implícita?
4. Apresentar lista para revisão do usuário
5. Após confirmação: criar tarefas no sistema
6. Vincular ao projeto e à reunião
7. Gerar resumo executivo (3-5 bullets)
```

---

## 4. INBOX UNIVERSAL — CLASSIFICAÇÃO POR IA

### 4.1 Fluxo de entrada

```
ITEM ENTRA NO INBOX
(texto, áudio, imagem, link, WhatsApp, email)
        ↓
CLASSIFICAÇÃO AUTOMÁTICA (Haiku — < 1s)
        ↓
┌────────────────────────────────────────┐
│ Tipo detectado:                        │
│  • Ação necessária → sugerir Tarefa    │
│  • Informação a guardar → sugerir Nota │
│  • Ideia criativa → sugerir Ideia      │
│  • Evento/compromisso → sugerir Evento │
│  • Lançamento financeiro → sugerir     │
│    Transação                           │
└────────────────────────────────────────┘
        ↓
ENRIQUECER (Sonnet — se necessário)
  • Extrair data/hora → preencher dueDate
  • Identificar pessoa → linkar memória
  • Identificar projeto → sugerir associação
  • Detectar urgência → sugerir prioridade
        ↓
APRESENTAR PARA USUÁRIO
  • Item no Inbox com sugestão de tipo
  • Botão: [Aceitar sugestão] [Personalizar] [Descartar]
  • Ação com 1 toque em mobile
```

### 4.2 Exemplos de classificação

| Texto capturado | Tipo detectado | Enriquecimento |
|---|---|---|
| "Ligar para João sobre contrato" | Tarefa | prioridade: alta, pessoa: João |
| "Ideia: criar módulo de treinos no app" | Ideia | projeto: Life OS sugerido |
| "Reunião com cliente amanhã às 14h" | Evento | data: amanhã, hora: 14h00 |
| "Gastei R$ 85 no mercado" | Transação | categoria: Alimentação |
| "Referência de design que achei interessante: [link]" | Nota | tags: design, referência |
| "URGENTE: servidor caiu" | Tarefa | prioridade: URGENT |

### 4.3 Processamento de mídia

```
ÁUDIO:
  → Whisper transcreve o áudio
  → Texto vai para classificação normal

IMAGEM:
  → GPT-4V / Claude Vision extrai texto e contexto
  → Se for recibo/nota fiscal: sugerir Transação com valor extraído
  → Se for quadro/whiteboard: sugerir Nota com OCR
  → Se for screenshot de tarefa: sugerir Tarefa

LINK:
  → Crawler busca título + description + og:image
  → Classificar: artigo (Nota), produto (Ideia/Lista), evento (Evento)
  → Preservar preview
```

---

## 5. SISTEMA DE INSIGHTS

### 5.1 Tipos de insight

```typescript
type InsightType =
  // Produtividade
  | 'overdue_tasks_accumulating'   // "Você tem 8 tarefas atrasadas acumulando"
  | 'busy_week_ahead'              // "Semana que vem está superlotada. Redistribuir?"
  | 'quick_wins_available'         // "3 tarefas rápidas pendentes. Quer limpar?"
  | 'project_stalled'              // "Projeto X parado há 10 dias"
  | 'productivity_peak'            // "Você é 40% mais produtivo às terças de manhã"

  // Hábitos
  | 'streak_at_risk'               // "Sua sequência de X vai quebrar hoje"
  | 'habit_pattern_detected'       // "Você falha hábitos às sextas"
  | 'habit_milestone'              // "🔥 30 dias consecutivos de meditação!"
  | 'new_habit_suggested'          // "Com base nos seus objetivos, considere Y"

  // Financeiro
  | 'spending_spike'               // "Gastos com alimentação 40% acima do normal"
  | 'budget_80_percent'            // "80% do orçamento de X usado"
  | 'goal_behind_schedule'         // "Meta de R$ 10k: precisa de R$ 800/mês. Você está em R$ 300"
  | 'unusual_expense'              // "Gasto incomum de R$ 2.400 em Outros"

  // Objetivos
  | 'goal_at_risk'                 // "Objetivo X em risco — sem progresso há 3 semanas"
  | 'goal_ahead_of_schedule'       // "🎉 Meta de corrida: você vai atingir 2 semanas antes"
  | 'goal_achieved'                // "✅ Você atingiu sua meta de X!"

  // Relações
  | 'follow_up_needed'             // "Você não fala com João há 3 semanas. Follow-up?"
  | 'pending_commitment'           // "Você prometeu enviar proposta para Ana. Ainda pendente."
```

### 5.2 Geração de insights

```
FREQUÊNCIA:
  - Job diário: 6h30 — gera insights do dia (urgências, alertas)
  - Job semanal: domingo 20h — análise da semana
  - Job em tempo real: gatilhos específicos (streak quebrou, budget atingido)

PRIORIZAÇÃO:
  Priority 1 (badge vermelho): ação urgente necessária hoje
    → overdue_tasks, streak_at_risk_today, budget_100_percent

  Priority 2 (badge amarelo): atenção nos próximos dias
    → goal_at_risk, busy_week_ahead, spending_spike

  Priority 3 (badge azul): informacional, sem urgência
    → productivity_peak, habit_milestone, goal_ahead_of_schedule

LIMITE: máximo 5 insights ativos simultaneamente
        se tiver mais, mostrar apenas os 5 de maior prioridade

COMO EXIBIR:
  - Dashboard Hoje: card de insights (max 3)
  - Módulo específico: insight contextual no topo da página
  - Notificação push (apenas P1): apenas prioridade 1, máx 1/dia
  - Toast: quando insight gerado em tempo real
```

### 5.3 Formato de um insight

```typescript
interface AiInsight {
  id:          string
  userId:      string
  workspaceId: string
  type:        InsightType
  priority:    1 | 2 | 3
  title:       string     // "3 tarefas urgentes vencendo hoje"
  body:        string     // Explicação em 1-2 linhas
  action:      InsightAction | null  // ação sugerida
  module:      string     // onde exibir
  data:        object     // dados que embasam o insight (para auditoria)
  readAt:      DateTime | null
  dismissedAt: DateTime | null
  expiresAt:   DateTime   // insights expiram em 24h (diários) ou 7 dias (semanais)
}

interface InsightAction {
  label:    string  // "Ver tarefas" / "Ajustar orçamento" / "Fazer check-in"
  type:     'navigate' | 'action' | 'ai_chat'
  payload:  object  // rota, action id, ou mensagem inicial para o chat
}
```

---

## 6. COMANDOS NATURAIS — NLP

### 6.1 Intenções mapeadas

```typescript
type Intent =
  // Planejamento
  | 'plan_day'              // "organize meu dia", "o que faço hoje?"
  | 'plan_week'             // "organize minha semana", "planejamento semanal"
  | 'prioritize'            // "o que é mais importante agora?", "minhas prioridades"

  // Consulta
  | 'query_tasks'           // "o que está atrasado?", "tarefas de hoje"
  | 'query_projects'        // "como estão meus projetos?", "status do projeto X"
  | 'query_finances'        // "como estão minhas finanças?", "quanto gastei este mês?"
  | 'query_habits'          // "como estão meus hábitos?", "minha sequência de X"
  | 'query_goals'           // "como está minha meta de X?", "estou no caminho certo?"
  | 'search_content'        // "onde anotei sobre X?", "reunião com João"

  // Ação
  | 'create_task'           // "cria uma tarefa para X", "lembra de Y até Z"
  | 'create_project'        // "cria um projeto para X"
  | 'create_habit'          // "quero começar a X todo dia"
  | 'log_expense'           // "gastei R$ 50 em combustível"
  | 'schedule_event'        // "agenda reunião com X na quarta às 14h"

  // Análise
  | 'analyze_productivity'  // "como foi minha semana?", "sou produtivo?"
  | 'analyze_finances'      // "onde estou gastando mais?", "posso economizar?"
  | 'analyze_habits'        // "por que não consigo manter X?"
  | 'create_plan'           // "crie um plano para atingir X"

  // Meeting
  | 'extract_action_items'  // "extraia os próximos passos"
  | 'summarize_meeting'     // "resuma essa reunião"
```

### 6.2 Entidades extraídas

```typescript
interface ExtractedEntities {
  person?:    string    // "João", "cliente X", "meu sócio"
  project?:   string    // "projeto Y", "o app"
  date?:      Date      // "amanhã", "próxima sexta", "31/12"
  time?:      string    // "14h", "de manhã", "às 8"
  amount?:    number    // R$ 50, 200 reais
  category?:  string    // "alimentação", "transporte"
  priority?:  Priority  // "urgente", "importante", "quando puder"
  duration?:  number    // "30 minutos", "2 horas"
  goal?:      string    // "meta de X", "objetivo Y"
  habit?:     string    // "meditação", "exercício"
}
```

### 6.3 Ferramentas por intenção

```
plan_day → list_tasks + get_calendar + get_habits + reorder_tasks
plan_week → list_tasks + get_calendar + get_goals + suggest_time_blocks
prioritize → list_tasks + get_goals + get_projects + score_and_rank
query_finances → get_accounts + get_spending_by_category + get_monthly_summary
create_plan → get_goal + create_tasks (múltiplas) + create_habit (se aplicável)
log_expense → create_transaction + categorize + check_budget
```

---

## 7. SISTEMA DE AUTOMAÇÕES

### 7.1 Arquitetura

```
TRIGGER (evento acontece)
    ↓
CONDIÇÃO (verificar regras)
    ↓
AÇÃO (executar)
    ↓
LOG (auditoria)
    ↓
NOTIFICAÇÃO (opcional)
```

### 7.2 Automações do sistema (built-in, sem configuração)

```yaml
automation: tarefa-vencida-inbox
  trigger: task.dueDate < now() AND task.status != DONE
  condition: task não está em inbox
  action: adicionar badge "Atrasada" + subir para topo do dia
  frequency: verificar 1x/hora

automation: projeto-sem-atividade
  trigger: project.updatedAt < now() - 7 days AND project.status == ACTIVE
  condition: nenhuma tarefa atualizada no projeto nos últimos 7 dias
  action: gerar insight 'project_stalled'
  frequency: 1x/dia

automation: habito-risco-streak
  trigger: habit.frequency == DAILY AND habit não logado hoje
  condition: horário > 20h
  action: notificação + insight 'streak_at_risk'
  frequency: verificar às 20h diariamente

automation: budget-alerta
  trigger: gastos_categoria >= orçamento_categoria × 0.8
  action: gerar insight 'budget_80_percent'
  frequency: ao criar/atualizar transação

automation: meta-atrasada
  trigger: goal.progress_rate < goal.required_rate
  condition: goal.dueDate > now() (ainda não venceu)
  action: gerar insight 'goal_at_risk'
  frequency: 1x/semana (domingo)

automation: reuniao-acao-pendente
  trigger: meeting criada há > 24h com action items extraídos
  condition: action items ainda não foram convertidos em tarefas
  action: lembrete "Você ainda não criou as tarefas da reunião X"
  frequency: 1x, após 24h da reunião
```

### 7.3 Automações configuráveis pelo usuário (P1)

Interface no-code: "Quando [TRIGGER] → Fazer [AÇÃO]"

```yaml
triggers disponíveis:
  - Mensagem WhatsApp com palavra-chave
  - Email de remetente específico
  - Tarefa criada no projeto X
  - Hábito não feito até horário Y
  - Gasto acima de R$ X em categoria Y
  - Objetivo sem atualização há N dias

ações disponíveis:
  - Criar tarefa (com campos pré-preenchidos)
  - Criar nota
  - Criar ideia
  - Enviar notificação
  - Mover item para projeto
  - Marcar tag em item
  - Iniciar conversa com IA ("analisar situação")

proteções:
  - Loop detection: automação não pode disparar a si mesma
  - Max depth: cadeia de automações limitada a 3 níveis
  - Circuit breaker: desativa automação após 5 erros
  - Rate limit: max 100 automações/hora por workspace
```

### 7.4 Fluxos de automação específicos

**WhatsApp → Tarefa (P2):**
```
1. Mensagem recebida no WhatsApp Business API
2. Webhook dispara → BullMQ job
3. Haiku classifica: é ação necessária?
4. Se sim: criar item no Inbox com texto da mensagem
5. Enriquecer: identificar pessoa, urgência, prazo
6. Notificar usuário: "Nova mensagem de João no inbox"
7. Usuário confirma → Tarefa criada
```

**Reunião → Próximos Passos (P1):**
```
1. Usuário clica "Extrair próximos passos"
2. Meeting Agent processa notas
3. Action items gerados e apresentados
4. Usuário revisa (editar, remover, confirmar)
5. Tarefas criadas em batch
6. Linked ao projeto e à reunião
7. Assignees notificados (se multi-usuário)
```

**Meta → Plano de Ação (P1):**
```
1. Usuário cria objetivo: "Lançar produto até outubro"
2. IA pergunta: "Quer que eu crie um plano inicial?"
3. Se sim: analisar objetivo → gerar marcos → gerar tarefas
4. Apresentar plano para revisão
5. Usuário aprova → criar projeto + milestones + tarefas
6. Vincular hábito se aplicável
```

---

## 8. SISTEMA DE RECOMENDAÇÕES

### 8.1 Tipos de recomendação

```
ORDEM DO DIA (manhã):
  → Ordenar tarefas do dia por score de prioridade
  → Sugerir hora ideal para cada tipo de tarefa
  → "Trabalhe em [tarefa criativa] agora — seu pico de criatividade é 8h-10h"

HORÁRIO IDEAL (ao criar tarefa):
  → Analisar agenda livre + tipo de tarefa + padrão histórico
  → "Para uma tarefa de análise (2h), o melhor slot disponível é amanhã 9h-11h"

PRÓXIMA AÇÃO (ao concluir tarefa):
  → Baseado no projeto, objetivo e prioridades
  → "Próxima tarefa sugerida: [X] — ela desbloqueia 3 outras tarefas"

REDISTRIBUIÇÃO (quando agenda está sobrecarregada):
  → "Você tem 12 tarefas para 3 dias. Posso redistribuir com base nas prioridades?"

PREVENÇÃO DE BLOQUEIO:
  → "Esta tarefa tem dependência de João. Ele ainda não respondeu há 3 dias."
```

### 8.2 Algoritmo de sugestão de horário

```
1. Pegar tipo de tarefa (criativa, analítica, operacional, comunicação)
2. Mapear para padrão do usuário (memory: peak hours por tipo)
3. Buscar slots livres na agenda (hoje + próximos 3 dias)
4. Filtrar por duração estimada da tarefa
5. Ranquear por:
   - Match com peak hour do tipo (peso 0.4)
   - Proximidade do prazo (peso 0.3)
   - Sequência lógica no dia (peso 0.2)
   - Preferências de intervalo (peso 0.1)
6. Retornar top 3 opções
```

---

## 9. ROADMAP DE IMPLEMENTAÇÃO

### P0 — MVP (Sprints 4-5)

```
Sprint 4:
  ✅ Interface de chat com streaming (SSE)
  ✅ Context Engine básico (tarefas + projetos do dia)
  ✅ Tool use: create_task, list_tasks, update_task
  ✅ Histórico de conversa persistido
  ✅ Rate limiting por plano
  ✅ System prompt com contexto do usuário

Sprint 5:
  ✅ Classificação de inbox (Haiku)
  ✅ Quick capture multiformat
  ✅ Extração básica de memórias após conversa
  ✅ Busca vetorial simples (pgvector setup)
  ✅ 3 insights diários básicos
```

### P1 — Inteligente (Sprints 7-9)

```
Sprint 7:
  ✅ Sistema completo de memórias (extração + recuperação + consolidação)
  ✅ Context Engine completo (todos os módulos)
  ✅ Insights avançados (7 tipos)
  ✅ Assistente Executivo (priorização + briefing do dia)
  ✅ Meeting Agent (extração de action items)

Sprint 8:
  ✅ Agente de Hábitos (coaching + alertas de streak)
  ✅ Agente Financeiro (análise + alertas de orçamento)
  ✅ RAG completo (busca semântica em notas e reuniões)
  ✅ Automações built-in (7 automações do sistema)

Sprint 9:
  ✅ Agente de Conhecimento (conexões entre notas/ideias)
  ✅ Comandos naturais (NLP intent detection)
  ✅ Sistema de recomendações (horário ideal, próxima ação)
  ✅ UI de memórias (ver, editar, deletar)
```

### P2 — Avançado (Sprint 13+)

```
  ✅ Automações configuráveis no-code
  ✅ Agentes especializados por domínio (FinanceAgent, HabitAgent)
  ✅ Insights proativos via push notification
  ✅ Processamento de imagem (Vision) no inbox
  ✅ Integração WhatsApp → IA
  ✅ Revisão semanal 100% guiada pela IA
  ✅ Life Score calculado
  ✅ API pública de IA
```

---

## 10. RISCOS E MITIGAÇÕES

### Risco 1 — Custo de IA em escala (CRÍTICO)

```
Problema: Com 1.000 usuários, custo mensal pode ser R$ 15.000-50.000/mês.

Cálculo estimado (1.000 usuários ativos):
  Chat: 20 msgs/usuário/mês × 5k tokens médio × $3/M = $300/mês
  Contexto: 8k tokens × 20 chamadas/dia × 30 dias × $3/M = $1.440/mês
  Insights: 1k tokens × 30 dias × 1.000 usuários × $0.25/M = $7,50/mês
  Total estimado: ~$1.750/mês para 1.000 usuários

Mitigações:
  1. Cache Redis: respostas idênticas em 24h (hit rate esperado: 20-30%)
  2. Haiku para classificação (80% mais barato que Sonnet)
  3. Contexto comprimido: máx 8k tokens sempre
  4. Hard limit: Free = 10 msgs/dia, Pro = 200 msgs/dia
  5. Batch insights: processar em horário off-peak (3h-5h)
  6. Monitorar custo/usuário em dashboard admin com alertas
  7. Fallback automático: se custo > threshold, throttle gradual
```

### Risco 2 — Memórias incorretas / privacidade (ALTO)

```
Problema: IA pode salvar informação errada ou sensível.

Mitigações:
  1. Confiança (confidence < 0.7) → salvar como 'needs_review' (não usada)
  2. UI de memórias transparente: usuário vê e controla tudo
  3. Nunca salvar: senhas, cartões, dados financeiros brutos
  4. LGPD: endpoint de deletar TODAS as memórias
  5. Logs de auditoria de quais memórias foram usadas em cada resposta
  6. "Como você sabe disso?" → IA sempre pode explicar a fonte
```

### Risco 3 — IA age sem permissão (ALTO)

```
Problema: IA cria/modifica dados sem o usuário querer.

Mitigações:
  1. Ações irreversíveis: SEMPRE pedir confirmação antes
     ("Vou criar 5 tarefas. Confirmar?")
  2. Preview antes de executar qualquer ação em batch
  3. Undo disponível por 30 segundos após ação da IA
  4. Log de "Ações da IA" auditável pelo usuário
  5. Nível de autonomia configurável: "Perguntar sempre" / "Confirmar em batch" / "Agir direto"
```

### Risco 4 — Contexto stale / desatualizado (MÉDIO)

```
Problema: IA responde com dados antigos (cache stale).

Mitigações:
  1. Cache de contexto: TTL de 5 minutos máximo
  2. Invalidar cache ao criar/atualizar qualquer item
  3. Timestamp do contexto visível na resposta (debug mode)
  4. Usuário pode forçar "Atualizar contexto" no chat
```

### Risco 5 — Alucinações em dados financeiros (ALTO)

```
Problema: IA inventa números financeiros.

Mitigações:
  1. Agente financeiro SEMPRE usa tool use para buscar dados reais
  2. Nunca interpolar ou estimar valores — apenas o que está no banco
  3. Mostrar fonte dos dados ("Com base em 47 transações de janeiro")
  4. Disclaimer em análises financeiras
  5. Nunca dar conselhos de investimento
```

---

## 11. CUSTOS ESTIMADOS

### Por plano/usuário/mês

| Plano | Limite IA | Custo IA estimado | Preço do plano |
|---|---|---|---|
| Free | 10 msgs/dia | ~$0,30/mês | Gratuito |
| Pro | 200 msgs/dia | ~$3,50/mês | $15/mês |
| Team | Ilimitado | ~$12/mês | $30/mês |

### Breakdown do custo Pro (estimado)

```
Chat (200 msgs × 5k tokens × $3/M):      $3,00/mês
Insights diários (30 × 2k tokens × $3/M): $0,18/mês
Memórias (extração: $0,05/mês):           $0,05/mês
Embeddings (buscas: $0,01/M tokens):      $0,05/mês
Total:                                    ~$3,28/mês

Margem IA: $15 - $3,28 = $11,72/usuário/mês
Margem bruta IA: ~78%
```

---

## 12. MELHORIAS FUTURAS

### Curto prazo (pós-MVP)
1. **Modo Coaching Proativo** — IA envia 1 insight contextual por manhã via notificação push
2. **"Explain This"** — botão em qualquer insight para IA explicar como chegou à conclusão
3. **Atalho "Hey Life OS"** — ativar IA por voz em qualquer tela (mobile)

### Médio prazo
4. **Fine-tuning por usuário** — modelo aprende o estilo e padrões específicos de cada usuário ao longo do tempo
5. **Multi-agent orchestration** — agentes colaboram entre si (Executivo + Hábitos + Financeiro trabalhando juntos na revisão semanal)
6. **Integração com WhatsApp** — conversar com a IA diretamente pelo WhatsApp

### Longo prazo
7. **Life OS API** — terceiros podem construir agentes personalizados sobre a plataforma
8. **Modelo próprio fine-tuned** — treinar modelo específico para produtividade pessoal (pós 100k usuários)
9. **Previsão de burnout** — detectar padrões de sobrecarga e sugerir ajustes antes do colapso
10. **IA colaborativa** — compartilhar context entre usuários de um time (workspace colaborativo)

---

*Versão: 1.0 | Status: Aprovado | Criado: 2026-06-27*
