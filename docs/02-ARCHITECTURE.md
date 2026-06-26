# ARQUITETURA TÉCNICA — LIFE OS

> Documento de referência para todas as decisões de arquitetura. Qualquer desvio deve ser justificado e documentado.

---

## VISÃO GERAL

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENTES                          │
│   Next.js Web App      iOS App       Android App         │
│   (App Router)         (futuro)      (futuro)            │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTPS / WebSocket
┌──────────────────────────▼──────────────────────────────┐
│                    EDGE / CDN (Vercel)                    │
│              Middleware, Auth, Rate Limiting              │
└──────────────────────────┬──────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼──────┐  ┌────────▼───────┐  ┌──────▼───────┐
│ Server       │  │ API Routes     │  │ WebSocket    │
│ Actions      │  │ (webhooks,     │  │ Server       │
│ (mutations)  │  │  OAuth, AI)    │  │ (realtime)   │
└───────┬──────┘  └────────┬───────┘  └──────┬───────┘
        │                  │                  │
┌───────▼──────────────────▼──────────────────▼───────┐
│                   SERVIÇOS INTERNOS                   │
│  ┌────────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ PostgreSQL  │  │  Redis   │  │  BullMQ (Queue)  │  │
│  │ (Supabase)  │  │ (Cache)  │  │  (Jobs assínc.)  │  │
│  └────────────┘  └──────────┘  └──────────────────┘  │
└──────────────────────────────────────────────────────┘
        │
┌───────▼──────────────────────────────────────────────┐
│                   SERVIÇOS EXTERNOS                   │
│  Google  │  WhatsApp  │  Stripe  │  OpenAI  │  etc.  │
└──────────────────────────────────────────────────────┘
```

---

## CAMADAS DA APLICAÇÃO

### 1. Apresentação (Frontend)

**Responsabilidade:** Renderização, estado local, interação do usuário.

```
app/
├── (auth)/                 # Layout sem sidebar
│   ├── login/
│   ├── signup/
│   └── onboarding/
└── (dashboard)/            # Layout com sidebar
    ├── layout.tsx           # Sidebar + Command Bar + providers
    ├── hoje/
    ├── tarefas/
    ├── projetos/
    ├── agenda/
    └── [módulo]/
```

**Regras:**
- Componentes de página são Server Components por padrão
- Usar `'use client'` apenas quando necessário (interatividade, estado)
- Dados iniciais via Server Components (sem loading flash)
- Mutações via Server Actions (não fetch direto no client)

### 2. Ações de Servidor (Server Actions)

**Responsabilidade:** Mutações, validação, lógica de negócio simples.

```
server/actions/
├── tasks.ts
├── projects.ts
├── auth.ts
└── [módulo].ts
```

**Padrão de uma Server Action:**

```typescript
'use server'

import { z } from 'zod'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const CreateTaskSchema = z.object({
  title: z.string().min(1).max(500),
  projectId: z.string().cuid().optional(),
  dueDate: z.date().optional(),
})

export async function createTask(input: z.infer<typeof CreateTaskSchema>) {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')

  const data = CreateTaskSchema.parse(input)

  const task = await db.task.create({
    data: {
      ...data,
      workspaceId: session.user.workspaceId,
      userId: session.user.id,
    },
  })

  revalidatePath('/tarefas')
  return task
}
```

### 3. Queries (Server-side data fetching)

**Responsabilidade:** Leitura de dados, sempre no servidor.

```
server/queries/
├── tasks.ts
├── projects.ts
└── [módulo].ts
```

**Padrão:**

```typescript
import { db } from '@/lib/db'
import { auth } from '@/lib/auth'
import { cache } from 'react'

// cache() = deduplicação automática no mesmo request
export const getTasks = cache(async (filter?: TaskFilter) => {
  const session = await auth()
  if (!session) return []

  return db.task.findMany({
    where: {
      workspaceId: session.user.workspaceId,
      ...buildFilter(filter),
    },
    orderBy: { createdAt: 'desc' },
    include: { project: true, assignee: true },
  })
})
```

### 4. Serviços (Business Logic)

**Responsabilidade:** Lógica complexa, orquestração entre módulos.

```
services/
├── task.service.ts
├── ai.service.ts
├── notification.service.ts
└── automation.service.ts
```

### 5. Integrações

**Responsabilidade:** Comunicação com APIs externas.

```
integrations/
├── google/
│   ├── calendar.ts
│   └── gmail.ts
├── whatsapp/
├── stripe/
└── [serviço]/
```

---

## MULTI-TENANCY

### Modelo de Isolamento

Usamos **Row-Level Isolation** — todos os dados compartilham o mesmo banco, isolados por `workspaceId`.

```
User (1) → (N) WorkspaceMember → (1) Workspace
Workspace (1) → (N) [todos os recursos]
```

### Regra de Ouro

**Todo recurso do sistema tem `workspaceId`.** Sem exceção.

```typescript
// ✅ Correto
await db.task.findMany({
  where: { workspaceId: session.workspaceId }
})

