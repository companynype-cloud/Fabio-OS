# ARQUITETURA DO CTO — LIFE OS

> Documento de decisão arquitetural completo. Nenhuma linha de código deve ser escrita antes deste documento ser aprovado. Cada decisão aqui tem justificativa técnica e de negócio.

---

## 1. ANÁLISE DO PROJETO

### O que estamos realmente construindo

O Life OS não é um app de tarefas com features extras. É uma **plataforma de dados pessoais com inteligência contextual**. A distinção importa porque muda a arquitetura:

- Apps de produtividade armazenam dados estruturados
- O Life OS armazena dados E as relações entre eles E o contexto temporal
- A IA não é uma feature — é a camada de acesso inteligente a esses dados

Isso significa que as decisões mais críticas são:
1. **Como os dados se relacionam** (grafo de conexões)
2. **Como a IA acessa contexto** (embeddings + RAG)
3. **Como o sistema escala** (multi-tenancy desde o dia 1)

### Análise de Complexidade por Módulo

```
ALTA COMPLEXIDADE (cuidado na implementação)
├── Sistema de Relações (grafo entre itens)
├── IA + Memórias (embeddings, RAG, contexto)
├── Integrações externas (Google, WhatsApp, Open Finance)
├── Motor de Automações (engine de regras)
└── Agenda com recorrência (RRULE é notoriamente complexo)

MÉDIA COMPLEXIDADE
├── Tarefas (simples, mas subtarefas e filtros complicam)
├── Editor de Notas/Documentos (Tiptap tem particularidades)
├── Hábitos (streaks, estatísticas, gamificação)
├── Finanças (categorização, relatórios, Open Finance)
└── Realtime (WebSockets em produção não é trivial)

BAIXA COMPLEXIDADE
├── Autenticação (Better Auth resolve)
├── Projetos (CRUD com milestones)
├── Diário (editor simples + mood)
├── Objetivos (CRUD + check-ins)
└── Conquistas (regras simples de trigger)
```

### Riscos Identificados (detalhados na seção 12)

1. Editor rich-text (Tiptap) tem curva de aprendizado
2. pgvector em Supabase precisa de configuração manual
3. WhatsApp Business API tem restrições severas
4. Automações podem criar loops infinitos
5. Custo de IA pode escalar descontroladamente

---

## 2. ARQUITETURA PROPOSTA

### Visão Macro

