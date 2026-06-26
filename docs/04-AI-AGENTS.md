# IA E AGENTES — LIFE OS

> Arquitetura completa do sistema de IA. A IA não é um chatbot separado — é a camada de inteligência que atravessa todos os módulos.

---

## FILOSOFIA

O sistema de IA do Life OS funciona como um **assistente pessoal que conhece toda a sua vida**.

Diferente de um chatbot genérico:
- Tem **memória persistente** do usuário
- Conhece **todos os dados** do workspace (tarefas, notas, agenda, finanças...)
- Age **proativamente** — não espera ser chamado
- Gera **insights** contextuais em cada módulo
- Executa **ações reais** no sistema (criar tarefas, agendar eventos...)

---

## PROVIDERS DE IA

```typescript
// ai/providers.ts

// Raciocínio complexo, análise, geração longa
const claude = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
const CLAUDE_MODEL = 'claude-sonnet-4-6'  // balanceado custo/qualidade
const CLAUDE_MODEL_HEAVY = 'claude-opus-4-8'  // análises profundas

// Embeddings (memórias, busca semântica)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
const EMBEDDING_MODEL = 'text-embedding-3-small'  // 1536 dims
```

### Quando usar cada modelo

| Tarefa | Modelo |
|---|---|
| Chat contextual, resumos rápidos | claude-sonnet-4-6 |
| Análise profunda, revisão semanal | claude-opus-4-8 |
| Embeddings para busca/memória | text-embedding-3-small |
| Transcrição de áudio (futuro) | whisper-1 |

---

## SISTEMA DE MEMÓRIAS

### Tipos de Memória

```typescript
type MemoryCategory =
  | 'preference'    // "prefiro manhãs para trabalho criativo"
  | 'fact'          // "trabalha na empresa X como Y"
  | 'goal'          // "quer perder 10kg até dezembro"
  | 'pattern'       // "tende a procrastinar tarefas de design"
  | 'relationship'  // "João é seu sócio"
  | 'context'       // "está num momento de transição de carreira"
```

### Ciclo de Vida das Memórias

```
1. EXTRAÇÃO
   Durante conversas, a IA identifica informações relevantes
   e as salva como memórias estruturadas

2. RECUPERAÇÃO
   A cada conversa, as memórias mais relevantes são
   buscadas via similaridade vetorial (pgvector)

3. CONSOLIDAÇÃO
   Job semanal consolida memórias redundantes
   e atualiza importância com base no uso

4. EXPIRAÇÃO
   Memórias temporárias (eventos passados) expiram automaticamente
```

### Implementação

```typescript
// ai/memory.ts

export async function saveMemory(
  userId: string,
  workspaceId: string,
  content: string,
  category: MemoryCategory,
  importance: number = 5
) {
  const embedding = await generateEmbedding(content)

  await db.aiMemory.upsert({
    where: { /* hash do content */ },
    create: {
      userId,
      workspaceId,
      content,
      category,
      importance,
      embedding,
    },
    update: {
      importance: { increment: 1 },
      updatedAt: new Date(),
    },
  })
}

export async function recallMemories(
  userId: string,
  workspaceId: string,
  query: string,
  limit = 10
): Promise<AiMemory[]> {
  const queryEmbedding = await generateEmbedding(query)

  // Busca por similaridade vetorial no PostgreSQL (pgvector)
  return db.$queryRaw`
    SELECT *, (embedding <=> ${queryEmbedding}::vector) AS distance
    FROM ai_memories
    WHERE workspace_id = ${workspaceId}
      AND user_id = ${userId}
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY distance
    LIMIT ${limit}
  `
}
```

---

## CONTEXTO DINÂMICO

Antes de cada resposta da IA, montamos um contexto rico do usuário:

```typescript
// ai/context.ts

export async function buildUserContext(
  userId: string,
  workspaceId: string,
  module: string
): Promise<string> {
  const [
    memories,
    todayTasks,
    upcomingEvents,
    activeProjects,
    recentNotes,
  ] = await Promise.all([
    recallMemories(userId, workspaceId, module, 8),
    getTodayTasks(workspaceId, userId),
    getUpcomingEvents(workspaceId, userId, 7),
    getActiveProjects(workspaceId, userId),
    getRecentNotes(workspaceId, userId, 5),
  ])

  return `