// ❌ Nunca — vaza dados entre workspaces
await db.task.findMany()
```

### Middleware de Segurança

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const session = await getSession(request)

  // Toda rota /app/* requer autenticação
  if (!session && request.nextUrl.pathname.startsWith('/app')) {
    return NextResponse.redirect('/login')
  }

  // Injetar workspaceId no header para uso downstream
  const response = NextResponse.next()
  response.headers.set('x-workspace-id', session?.workspaceId ?? '')
  return response
}
```

---

## ESTADO DA APLICAÇÃO

### Hierarquia de Estado

```
Server State (fonte da verdade)
  ↓ hidratado para →
TanStack Query Cache (sincronização client-side)
  ↓ derivado para →
Zustand (UI state: sidebar aberta, modal ativo, seleções)
  ↓ local para →
useState (estado de componente isolado)
```

### Regras

- **Dados do banco** → TanStack Query (não Zustand)
- **UI state** (modal aberto, tema, sidebar) → Zustand
- **Form state** → React Hook Form (local)
- **URL state** (filtros, busca, tab ativa) → `useSearchParams`

---

## CACHE STRATEGY

### Camadas de Cache

```
1. React cache()          → deduplicação por request (servidor)
2. Next.js fetch cache    → cache de API routes externas
3. TanStack Query         → cache client-side com stale-while-revalidate
4. Redis                  → cache de dados caros (relatórios, AI responses)
```

### TTLs Padrão

```
Dados em tempo real (tarefas, mensagens):  sem cache ou stale: 30s
Dados semi-estáticos (projetos, contatos): stale: 5 min
Dados estáticos (configurações, planos):   stale: 1 hora
Respostas de IA:                           Redis 24h (por input hash)
```

---

## API DESIGN

### Convenções de Server Actions

- Nome começa com verbo: `createTask`, `updateProject`, `deleteNote`
- Retornam o recurso criado/atualizado em sucesso
- Lançam erros tipados em falha
- Sempre validam com Zod
- Sempre verificam autenticação e autorização

### Convenções de API Routes

Usar apenas para:
- Webhooks de terceiros (`/api/webhooks/stripe`)
- OAuth callbacks (`/api/auth/[...]`)
- Endpoints de IA com streaming (`/api/ai/stream`)
- Upload de arquivos

---

## FILAS E JOBS ASSÍNCRONOS

### Quando usar filas (BullMQ)

- Envio de emails e notificações
- Sincronização com APIs externas (Google Calendar, etc.)
- Processamento de IA (embeddings, sumarizações longas)
- Geração de relatórios
- Automações disparadas por eventos

### Estrutura

```
server/jobs/
├── queues.ts              # definição das filas
├── processors/
│   ├── email.processor.ts
│   ├── sync.processor.ts
│   ├── ai.processor.ts
│   └── automation.processor.ts
└── schedulers/
    └── weekly-review.scheduler.ts
```

---

## WEBSOCKETS E REALTIME

### Eventos Realtime

```
workspace:[id]:task:created
workspace:[id]:task:updated
workspace:[id]:task:deleted
workspace:[id]:notification:new
workspace:[id]:presence:[userId]
```

### Casos de uso

- Notificações em tempo real
- Indicadores de presença (quem está online)
- Atualizações colaborativas (futuro)
- Progresso de jobs longos (sync, AI)

---

## SEGURANÇA

### Autenticação (Better Auth)

- Session-based com JWT como fallback
- Refresh token rotation
- Multi-device support
- OAuth: Google, GitHub, Apple (futuro)

### Autorização

```typescript
// Roles por workspace
type WorkspaceRole = 'owner' | 'admin' | 'member' | 'guest'

// Verificação de permissão
async function assertCan(
  userId: string,
  workspaceId: string,
  action: 'read' | 'write' | 'delete' | 'admin'
): Promise<void>
```

### Proteções Obrigatórias

- Rate limiting em todas as rotas públicas (Redis)
- Input validation com Zod em toda entrada
- Sanitização de HTML em campos de rich text
- CSRF protection (Next.js built-in)
- CSP headers configurados
- Logs de auditoria para ações sensíveis

---

## PERFORMANCE

### Core Web Vitals Alvo

```
LCP (Largest Contentful Paint):  < 1.2s
FID (First Input Delay):         < 50ms
CLS (Cumulative Layout Shift):   < 0.05
TTFB (Time to First Byte):       < 200ms
```

### Estratégias

- **Server Components** para eliminar JS desnecessário no cliente
- **Streaming** com Suspense para carregamento progressivo
- **Prefetching** de rotas prováveis
- **Virtualização** de listas longas (react-virtual)
- **Imagens otimizadas** via `next/image`
- **Fonts otimizadas** via `next/font`
- **Bundle splitting** automático por rota

---

## OBSERVABILIDADE

### Logs

```typescript
// Estrutura padrão de log
logger.info('task.created', {
  taskId: task.id,
  workspaceId: task.workspaceId,
  userId: session.user.id,
  duration: Date.now() - startTime,
})
```

### Métricas a monitorar

- Latência de Server Actions (p50, p95, p99)
- Taxa de erro por módulo
- Uso de tokens de IA por workspace
- Jobs na fila (pendentes, falhos)
- Conexões WebSocket ativas
- Tamanho do banco por workspace

---

*Versão: 1.0 | Criado: 2026-06-26*