```
┌─────────────────────────────────────────────────────────────────┐
│                     LIFE OS — CAMADAS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  PRESENTATION LAYER                       │   │
│  │  Next.js 15 App Router + React 19 + Tailwind + shadcn   │   │
│  │  Server Components (padrão) │ Client Components (UI)    │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                             │                                     │
│  ┌──────────────────────────▼────────────────────────────────┐   │
│  │                  APPLICATION LAYER                        │   │
│  │   Server Actions (mutations) │ Route Handlers (webhooks) │   │
│  │   Zod validation │ Auth checks │ Rate limiting            │   │
│  └─────────────────────────┬────────────────────────────────┘   │
│                             │                                     │
│  ┌──────────────────────────▼────────────────────────────────┐   │
│  │                   DOMAIN LAYER                            │   │
│  │   Services │ Domain Rules │ Event Bus │ Automations       │   │
│  └──────┬──────────────────┬───────────────────┬────────────┘   │
│         │                  │                   │                  │
│  ┌──────▼──────┐  ┌────────▼──────┐  ┌────────▼────────┐       │
│  │  DATA LAYER │  │  AI LAYER     │  │  INTEGRATION    │       │
│  │  PostgreSQL │  │  Claude       │  │  LAYER          │       │
│  │  Prisma     │  │  Embeddings   │  │  Google         │       │
│  │  Redis      │  │  pgvector     │  │  WhatsApp       │       │
│  │  BullMQ     │  │  RAG          │  │  Stripe         │       │
│  └─────────────┘  └───────────────┘  └─────────────────┘       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Princípio Arquitetural Central

**Event-Driven Domain** com grafo de relações:

Toda ação no sistema emite um evento. Eventos podem:
1. Disparar automações
2. Atualizar memórias de IA
3. Criar relações entre itens
4. Notificar em tempo real
5. Gerar insights proativos

```typescript
// Exemplo: usuário completa uma tarefa
TaskCompleted → {
  → Notificar assignees (realtime)
  → Atualizar progresso do projeto
  → Verificar se objetivo foi atingido
  → Verificar trigger de automações
  → Registrar em memória da IA ("usuário completou X às 14h")
  → Verificar conquistas desbloqueadas
}
```

---

## 3. ESTRUTURA DE PASTAS

```
life-os/
├── src/
│   │
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Grupo: rotas sem sidebar
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── onboarding/
│   │   ├── (workspace)/              # Grupo: rotas com layout principal
│   │   │   ├── layout.tsx            # Root layout: sidebar + providers
│   │   │   ├── hoje/
│   │   │   ├── tarefas/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   ├── projetos/
│   │   │   ├── agenda/
│   │   │   ├── notas/
│   │   │   ├── habitos/
│   │   │   ├── financas/
│   │   │   ├── objetivos/
│   │   │   ├── ia/
│   │   │   └── configuracoes/
│   │   └── api/
│   │       ├── auth/[...all]/        # Better Auth handler
│   │       ├── webhooks/
│   │       │   ├── stripe/
│   │       │   ├── google/
│   │       │   └── whatsapp/
│   │       └── ai/
│   │           └── stream/           # SSE streaming endpoint
│   │
│   ├── components/                   # Componentes compartilhados
│   │   ├── ui/                       # shadcn/ui (não editar)
│   │   ├── layout/                   # Sidebar, TopBar, CommandBar
│   │   │   ├── sidebar.tsx
│   │   │   ├── command-bar.tsx
│   │   │   └── nav-item.tsx
│   │   └── shared/                   # Componentes do sistema
│   │       ├── item-card.tsx         # Card genérico reutilizável
│   │       ├── empty-state.tsx
│   │       ├── date-picker.tsx
│   │       ├── priority-badge.tsx
│   │       ├── user-avatar.tsx
│   │       ├── rich-text-editor.tsx  # Wrapper do Tiptap
│   │       └── ai-chat-panel.tsx     # Panel de IA contextual
│   │
│   ├── modules/                      # Um diretório por módulo
│   │   ├── tasks/
│   │   │   ├── components/           # Componentes específicos
│   │   │   │   ├── task-list.tsx
│   │   │   │   ├── task-item.tsx
│   │   │   │   ├── task-form.tsx
│   │   │   │   └── task-filters.tsx
│   │   │   ├── hooks/                # Hooks específicos do módulo
│   │   │   │   └── use-tasks.ts
│   │   │   └── types.ts              # Types locais do módulo
│   │   ├── projects/
│   │   ├── agenda/
│   │   ├── notes/
│   │   ├── habits/
│   │   ├── diary/
│   │   ├── finances/
│   │   ├── goals/
│   │   ├── meetings/
│   │   └── ai/
│   │
│   ├── server/                       # Código exclusivo de servidor
│   │   ├── actions/                  # Server Actions (mutations)
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   ├── notes.ts
│   │   │   ├── habits.ts
│   │   │   ├── finances.ts
│   │   │   └── ai.ts
│   │   ├── queries/                  # Queries Prisma reutilizáveis
│   │   │   ├── tasks.ts
│   │   │   ├── projects.ts
│   │   │   └── dashboard.ts
│   │   └── jobs/                     # BullMQ processors
│   │       ├── queues.ts
│   │       ├── processors/
│   │       │   ├── ai.processor.ts
│   │       │   ├── sync.processor.ts
│   │       │   └── notification.processor.ts
│   │       └── schedulers/
│   │           └── daily-insights.ts
│   │
│   ├── lib/                          # Utilitários e configurações
│   │   ├── db.ts                     # Prisma client singleton
│   │   ├── redis.ts                  # Redis client
│   │   ├── auth.ts                   # Better Auth config
│   │   ├── env.ts                    # Zod env validation
│   │   ├── utils.ts                  # cn(), formatters, helpers
│   │   └── constants.ts
│   │
│   ├── hooks/                        # Hooks React globais
│   │   ├── use-workspace.ts
│   │   ├── use-command-bar.ts
│   │   ├── use-keyboard-shortcuts.ts
│   │   └── use-realtime.ts
│   │
│   ├── stores/                       # Zustand stores
│   │   ├── ui.store.ts               # sidebar, modais, tema
│   │   ├── command-bar.store.ts
│   │   └── workspace.store.ts
│   │
│   ├── services/                     # Lógica de domínio
│   │   ├── task.service.ts
│   │   ├── automation.service.ts
│   │   ├── notification.service.ts
│   │   └── event-bus.ts              # Pub/sub interno
│   │
│   ├── ai/                           # Sistema de IA
│   │   ├── client.ts                 # Anthropic + OpenAI config
│   │   ├── memory.ts                 # Sistema de memórias
│   │   ├── context.ts                # Construção de contexto
│   │   ├── embeddings.ts             # Geração e busca vetorial
│   │   ├── rag.ts                    # Retrieval-augmented generation
│   │   ├── prompts/                  # Prompts por módulo
│   │   │   ├── base.ts
│   │   │   ├── tasks.ts
│   │   │   ├── finance.ts
│   │   │   └── weekly-review.ts
│   │   └── agents/                   # Agentes especializados
│   │       ├── tasks.agent.ts
│   │       ├── meeting.agent.ts
│   │       └── finance.agent.ts
│   │
│   ├── integrations/                 # Conectores externos
│   │   ├── google/
│   │   │   ├── calendar.ts
│   │   │   └── gmail.ts
│   │   ├── whatsapp/
│   │   ├── stripe/
│   │   └── open-finance/
│   │
│   └── types/                        # TypeScript global types
│       ├── index.ts
│       ├── api.ts
│       └── database.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Convenção de Nomenclatura

