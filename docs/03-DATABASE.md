# ARQUITETURA DE BANCO DE DADOS — LIFE OS

> Schema canônico do sistema. Toda migration deve ser revisada contra este documento. Nunca quebre contratos existentes sem migração de dados.

---

## PRINCÍPIOS DO SCHEMA

1. **Todo recurso tem `workspaceId`** — isolamento multi-tenant absoluto
2. **Soft delete padrão** — `deletedAt` em vez de `DELETE` real
3. **Timestamps em tudo** — `createdAt`, `updatedAt` em toda tabela
4. **UUIDs como PKs** — `cuid()` para IDs legíveis e seguros
5. **Índices explícitos** — nunca deixar a performance para depois
6. **Constraints no banco** — não depender apenas da aplicação

---

## SCHEMA PRISMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================
// CORE — AUTENTICAÇÃO E WORKSPACE
// ============================================================

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  avatarUrl     String?
  timezone      String    @default("America/Sao_Paulo")
  locale        String    @default("pt-BR")
  onboardedAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  memberships   WorkspaceMember[]
  sessions      Session[]
  accounts      Account[]

  @@index([email])
  @@map("users")
}

model Workspace {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  logoUrl     String?
  plan        Plan      @default(FREE)
  trialEndsAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  members     WorkspaceMember[]
  tasks       Task[]
  projects    Project[]
  notes       Note[]
  documents   Document[]
  habits      Habit[]
  goals       Goal[]
  finances    Transaction[]
  integrations Integration[]
  automations Automation[]
  aiMemories  AiMemory[]

  @@index([slug])
  @@map("workspaces")
}

model WorkspaceMember {
  id          String          @id @default(cuid())
  workspaceId String
  userId      String
  role        WorkspaceRole   @default(MEMBER)
  joinedAt    DateTime        @default(now())

  workspace   Workspace       @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User            @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
  @@index([workspaceId])
  @@index([userId])
  @@map("workspace_members")
}

enum Plan {
  FREE
  PRO
  TEAM
  ENTERPRISE
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  GUEST
}

// ============================================================
// TAREFAS
// ============================================================

model Task {
  id            String       @id @default(cuid())
  workspaceId   String
  createdById   String
  assigneeId    String?
  projectId     String?
  parentId      String?      // subtarefas
  title         String
  description   String?      // markdown
  status        TaskStatus   @default(TODO)
  priority      Priority     @default(NONE)
  dueDate       DateTime?
  scheduledAt   DateTime?    // quando está na agenda
  completedAt   DateTime?
  archivedAt    DateTime?
  deletedAt     DateTime?
  sortOrder     Float        @default(0)
  tags          String[]
  metadata      Json?        // dados extras sem schema fixo
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  workspace     Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  project       Project?     @relation(fields: [projectId], references: [id])
  parent        Task?        @relation("subtasks", fields: [parentId], references: [id])
  subtasks      Task[]       @relation("subtasks")
  comments      Comment[]
  attachments   Attachment[]
  relations     ItemRelation[] @relation("sourceItem")

  @@index([workspaceId, status])
  @@index([workspaceId, assigneeId])
  @@index([workspaceId, dueDate])
  @@index([projectId])
  @@index([parentId])
  @@map("tasks")
}

enum TaskStatus {
  INBOX
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
  CANCELLED
}

enum Priority {
  NONE
  LOW
  MEDIUM
  HIGH
  URGENT
}

// ============================================================
// PROJETOS
// ============================================================

model Project {
  id            String        @id @default(cuid())
  workspaceId   String
  createdById   String
  name          String
  description   String?
  color         String?
  icon          String?
  status        ProjectStatus @default(ACTIVE)
  startDate     DateTime?
  targetDate    DateTime?
  completedAt   DateTime?
  archivedAt    DateTime?
  deletedAt     DateTime?
  sortOrder     Float         @default(0)
  metadata      Json?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  workspace     Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks         Task[]
  milestones    Milestone[]

  @@index([workspaceId, status])
  @@map("projects")
}