## Contexto do Usuário

### Memórias Relevantes
${memories.map(m => `- ${m.content}`).join('\n')}

### Hoje (${format(new Date(), 'dd/MM/yyyy')})
**Tarefas:** ${todayTasks.length} tarefas
${todayTasks.slice(0, 5).map(t => `- [${t.status}] ${t.title}`).join('\n')}

### Próximos Eventos (7 dias)
${upcomingEvents.slice(0, 3).map(e => `- ${format(e.startsAt, 'dd/MM HH:mm')} — ${e.title}`).join('\n')}

### Projetos Ativos
${activeProjects.slice(0, 5).map(p => `- ${p.name} (${p._count.tasks} tarefas)`).join('\n')}
  `.trim()
}
```

---

## AGENTES ESPECIALIZADOS

Cada módulo tem um agente com ferramentas específicas:

### Agente de Tarefas

```typescript
// ai/agents/tasks.agent.ts

const taskTools: Tool[] = [
  {
    name: 'create_task',
    description: 'Cria uma nova tarefa no sistema',
    input_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        priority: { enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
        dueDate: { type: 'string', format: 'date' },
        projectId: { type: 'string' },
      },
      required: ['title'],
    },
  },
  {
    name: 'list_tasks',
    description: 'Lista tarefas com filtros opcionais',
    input_schema: { /* ... */ },
  },
  {
    name: 'update_task',
    description: 'Atualiza propriedades de uma tarefa existente',
    input_schema: { /* ... */ },
  },
  {
    name: 'schedule_task',
    description: 'Agenda uma tarefa para um horário específico',
    input_schema: { /* ... */ },
  },
]
```

### Agente de Reuniões

```typescript
const meetingTools: Tool[] = [
  {
    name: 'transcribe_audio',
    description: 'Transcreve o áudio da reunião',
  },
  {
    name: 'generate_summary',
    description: 'Gera um resumo estruturado da reunião',
  },
  {
    name: 'extract_action_items',
    description: 'Extrai itens de ação e os converte em tarefas',
  },
  {
    name: 'identify_decisions',
    description: 'Identifica decisões tomadas na reunião',
  },
]
```

### Agente Financeiro

```typescript
const financeTools: Tool[] = [
  {
    name: 'get_spending_summary',
    description: 'Resumo de gastos por período e categoria',
  },
  {
    name: 'identify_patterns',
    description: 'Identifica padrões de consumo',
  },
  {
    name: 'suggest_savings',
    description: 'Sugere onde economizar com base nos dados',
  },
  {
    name: 'project_balance',
    description: 'Projeta saldo futuro com base em receitas/despesas fixas',
  },
]
```

---

## PROMPTS DO SISTEMA

### Prompt Base (todos os módulos)

```typescript
// ai/prompts/base.ts

export const SYSTEM_PROMPT = `
Você é o assistente pessoal do Life OS — um sistema operacional pessoal.

Seu papel é ajudar o usuário a:
- Organizar sua vida e produtividade
- Tomar decisões melhores com base em dados
- Identificar padrões e oportunidades de melhoria
- Executar ações no sistema quando solicitado

Princípios:
- Seja direto e conciso. O usuário é ocupado.
- Use os dados reais do sistema, não suposições.
- Quando tiver dúvida, pergunte antes de agir.
- Prefira listas e estrutura a parágrafos longos.
- Use linguagem natural, não robótica.
- Responda sempre em português do Brasil.

Contexto do usuário:
{USER_CONTEXT}

Data/hora atual: {DATETIME}
Módulo ativo: {MODULE}
`
```

### Prompts por Módulo