```
Arquivos:         kebab-case           task-list.tsx
Componentes:      PascalCase           TaskList
Hooks:            camelCase + use      useTasks
Stores:           camelCase + Store    uiStore
Server Actions:   camelCase verbo      createTask, updateProject
Types/Interfaces: PascalCase           TaskWithProject
Enums:            PascalCase           TaskStatus.TODO
Constantes:       SCREAMING_SNAKE      MAX_TASKS_PER_PAGE
```

---

## 4. CONVENÇÕES DE CÓDIGO

### Hierarquia de Imports

```typescript
// 1. React e Next.js
import { cache } from 'react'
import { notFound } from 'next/navigation'

// 2. Bibliotecas externas
import { z } from 'zod'
import { format } from 'date-fns'

// 3. Internos — lib e config
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

// 4. Internos — server
import { getTasks } from '@/server/queries/tasks'

// 5. Internos — componentes
import { TaskList } from '@/modules/tasks/components/task-list'

// 6. Types (sempre por último)
import type { Task } from '@/types'
```

### Padrão de Server Action

```typescript
'use server'

// 1. Schema de validação
const Schema = z.object({ ... })

export async function actionName(input: z.infer<typeof Schema>) {
  // 2. Autenticação SEMPRE primeiro
  const session = await auth()
  if (!session) throw new Error('UNAUTHORIZED')

  // 3. Validação de input
  const data = Schema.parse(input)

  // 4. Autorização (workspace ownership)
  await assertWorkspaceAccess(session.user.workspaceId, ...)

  // 5. Lógica de negócio
  const result = await db.[model].create({ ... })

  // 6. Revalidação de cache
  revalidatePath('/[rota]')

  // 7. Retornar dado atualizado SEMPRE
  return result
}
```

### Padrão de Query (Server Component)

```typescript
// Sempre usar cache() para deduplicação por request
export const getTasksForToday = cache(async (workspaceId: string) => {
  return db.task.findMany({
    where: {
      workspaceId,  // ← SEMPRE filtrar por workspace
      scheduledAt: { gte: startOfDay(new Date()), lte: endOfDay(new Date()) },
      deletedAt: null,
    },
    include: { project: { select: { id: true, name: true, color: true } } },
    orderBy: [{ priority: 'desc' }, { sortOrder: 'asc' }],
  })
})
```

### Padrão de Componente

```typescript
// Server Component (padrão)
// Nunca 'use client' sem necessidade real

interface Props {
  workspaceId: string
  filter?: TaskFilter
}

export async function TaskList({ workspaceId, filter }: Props) {
  const tasks = await getTasks(workspaceId, filter)
  return <ul>...</ul>
}
```

---

## 5. MÓDULOS — DEFINIÇÃO COMPLETA

### Hierarquia e Dependências

```
FUNDAÇÃO (sem dependências)
├── Auth / Users
├── Workspaces
└── Settings

NÚCLEO (depende só da Fundação)
├── Tasks          ← âncora do sistema
├── Projects       ← agrupa Tasks
└── Notes          ← conhecimento livre

EXTENSÕES (depende do Núcleo)
├── Agenda         ← Tasks + Events
├── Habits         ← Tasks recorrentes simplificadas
├── Diary          ← Notes especializadas
├── Goals          ← Projects de vida
└── Meetings       ← Events + Notes + Tasks

ESPECIALISTAS (depende das Extensões)
├── Finances       ← standalone com conexões
├── Health         ← Habits especializados
└── Achievements   ← deriva de tudo

INTELIGÊNCIA (depende de tudo)
├── AI Assistant   ← acessa todos os módulos
├── Memories       ← persiste contexto
├── Insights       ← analisa padrões
└── Automations    ← reage a eventos de todos
```

### Contrato de Módulo

Todo módulo deve expor:
```typescript
// modules/[nome]/index.ts
export { ComponentePrincipal } from './components/[nome]-list'
export { useModulo } from './hooks/use-[nome]'
export type { Tipo } from './types'
```