enum ProjectStatus {
  ACTIVE
  ON_HOLD
  COMPLETED
  CANCELLED
}

model Milestone {
  id          String    @id @default(cuid())
  projectId   String
  title       String
  targetDate  DateTime?
  completedAt DateTime?
  createdAt   DateTime  @default(now())

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@map("milestones")
}

// ============================================================
// AGENDA E REUNIÕES
// ============================================================

model Event {
  id              String      @id @default(cuid())
  workspaceId     String
  createdById     String
  title           String
  description     String?
  location        String?
  isAllDay        Boolean     @default(false)
  startsAt        DateTime
  endsAt          DateTime
  recurrenceRule  String?     // RRULE format
  externalId      String?     // ID no Google Calendar
  externalSource  String?     // "google_calendar"
  meetingNotes    String?     // markdown
  deletedAt       DateTime?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  attendees       EventAttendee[]
  tasks           Task[]

  @@index([workspaceId, startsAt])
  @@map("events")
}

model EventAttendee {
  id        String              @id @default(cuid())
  eventId   String
  userId    String?
  email     String
  name      String?
  status    AttendeeStatus      @default(PENDING)

  event     Event               @relation(fields: [eventId], references: [id], onDelete: Cascade)

  @@unique([eventId, email])
  @@map("event_attendees")
}

enum AttendeeStatus {
  PENDING
  ACCEPTED
  DECLINED
  TENTATIVE
}

// ============================================================
// NOTAS E DOCUMENTOS
// ============================================================

model Note {
  id          String    @id @default(cuid())
  workspaceId String
  createdById String
  title       String?
  content     String    // markdown ou JSON (Tiptap)
  isPinned    Boolean   @default(false)
  tags        String[]
  archivedAt  DateTime?
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  relations   ItemRelation[] @relation("sourceItem")

  @@index([workspaceId])
  @@index([workspaceId, createdById])
  @@map("notes")
}

model Document {
  id          String    @id @default(cuid())
  workspaceId String
  createdById String
  title       String
  content     String    // JSON (Tiptap/ProseMirror)
  icon        String?
  coverUrl    String?
  isPublic    Boolean   @default(false)
  publishedAt DateTime?
  archivedAt  DateTime?
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@index([workspaceId])
  @@map("documents")
}

// ============================================================
// HÁBITOS E DIÁRIO
// ============================================================

model Habit {
  id            String        @id @default(cuid())
  workspaceId   String
  createdById   String
  title         String
  description   String?
  icon          String?
  color         String?
  frequency     HabitFrequency @default(DAILY)
  targetCount   Int           @default(1)
  unit          String?
  reminderTime  String?       // "HH:MM"
  archivedAt    DateTime?
  deletedAt     DateTime?
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  workspace     Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  logs          HabitLog[]

  @@index([workspaceId, createdById])
  @@map("habits")
}

model HabitLog {
  id        String    @id @default(cuid())
  habitId   String
  date      DateTime  @db.Date
  count     Int       @default(1)
  note      String?
  createdAt DateTime  @default(now())

  habit     Habit     @relation(fields: [habitId], references: [id], onDelete: Cascade)

  @@unique([habitId, date])
  @@index([habitId])
  @@map("habit_logs")
}

enum HabitFrequency {
  DAILY
  WEEKLY
  MONTHLY
}