```typescript
// ai/prompts/modules.ts

export const MODULE_PROMPTS = {
  dashboard: `
    Foco: ajudar o usuário a entender e priorizar seu dia.
    Perguntas típicas: "O que devo fazer agora?", "Como está meu dia?"
    Ações disponíveis: priorizar tarefas, ajustar agenda, criar lembretes.
  `,

  tasks: `
    Foco: organização e gestão de tarefas.
    Perguntas típicas: "Organize meu backlog", "Quais tarefas estão atrasadas?"
    Ações disponíveis: criar, atualizar, organizar, priorizar, agendar tarefas.
  `,

  finances: `
    Foco: análise financeira e sugestões de economia.
    Perguntas típicas: "Como foi mês passado?", "Onde posso economizar?"
    Ações disponíveis: consultar transações, categorizar, gerar relatórios.
    IMPORTANTE: Nunca sugira investimentos específicos. Seja prudente com conselhos financeiros.
  `,

  weekly_review: `
    Foco: reflexão estruturada da semana.
    Guie o usuário por: realizações, desafios, aprendizados, próxima semana.
    Tom: reflexivo, encorajador, honesto.
    Duração ideal: 15-20 minutos de conversa.
  `,
}
```

---

## INSIGHTS PROATIVOS

A IA gera insights automaticamente (jobs agendados):

```typescript
// ai/insights.ts

type InsightType =
  | 'overdue_tasks'         // tarefas atrasadas acumulando
  | 'goal_at_risk'          // objetivo em risco de não ser atingido
  | 'spending_spike'        // gasto acima do normal em categoria
  | 'habit_streak_at_risk'  // sequência de hábito em risco
  | 'busy_week_ahead'       // semana muito cheia pela frente
  | 'productivity_pattern'  // padrão identificado na produtividade
  | 'quick_win'             // tarefa rápida pendente há muito tempo

// Gerado 1x/dia, armazenado e exibido no dashboard
export async function generateDailyInsights(userId: string, workspaceId: string) {
  const context = await buildUserContext(userId, workspaceId, 'insights')

  const response = await claude.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 1000,
    system: INSIGHTS_SYSTEM_PROMPT,
    messages: [{
      role: 'user',
      content: `Analise o contexto e gere 3 insights relevantes para hoje.\n\n${context}`,
    }],
  })

  // Parse e salvar insights estruturados
  const insights = parseInsights(response.content[0].text)
  await saveInsights(userId, workspaceId, insights)
}
```

---

## RAG — BUSCA SOBRE DADOS DO USUÁRIO

Para perguntas como "O que decidimos na reunião sobre o projeto X?":

```typescript
// ai/rag.ts

export async function searchUserContent(
  workspaceId: string,
  query: string,
  types: ItemType[] = ['NOTE', 'DOCUMENT', 'EVENT']
): Promise<SearchResult[]> {
  const queryEmbedding = await generateEmbedding(query)

  // Busca semântica em notas, documentos e reuniões
  const results = await db.$queryRaw`
    SELECT
      'note' as type,
      id,
      title,
      substring(content, 1, 300) as excerpt,
      (embedding <=> ${queryEmbedding}::vector) AS score
    FROM notes
    WHERE workspace_id = ${workspaceId}
    UNION ALL
    SELECT 'document', id, title, substring(content::text, 1, 300), ...
    ORDER BY score
    LIMIT 10
  `

  return results
}
```

---

## STREAMING DE RESPOSTAS

Todas as respostas da IA para o usuário usam streaming para UX instantânea:

```typescript
// app/api/ai/stream/route.ts

export async function POST(request: Request) {
  const { message, module, conversationId } = await request.json()
  const session = await auth()

  const context = await buildUserContext(
    session.user.id,
    session.user.workspaceId,
    module
  )

  const stream = await claude.messages.stream({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: buildSystemPrompt(context, module),
    messages: await getConversationHistory(conversationId),
  })

  // Retornar como Server-Sent Events
  return new Response(
    new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type === 'content_block_delta') {
            controller.enqueue(
              `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            )
          }
        }
        controller.close()
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } }
  )
}
```

---

## LIMITES E CUSTOS

### Rate Limits por Plano

```
FREE:         10 mensagens/dia, sem insights proativos
PRO:          200 mensagens/dia, insights diários
TEAM:         Ilimitado, insights em tempo real
ENTERPRISE:   Custom
```

### Otimização de Custos

- Cache de respostas similares no Redis (24h, hash do input)
- Usar claude-sonnet-4-6 por padrão, claude-opus-4-8 apenas quando necessário
- Limitar contexto injetado a 8k tokens máximo
- Comprimir histórico de conversas antigas

---

*Versão: 1.0 | Criado: 2026-06-26*