---

## 6. ESTRATÉGIA DE ESTADO

### Princípio: Estado no Lugar Certo

```
Servidor (fonte da verdade)
  └── PostgreSQL / Prisma

Cache de Servidor
  └── React cache() — deduplicação por request
  └── Redis — dados caros, respostas de IA

Cache de Cliente (sincronização)
  └── TanStack Query — hydration de Server Components
      Usado APENAS quando componente precisa de:
      - Refetch automático (polling)
      - Mutations otimistas
      - Paginação / scroll infinito

Estado Global de UI
  └── Zustand
      Usado para:
      - sidebar aberta/colapsada
      - modal ativo
      - command bar estado
      - seleções múltiplas em listas
      - tema

Estado de URL (sincronizado com browser)
  └── useSearchParams / nuqs
      Usado para:
      - Filtros de lista (status, prioridade, data)
      - Tab ativa
      - Busca
      - Item selecionado (para deep link)

Estado Local de Componente
  └── useState / useReducer
      Apenas para:
      - Estado de formulário (React Hook Form)
      - Toggle local (accordion, tooltip)
      - Hover state quando CSS não resolve
```

### Stores Zustand (estrutura)

```typescript
// stores/ui.store.ts
interface UIStore {
  sidebarCollapsed: boolean
  activeModal: string | null
  setSidebarCollapsed: (v: boolean) => void
  openModal: (id: string) => void
  closeModal: () => void
}

// stores/workspace.store.ts
interface WorkspaceStore {
  workspaceId: string
  plan: Plan
  features: FeatureFlag[]
  hasFeature: (feature: string) => boolean
}

// stores/command-bar.store.ts
interface CommandBarStore {
  open: boolean
  query: string
  context: string | null  // módulo ativo para contextualizar sugestões
  setOpen: (v: boolean) => void
  setQuery: (q: string) => void
}
```

---

## 7. ESTRATÉGIA DE AUTENTICAÇÃO

### Stack: Better Auth + PostgreSQL

**Por que Better Auth** (e não NextAuth/Clerk):
- Open source, sem vendor lock-in
- Multi-tenant nativo
- Session + JWT híbrido
- Suporte a organizations/workspaces built-in
- Self-hosted, custo zero

### Fluxo de Autenticação

```
1. Signup
   Email/Senha → criar User → criar Workspace pessoal → Onboarding

2. Login
   Credenciais → Session criada → workspaceId injetado na session
   OAuth (Google) → mesmo fluxo, Account vinculada ao User

3. Session
   Cookie httpOnly (15 min) + Refresh Token (30 dias)
   Session armazenada no Redis (revogação instantânea)
   workspaceId e role disponíveis sem query ao banco

4. Multi-workspace (futuro)
   User pode ter múltiplos workspaces
   Workspace switcher na sidebar
   Session contém activeWorkspaceId
```

### Estrutura da Session

```typescript
interface Session {
  user: {
    id: string
    email: string
    name: string
    avatarUrl: string | null
  }
  workspace: {
    id: string
    slug: string
    plan: Plan
    role: WorkspaceRole
  }
  expiresAt: Date
}
```

### Proteção de Rotas

```typescript
// middleware.ts — intercepta TODAS as rotas /app/*
export async function middleware(request: NextRequest) {
  const session = await getSession(request)

  // Rotas protegidas
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Injetar contexto no header para Server Components
  const headers = new Headers(request.headers)
  headers.set('x-workspace-id', session?.workspace.id ?? '')
  headers.set('x-user-id', session?.user.id ?? '')
  headers.set('x-workspace-role', session?.workspace.role ?? '')

  return NextResponse.next({ request: { headers } })
}
```

---

## 8. ESTRATÉGIA DE PERMISSÕES

### Modelo: RBAC por Workspace

```
WorkspaceRole
├── OWNER    — criador, acesso total, billing, deletar workspace
├── ADMIN    — acesso total exceto billing e deletar workspace
├── MEMBER   — acesso a todos os módulos, não pode gerenciar membros
└── GUEST    — leitura apenas, acesso a projetos específicos
```

### Verificação de Permissões

```typescript
// lib/permissions.ts

type Action = 'read' | 'write' | 'delete' | 'manage_members' | 'manage_billing'

const ROLE_PERMISSIONS: Record<WorkspaceRole, Action[]> = {
  OWNER:  ['read', 'write', 'delete', 'manage_members', 'manage_billing'],
  ADMIN:  ['read', 'write', 'delete', 'manage_members'],
  MEMBER: ['read', 'write'],
  GUEST:  ['read'],
}

export function can(role: WorkspaceRole, action: Action): boolean {
  return ROLE_PERMISSIONS[role].includes(action)
}

// Em Server Actions:
export async function deleteProject(projectId: string) {
  const session = await auth()
  if (!can(session.workspace.role, 'delete')) {
    throw new Error('FORBIDDEN')
  }
  // ...
}
```