model DiaryEntry {
  id          String    @id @default(cuid())
  workspaceId String
  createdById String
  date        DateTime  @db.Date
  content     String    // markdown
  mood        Int?      // 1-5
  tags        String[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([workspaceId, createdById, date])
  @@index([workspaceId, createdById])
  @@map("diary_entries")
}

// ============================================================
// OBJETIVOS
// ============================================================

model Goal {
  id            String       @id @default(cuid())
  workspaceId   String
  createdById   String
  title         String
  description   String?
  type          GoalType     @default(PERSONAL)
  status        GoalStatus   @default(ACTIVE)
  targetDate    DateTime?
  targetValue   Float?
  currentValue  Float?
  unit          String?
  completedAt   DateTime?
  archivedAt    DateTime?
  deletedAt     DateTime?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  workspace     Workspace    @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  checkIns      GoalCheckIn[]

  @@index([workspaceId, createdById])
  @@map("goals")
}

model GoalCheckIn {
  id        String    @id @default(cuid())
  goalId    String
  value     Float?
  note      String?
  date      DateTime  @default(now())

  goal      Goal      @relation(fields: [goalId], references: [id], onDelete: Cascade)

  @@index([goalId])
  @@map("goal_check_ins")
}

enum GoalType {
  PERSONAL
  PROFESSIONAL
  FINANCIAL
  HEALTH
  LEARNING
}

enum GoalStatus {
  ACTIVE
  COMPLETED
  ABANDONED
  PAUSED
}

// ============================================================
// FINANÇAS
// ============================================================

model Account {
  id            String          @id @default(cuid())
  workspaceId   String
  name          String
  type          AccountType
  balance       Float           @default(0)
  currency      String          @default("BRL")
  externalId    String?
  externalSource String?
  color         String?
  icon          String?
  isActive      Boolean         @default(true)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  transactions  Transaction[]

  @@index([workspaceId])
  @@map("financial_accounts")
}

model Transaction {
  id            String              @id @default(cuid())
  workspaceId   String
  accountId     String
  categoryId    String?
  title         String
  amount        Float
  type          TransactionType
  date          DateTime
  notes         String?
  isRecurring   Boolean             @default(false)
  recurrenceRule String?
  externalId    String?
  createdAt     DateTime            @default(now())
  updatedAt     DateTime            @updatedAt

  workspace     Workspace           @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  account       Account             @relation(fields: [accountId], references: [id])
  category      TransactionCategory? @relation(fields: [categoryId], references: [id])

  @@index([workspaceId, date])
  @@index([accountId])
  @@map("transactions")
}

model TransactionCategory {
  id          String        @id @default(cuid())
  workspaceId String
  name        String
  icon        String?
  color       String?
  type        TransactionType
  createdAt   DateTime      @default(now())

  transactions Transaction[]

  @@index([workspaceId])
  @@map("transaction_categories")
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
  INVESTMENT
  CASH
  OTHER
}

enum TransactionType {
  INCOME
  EXPENSE
  TRANSFER
}

// ============================================================
// SISTEMA DE RELAÇÕES (grafo de conexões)
// ============================================================

model ItemRelation {
  id            String       @id @default(cuid())
  workspaceId   String
  sourceType    ItemType
  sourceId      String
  targetType    ItemType
  targetId      String
  relationType  RelationType @default(RELATED)
  createdAt     DateTime     @default(now())

  sourceTask    Task?        @relation("sourceItem", fields: [sourceId], references: [id], map: "task_source")
  sourceNote    Note?        @relation("sourceItem", fields: [sourceId], references: [id], map: "note_source")

  @@unique([sourceType, sourceId, targetType, targetId])
  @@index([workspaceId])
  @@index([sourceType, sourceId])
  @@index([targetType, targetId])
  @@map("item_relations")
}

enum ItemType {
  TASK
  PROJECT
  NOTE
  DOCUMENT
  EVENT
  GOAL
  HABIT
  TRANSACTION
}

enum RelationType {
  RELATED
  BLOCKS
  BLOCKED_BY
  DUPLICATES
  GENERATED_FROM
}

// ============================================================
// IA — MEMÓRIAS E CONTEXTO
// ============================================================

model AiMemory {
  id          String    @id @default(cuid())
  workspaceId String
  userId      String
  content     String
  category    String    // "preference", "fact", "goal", "pattern"
  importance  Int       @default(5) // 1-10
  embedding   Unsupported("vector(1536)")?
  expiresAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@index([workspaceId, userId])
  @@map("ai_memories")
}

model AiConversation {
  id          String        @id @default(cuid())
  workspaceId String
  userId      String
  context     String?       // módulo de origem
  createdAt   DateTime      @default(now())

  messages    AiMessage[]

  @@index([workspaceId, userId])
  @@map("ai_conversations")
}

model AiMessage {
  id             String         @id @default(cuid())
  conversationId String
  role           AiRole
  content        String
  toolCalls      Json?
  createdAt      DateTime       @default(now())

  conversation   AiConversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@map("ai_messages")
}

enum AiRole {
  USER
  ASSISTANT
  TOOL
}

// ============================================================
// INTEGRAÇÕES E AUTOMAÇÕES
// ============================================================

model Integration {
  id           String            @id @default(cuid())
  workspaceId  String
  type         IntegrationType
  status       IntegrationStatus @default(ACTIVE)
  credentials  Json              // criptografado
  config       Json?
  lastSyncedAt DateTime?
  createdAt    DateTime          @default(now())
  updatedAt    DateTime          @updatedAt

  workspace    Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, type])
  @@index([workspaceId])
  @@map("integrations")
}