### Isolamento Multi-Tenant

Regra absoluta: **todo query ao banco filtra por `workspaceId`**.

Para garantir isso sem depender de disciplina individual, criar um wrapper:

```typescript
// lib/db.ts

// Client com Row Level Security embutido
export function getDb(workspaceId: string) {
  return db.$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, workspaceId }
          return query(args)
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, workspaceId }
          return query(args)
        },
      }
    }
  })
}

// Uso em Server Actions:
const db = getDb(session.workspace.id)
// Agora IMPOSSÍVEL vazar dados entre workspaces
```

---

## 9. ESTRATÉGIA DE BANCO DE DADOS

### Decisões de Schema

**PostgreSQL + Prisma + Supabase**

Por que PostgreSQL:
- pgvector para embeddings de IA (nativo, sem serviço extra)
- JSONB para dados semi-estruturados (metadata, config)
- Full-text search nativo (sem Elasticsearch para MVP)
- Row Level Security como camada extra de segurança

### Padrões Obrigatórios

```prisma
model QualquerRecurso {
  id          String    @id @default(cuid())   // ← cuid, não uuid (mais curto, legível)
  workspaceId String                            // ← SEMPRE presente
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?                         // ← soft delete SEMPRE
}
```

### Estratégia de Indexação

```sql
-- Índice padrão em todo recurso
(workspaceId, deletedAt)          -- base de toda query
(workspaceId, createdAt DESC)     -- listagem padrão
(workspaceId, [campo_filtro])     -- para cada filtro comum

-- Índices específicos críticos
tasks: (workspaceId, status, dueDate)     -- dashboard do dia
tasks: (workspaceId, assigneeId)          -- "minhas tarefas"
tasks: GIN(title) para full-text search
ai_memories: ivfflat (embedding)          -- busca vetorial
```

### Estratégia de Migrations

```
Regras:
1. NUNCA deletar coluna em produção sem período de deprecação
2. Sempre adicionar campos como nullable primeiro, backfill depois, NOT NULL
3. Índices com CONCURRENTLY em produção para não bloquear tabela
4. Toda migration tem rollback documentado
5. Testar migration em Supabase branch antes de aplicar em produção
```

### Dados Sensíveis

```typescript
// Campos que precisam de criptografia em repouso
Integration.credentials  // tokens OAuth — encrypt com AES-256
User.email               // PII — Supabase já cuida
// NÃO armazenar: CPF, cartão, senha (apenas hash)
```

### Estratégia de Dados Vetoriais (IA)

```sql
-- Extensão pgvector no Supabase
CREATE EXTENSION vector;

-- Índice para busca semântica
CREATE INDEX ai_memories_embedding_idx
ON ai_memories
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);  -- ajustar conforme volume
```

---

## 10. ESTRATÉGIA DE INTEGRAÇÕES

### Princípio: Adaptador por Integração

Cada integração é um adaptador que converte dados externos para o modelo interno do Life OS:

```typescript
interface Integration<ExternalItem, InternalItem> {
  sync(): Promise<void>
  toInternal(external: ExternalItem): InternalItem
  toExternal(internal: InternalItem): ExternalItem
  handleWebhook(payload: unknown): Promise<void>
}
```

### Mapa de Integrações

```
FASE 2 — Google Calendar
├── OAuth 2.0 flow
├── Sync bidirecional (Life OS ← → Google)
├── Webhook para mudanças em tempo real
├── Resolver conflitos: Life OS ganha por padrão
└── Sincronização a cada 15 min (BullMQ job)

FASE 2 — Gmail
├── OAuth 2.0 (mesmo token do Calendar)
├── Inbox somente leitura no Life OS
├── Action: email → tarefa (1 clique)
├── Webhook via Google Pub/Sub
└── Sem envio de email pelo Life OS (v1)

FASE 3 — WhatsApp Business
├── Meta Business API (não WhatsApp Web)
├── Receber mensagens → inbox no Life OS
├── Action: mensagem → tarefa / nota / ideia
├── Responder mensagens pelo Life OS
└── ALERTA: aprovação da Meta pode demorar semanas

FASE 3 — Open Finance (Pluggy)
├── Conectar contas bancárias via Open Finance
├── Importar transações automaticamente
├── Categorização por IA
├── Sem acesso a credenciais bancárias (padrão OFB)
└── Atualização diária via job

FASE 4 — Stripe
├── Billing do próprio Life OS SaaS
├── Webhooks: subscription criada/cancelada/renovada
├── Produtos: Free, Pro, Team, Enterprise
└── Customer Portal para self-service
```

### Armazenamento de Credenciais

```typescript
// NUNCA em texto puro no banco
// Usar criptografia simétrica AES-256
import { encrypt, decrypt } from '@/lib/crypto'

// Ao salvar
const encryptedCredentials = encrypt(JSON.stringify(tokens), env.ENCRYPTION_KEY)
await db.integration.update({ data: { credentials: encryptedCredentials } })

// Ao usar
const tokens = JSON.parse(decrypt(integration.credentials, env.ENCRYPTION_KEY))
```

---

## 11. ROADMAP EM SPRINTS

### Convenção de Sprint
- 1 sprint = 1 semana
- Cada sprint tem critério de aceite claro
- Nenhuma feature começa sem design aprovado

---

### SPRINT 0 — Fundação (Semana 1)
**Objetivo:** Stack funcionando, deploy em produção.

```
[ ] Criar projeto Next.js 15 com TypeScript strict
[ ] Configurar Tailwind + Apex Velocity design tokens
[ ] Instalar e configurar shadcn/ui
[ ] Configurar ESLint + Prettier + Husky
[ ] Configurar Prisma + Supabase (PostgreSQL)
[ ] Aplicar schema inicial (User, Workspace, Session)
[ ] Configurar Better Auth (email/senha + Google OAuth)
[ ] Configurar Redis (Upstash)
[ ] Deploy na Vercel com variáveis de ambiente
[ ] CI/CD básico (GitHub Actions: lint + type-check + build)
[ ] Configurar pgvector no Supabase
[ ] Documentar variáveis de ambiente no .env.example

Critério: app rodando em produção com /login funcionando
```

### SPRINT 1 — Shell do Produto (Semana 2)
**Objetivo:** Usuário consegue logar e ver a estrutura do app.

```
[ ] Tela de login (email/senha + Google)
[ ] Tela de signup
[ ] Fluxo de criação de workspace (nome + slug)
[ ] Onboarding (3 steps: nome, timezone, preferências básicas)
[ ] Layout principal: sidebar + main content
[ ] Sidebar com navegação entre módulos
[ ] Command Bar global (⌘K) — estrutura, sem buscas reais ainda
[ ] Atalhos de teclado base
[ ] Tema Apex Velocity aplicado globalmente
[ ] Perfil do usuário (editar nome, avatar)
[ ] Responsive: mobile bottom nav funcionando

Critério: usuário consegue logar, ver sidebar e navegar entre páginas
```

### SPRINT 2 — Tarefas (Semana 3)
**Objetivo:** Módulo de tarefas completo e utilizável.

```
[ ] CRUD completo de tarefas
[ ] Status: Inbox, Todo, Em Andamento, Feito, Cancelado
[ ] Prioridades com badge visual
[ ] Data de vencimento
[ ] Busca em tempo real (client-side)
[ ] Filtros: status, prioridade, data, projeto
[ ] Ordenação: manual, data, prioridade, criação
[ ] Subtarefas (1 nível)
[ ] Bulk actions (completar, priorizar, mover, deletar)
[ ] Keyboard navigation em listas (J/K + Enter)
[ ] Quick add via Command Bar
[ ] Animações de check (Framer Motion)

Critério: pode ser usado como gerenciador de tarefas diário
```

### SPRINT 3 — Dashboard Hoje + Projetos (Semana 4)
**Objetivo:** Visão do dia e agrupamento de tarefas.

```
Dashboard Hoje:
[ ] Tarefas do dia (scheduled + vencendo hoje)
[ ] Seção "Mais tarde" (sem data)
[ ] Progresso do dia (X de Y tarefas)
[ ] Quick capture (adicionar tarefa sem abrir módulo)
[ ] Eventos do dia (manual, sem integração)

Projetos:
[ ] CRUD de projetos (nome, cor, ícone, data alvo)
[ ] Associar tarefas a projetos
[ ] View de projeto: lista de tarefas + progresso
[ ] Milestones básicos

Critério: usuário consegue planejar e acompanhar seu dia
```

### SPRINT 4 — Notas + IA Base (Semana 5)
**Objetivo:** Sistema de conhecimento + primeiro contato com IA.

```
Notas:
[ ] Editor rich-text (Tiptap) — bold, italic, listas, títulos, links
[ ] CRUD de notas
[ ] Tags e busca
[ ] Pin de notas importantes
[ ] Conectar nota a tarefa ou projeto

IA Base:
[ ] Interface de chat com streaming (SSE)
[ ] Contexto do usuário injetado (tarefas, projetos)
[ ] IA pode criar tarefas via tool use
[ ] Histórico de conversas persistido
[ ] Botão "Perguntar à IA" em cada módulo
[ ] Rate limit por plano (Free: 10/dia, Pro: 200/dia)

Critério: usuário faz primeira conversa útil com a IA
```