enum IntegrationType {
  GOOGLE_CALENDAR
  GMAIL
  WHATSAPP
  TELEGRAM
  NOTION
  GITHUB
  STRIPE
  OPEN_FINANCE
}

enum IntegrationStatus {
  ACTIVE
  PAUSED
  ERROR
  REVOKED
}

model Automation {
  id          String    @id @default(cuid())
  workspaceId String
  name        String
  trigger     Json      // { type, conditions }
  actions     Json      // [{ type, config }]
  isActive    Boolean   @default(true)
  runCount    Int       @default(0)
  lastRunAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  runs        AutomationRun[]

  @@index([workspaceId])
  @@map("automations")
}

model AutomationRun {
  id           String          @id @default(cuid())
  automationId String
  status       AutomationStatus
  input        Json?
  output       Json?
  error        String?
  startedAt    DateTime        @default(now())
  completedAt  DateTime?

  automation   Automation      @relation(fields: [automationId], references: [id], onDelete: Cascade)

  @@index([automationId])
  @@map("automation_runs")
}

enum AutomationStatus {
  RUNNING
  SUCCESS
  FAILED
  SKIPPED
}

// ============================================================
// COMPARTILHADO
// ============================================================

model Comment {
  id          String    @id @default(cuid())
  workspaceId String
  taskId      String?
  authorId    String
  content     String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?

  task        Task?     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@map("comments")
}

model Attachment {
  id          String    @id @default(cuid())
  workspaceId String
  taskId      String?
  name        String
  url         String
  size        Int
  mimeType    String
  createdAt   DateTime  @default(now())

  task        Task?     @relation(fields: [taskId], references: [id], onDelete: Cascade)

  @@index([taskId])
  @@map("attachments")
}

model Notification {
  id          String    @id @default(cuid())
  workspaceId String
  userId      String
  type        String
  title       String
  body        String?
  data        Json?
  readAt      DateTime?
  createdAt   DateTime  @default(now())

  @@index([workspaceId, userId, readAt])
  @@map("notifications")
}
```

---

## ÍNDICES DE PERFORMANCE

Índices críticos além dos já declarados no schema:

```sql
-- Busca full-text em tarefas
CREATE INDEX tasks_title_search ON tasks USING gin(to_tsvector('portuguese', title));

-- Busca full-text em notas
CREATE INDEX notes_content_search ON notes USING gin(to_tsvector('portuguese', content));

-- Busca vetorial para IA (pgvector)
CREATE INDEX ai_memories_embedding ON ai_memories USING ivfflat (embedding vector_cosine_ops);

-- Tarefas por data para o dashboard do dia
CREATE INDEX tasks_workspace_scheduled ON tasks (workspace_id, scheduled_at)
  WHERE deleted_at IS NULL AND status NOT IN ('DONE', 'CANCELLED');
```

---

## MIGRAÇÕES — BOAS PRÁTICAS

1. **Nunca deletar coluna sem deprecation period** — adicionar `@deprecated` no schema primeiro
2. **Backfill antes de adicionar NOT NULL** — sempre com valor default
3. **Índices concurrently em produção** — não bloquear a tabela
4. **Testar rollback** — toda migration deve ter estratégia de rollback

---

*Versão: 1.0 | Criado: 2026-06-26*