### SPRINT 5 — Hábitos + Agenda (Semana 6)
**Objetivo:** Tracking de rotina e visualização temporal.

```
Hábitos:
[ ] CRUD de hábitos (diário, semanal, mensal)
[ ] Check-in diário
[ ] Streak counter
[ ] Calendário de histórico (grid estilo GitHub)
[ ] IA: análise de padrões de hábito

Agenda:
[ ] Calendário (vista dia, semana, mês)
[ ] CRUD de eventos
[ ] Tarefas com data aparecem no calendário
[ ] Drag & drop para reagendar

Critério: usuário usa para planejar rotina e semana
```

### SPRINT 6 — Finanças + Objetivos (Semana 7)
**Objetivo:** Módulos de crescimento pessoal.

```
Finanças:
[ ] CRUD de contas (corrente, poupança, cartão, investimento)
[ ] Lançamentos manuais (receita, despesa, transferência)
[ ] Categorias (personalizáveis)
[ ] Dashboard financeiro (saldo, gastos por categoria, evolução)
[ ] IA: análise de padrões de gasto

Objetivos:
[ ] CRUD de objetivos (OKR pessoal)
[ ] Progresso numérico (valor atual vs meta)
[ ] Check-ins periódicos
[ ] Conectar tarefas e projetos a objetivos
[ ] IA: "estou no caminho certo?"

Critério: usuário tem visibilidade financeira e de metas
```

### SPRINT 7 — Memórias IA + Revisão Semanal (Semana 8)
**Objetivo:** IA começa a realmente conhecer o usuário.

```
Memórias de IA:
[ ] Extração automática de memórias das conversas
[ ] Categorias: preferência, fato, objetivo, padrão
[ ] Embeddings vetoriais com pgvector
[ ] Busca semântica sobre memórias
[ ] UI para ver e editar memórias

Revisão Semanal:
[ ] Fluxo guiado (5 seções: realizações, desafios, aprendizados, foco, gratidão)
[ ] IA facilita com perguntas baseadas nos dados da semana
[ ] Histórico de revisões anteriores
[ ] Insights automáticos pós-revisão

Critério: IA responde perguntas usando contexto real do usuário
```

### SPRINT 8 — Polish + Performance (Semana 9)
**Objetivo:** Produto pronto para beta fechado.

```
[ ] Core Web Vitals: LCP < 1.2s, CLS < 0.05
[ ] Virtualização de listas longas (react-virtual)
[ ] Loading states em todos os módulos (Suspense)
[ ] Error boundaries em todos os módulos
[ ] Empty states com design final
[ ] Notificações in-app (realtime)
[ ] PWA: manifest, service worker básico
[ ] Onboarding revisado com dados reais
[ ] Testes E2E das jornadas críticas (Playwright)

Critério: produto estável para 50 beta users
```

### SPRINT 9+ — Integrações e Crescimento
**Sprints iterativos pós-beta**

```
Sprint 9:  Google Calendar (sincronização bidirecional)
Sprint 10: Gmail (inbox + email → tarefa)
Sprint 11: Billing Stripe (Free, Pro, Team)
Sprint 12: Reuniões (notas estruturadas + IA extrai tarefas)
Sprint 13: Diário + Saúde básica
Sprint 14: Open Finance (Pluggy)
Sprint 15: WhatsApp Business API
Sprint 16: Motor de Automações
Sprint 17: Mobile PWA otimizado
Sprint 18: API pública + webhooks
```

---

## 12. MVP — DEFINIÇÃO CLARA

### O que é o MVP do Life OS

**MVP = Sprints 0-4**

O MVP substitui **Todoist + Notion** para um usuário individual. Nada mais.

```
MVP inclui:
✅ Login + Workspace
✅ Tarefas completas (CRUD, filtros, subtarefas, bulk)
✅ Projetos (agrupamento de tarefas)
✅ Dashboard do Dia
✅ Notas com rich-text
✅ IA que cria tarefas e responde perguntas

MVP NÃO inclui:
❌ Google Calendar
❌ WhatsApp
❌ Finanças
❌ Hábitos
❌ Billing
❌ Colaboração entre usuários
❌ Mobile nativo
```

### Critério de MVP Concluído

> Usuário consegue abrir o app de manhã, ver o que tem para fazer hoje, capturar novas tarefas em menos de 5 segundos, organizar em projetos, tomar notas e perguntar à IA "o que devo priorizar agora?" com uma resposta útil baseada nos seus dados.

---

## 13. RISCOS TÉCNICOS

### Risco 1 — Editor Rich-Text (ALTO)
```
Problema: Tiptap tem curva de aprendizado alta.
          Colaboração em tempo real é outra ordem de complexidade.
Mitigação: Começar com Tiptap básico (sem colaboração).
           Colaboração só no roadmap de longo prazo.
           Avaliar BlockNote como alternativa mais simples.
```

### Risco 2 — Custo de IA (ALTO)
```
Problema: Claude Opus pode custar $15-75/milhão de tokens.
          Com muitos usuários, custo pode ser inviável.
Mitigação: Usar claude-sonnet-4-6 por padrão ($3/M tokens).
           Cache de respostas no Redis (hash do input).
           Hard limits por plano (10 msgs/dia no Free).
           Monitorar custo por workspace em dashboard de admin.
           Fallback: se custo > threshold, throttle automaticamente.
```

### Risco 3 — WhatsApp Business API (MÉDIO)
```
Problema: Meta exige aprovação que pode demorar 2-4 semanas.
          Restrições de mensagem template para envio ativo.
          Custo por conversa pode escalar.
Mitigação: Não comprometer timeline com WhatsApp.
           Iniciar aprovação cedo, mas não bloquear lançamento nela.
           Ter Telegram como alternativa mais fácil.
```

### Risco 4 — Automações e Loops (MÉDIO)
```
Problema: "Mensagem WhatsApp → Tarefa → Email → Tarefa"
          pode criar loops infinitos no motor de automações.
Mitigação: Limite de profundidade de automação (max 3 níveis).
           Debounce: mesma automação não roda 2x em 60s no mesmo item.
           Circuit breaker: desativar automação após 5 erros seguidos.
           Log completo para debugging.
```

### Risco 5 — Performance com Muitos Dados (MÉDIO)
```
Problema: Usuário com 10.000 tarefas e queries sem índice = timeout.
Mitigação: Índices definidos desde o primeiro migration.
           Paginação em todas as listagens (cursor-based, não offset).
           Virtualização de listas no frontend.
           Limite de 1000 itens por query no MVP.
```

### Risco 6 — pgvector em Escala (BAIXO-MÉDIO)
```
Problema: Busca vetorial com IVFFlat degrada com muitos vetores
          se o índice não for reotimizado.
Mitigação: Monitorar performance de queries vetoriais.
           VACUUM ANALYZE periódico na tabela ai_memories.
           Avaliar migração para Pinecone se volume justificar.
```

---

## 14. SUGESTÕES DE PRODUTO

### 1. "Modo Foco" — diferencial competitivo
Uma view do Dashboard que mostra apenas UMA tarefa por vez — a mais prioritária. Usuário pressiona `Espaço` para concluir e ver a próxima. Minimalismo máximo.

### 2. "Capture Rápido" como widget mobile
Ao abrir o app mobile, a primeira tela é um input. Digite qualquer coisa, pressione Enter, vai para Inbox. Zero atrito para capturar pensamentos.

### 3. Revisão Diária (além da semanal)
Um ritual de 2 minutos toda manhã: "O que aconteceu ontem? O que é prioridade hoje?" Guiado pela IA com base nos dados reais. Diferencial vs Sunsama.

### 4. "Life Score" na Home
Um índice calculado diariamente: 0-100. Combina tarefas concluídas, hábitos feitos, progresso de objetivos, saúde financeira. Não para pressionar — para dar contexto de como está a semana.

### 5. Modo Offline First
Usar IndexedDB + Service Worker para que o app funcione offline. Sincroniza quando volta a conexão. Crítico para mobile confiável.

### 6. Templates de Workspace
Ao criar conta, oferecer templates: "Freelancer", "Estudante", "Empreendedor", "Executivo". Pré-populam projetos, hábitos e objetivos relevantes. Reduz time-to-value drasticamente.

---

## CHECKLIST DE APROVAÇÃO

Antes de começar a codificar, este documento deve ter:

- [ ] Estrutura de pastas aprovada
- [ ] Convenções de código aprovadas
- [ ] Estratégia de estado aprovada
- [ ] Estratégia de autenticação aprovada
- [ ] Estratégia de permissões aprovada
- [ ] Schema de banco aprovado
- [ ] Estratégia de integrações aprovada
- [ ] Roadmap de sprints aprovado
- [ ] Definição de MVP aprovada
- [ ] Riscos revisados

**Após aprovação: iniciar Sprint 0.**

---

*Versão: 1.0 | Status: AGUARDANDO APROVAÇÃO | Criado: 2026-06-26*
