# MASTER CONTEXT — LIFE OS

> Este documento é o ponto de verdade do projeto. Deve ser lido e seguido em **todas** as conversas de desenvolvimento. Nenhuma decisão de produto, design ou engenharia deve contradizer este contexto.

---

## VISÃO DO PRODUTO

**Life OS** é um Sistema Operacional Pessoal — um aplicativo que centraliza toda a vida do usuário em um único lugar.

É a combinação das melhores ideias de:

| Produto | O que pegamos |
|---|---|
| Notion | Documentos, bases de dados, flexibilidade |
| ClickUp | Gestão de tarefas e projetos |
| Linear | Velocidade, UX, foco em produto |
| Motion | Agendamento inteligente com IA |
| Sunsama | Ritual diário, revisão, intenção |
| Akiflow | Capture rápido, Command Bar |
| Obsidian | Rede de conhecimento, notas conectadas |
| Things 3 | Simplicidade, elegância mobile |
| Superhuman | Velocidade extrema, keyboard-first |
| Google Calendar | Agenda onipresente |
| Capacities | Objetos conectados, tipos de conteúdo |
| Raycast | Command Bar, extensibilidade |
| Arc Browser | Design premium, organização espacial |

O produto deve parecer um **"Jarvis pessoal"** — uma IA que conhece toda a vida do usuário e o ajuda a tomar decisões melhores.

---

## PRINCÍPIOS INEGOCIÁVEIS

Todo código, design e decisão de produto deve obedecer:

1. **Extremamente rápido** — latência abaixo de 100ms para ações locais.
2. **Interface minimalista** — menos é mais. Remover tudo que não serve.
3. **Poucos cliques** — toda ação crítica em no máximo 2 cliques ou 1 atalho.
4. **Tudo conectado** — qualquer item pode se relacionar com qualquer outro.
5. **Mobile first** — projetar para mobile, depois expandir para desktop.
6. **Desktop extremamente produtivo** — atalhos de teclado em tudo, Command Bar global.
7. **Dark mode premium** — dark mode é o padrão, não uma opção secundária.
8. **Componentes reutilizáveis** — nunca criar dois componentes que fazem a mesma coisa.
9. **IA integrada em todo o sistema** — não é um chatbot separado, é parte da interface.
10. **Sistema escalável** — toda decisão deve suportar milhões de usuários.

---

## MÓDULOS DO SISTEMA

### Núcleo
- **Dashboard Hoje** — o que fazer agora, resumo do dia
- **Dashboard Geral** — visão completa da vida

### Produtividade
- **Tarefas** — gestão de to-dos com filtros, prioridades, datas
- **Projetos** — agrupamento de tarefas com milestones e progresso
- **Agenda** — calendário integrado com Google Calendar
- **Reuniões** — notas de reunião com geração automática de tarefas

### Comunicação
- **WhatsApp** — inbox integrado, mensagens viram tarefas
- **Emails** — inbox integrado estilo Superhuman

### Conhecimento
- **Ideias** — capture rápido de pensamentos
- **Notas** — notas ricas, conectadas, com tags
- **Documentos** — documentos longos estilo Notion

### Estilo de Vida
- **Hábitos** — rastreamento de hábitos diários
- **Diário** — registro pessoal diário
- **Saúde** — métricas de saúde integradas
- **Treinos** — planos e logs de treino
- **Dieta** — controle alimentar

### Financeiro
- **Finanças** — controle financeiro, Open Finance, metas

### Desenvolvimento Pessoal
- **Objetivos** — OKRs pessoais, metas de longo prazo
- **Revisão Semanal** — ritual de revisão guiado por IA
- **Conquistas** — histórico de realizações e marcos

### Sistema
- **Assistente IA** — interface direta com a IA do sistema
- **Integrações** — gerenciamento de conexões externas
- **Automações** — fluxos automáticos entre módulos

---

## FILOSOFIA DE CONEXÕES

Tudo no sistema pode se conectar. O grafo de relações é o coração do produto.

```
Mensagem WhatsApp  →  tarefa | ideia | lembrete
Reunião            →  tarefas | notas | documentos
Ideia              →  projeto | nota | tarefa
Objetivo           →  projetos | tarefas | hábitos
Email              →  tarefa | lembrete | nota
Tarefa             →  agenda | projeto | objetivo
Documento          →  nota | projeto | tarefa
Hábito             →  objetivo | diário | saúde
Gasto              →  objetivo financeiro | categoria
```

---

## EXPERIÊNCIA DE USO

O usuário deve conseguir:

- **Capturar** qualquer coisa em menos de 5 segundos (Command Bar global, `⌘K`)
- **Saber o que fazer agora** ao abrir o app
- **Ver sua vida inteira** em um único dashboard
- **Receber insights de IA** proativamente
- **Fazer revisões semanais** guiadas
- **Tomar decisões melhores** com base em dados pessoais

---

## STACK OFICIAL

### Frontend
```
Next.js 15        — App Router, Server Components, Server Actions
React 19          — concurrent features, use() hook
TypeScript 5      — strict mode, sem any implícito
Tailwind CSS 4    — utility-first, tema customizado
shadcn/ui         — componentes base
Framer Motion     — animações
Zustand           — estado global client-side
TanStack Query    — cache e sincronização de servidor
```

### Backend
```
Node.js           — runtime
PostgreSQL 16     — banco principal
Prisma ORM        — acesso ao banco, migrations
Redis             — cache, sessions, pub/sub
BullMQ            — filas de jobs assíncronos
```

### Autenticação
```
Better Auth       — auth completo, multi-tenant, OAuth
```

### Armazenamento
```
S3 / R2           — arquivos e mídia
```

### Realtime
```
WebSockets        — notificações, colaboração ao vivo
```

### IA
```
Claude (Anthropic) — raciocínio, análise, geração de conteúdo
OpenAI            — embeddings, fallback
Sistema de Memórias — contexto persistente por usuário
RAG               — retrieval sobre dados do usuário
```

### Integrações
```
Google Calendar / Gmail
WhatsApp Business API
Telegram
Google Drive
Notion
Apple Health / Google Fit
Stripe
Open Finance (Pluggy)
GitHub
Meta Ads / Google Ads
```

### Deploy
```
Vercel            — frontend + edge functions
Supabase          — PostgreSQL gerenciado + Realtime
Docker            — serviços auxiliares
```

---

## PADRÕES DE CÓDIGO

### Sempre fazer
- TypeScript estrito — `strict: true`, sem `any` sem justificativa
- Código modular — um arquivo, uma responsabilidade
- Componentes reutilizáveis — antes de criar, verificar se existe
- Server Actions — para mutações, preferir sobre API Routes
- Tipagens completas — interfaces e types para tudo
- Princípios SOLID — especialmente Single Responsibility e Dependency Inversion

### Nunca fazer
- Duplicar código — extrair em hook, util ou componente
- Deixar `console.log` no código final
- Usar `any` sem comentário justificando
- Criar componente com mais de 200 linhas sem dividir
- Fazer chamadas diretas ao banco no componente

---

## ARQUITETURA DE PASTAS

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # rotas de autenticação
│   ├── (dashboard)/        # rotas principais do app
│   └── api/                # API routes (webhooks, OAuth callbacks)
├── components/
│   ├── ui/                 # componentes base (shadcn)
│   └── shared/             # componentes reutilizáveis do sistema
├── modules/                # um diretório por módulo do sistema
│   ├── tasks/
│   ├── projects/
│   ├── agenda/
│   └── ...
├── hooks/                  # hooks React reutilizáveis
├── services/               # lógica de negócio, chamadas externas
├── lib/                    # utilitários, helpers, configurações
├── types/                  # TypeScript types e interfaces globais
├── stores/                 # Zustand stores
├── server/                 # código exclusivo de servidor
│   ├── actions/            # Server Actions
│   ├── queries/            # queries Prisma reutilizáveis
│   └── jobs/               # BullMQ jobs
├── integrations/           # conectores de APIs externas
├── ai/                     # prompts, chains, embeddings, memórias
└── automations/            # engine de automações
prisma/
├── schema.prisma
└── migrations/
```

---

## IA NO PRODUTO

A IA não é um módulo separado — está presente em todas as páginas.

| Contexto | Sugestão da IA |
|---|---|
| Dashboard Hoje | "O que devo priorizar agora?" |
| Tarefas | "Organize meu dia com base na minha agenda." |
| Projetos | "Quais projetos estão atrasados?" |
| Finanças | "Como posso economizar este mês?" |
| Objetivos | "Estou no caminho certo para minha meta?" |
| Reuniões | "Resuma esta reunião e crie as tarefas." |
| WhatsApp | "Quais mensagens exigem resposta urgente?" |
| Revisão Semanal | "Como foi minha semana? O que melhorar?" |
| Hábitos | "Qual hábito mais impacta meus objetivos?" |

---

## PAPÉIS DO CLAUDE NESTE PROJETO

Ao responder, o Claude deve pensar como a equipe completa:

1. **Product Manager Sênior** — decisões de produto, priorização, UX
2. **UX/UI Designer Sênior** — componentes, fluxos, acessibilidade
3. **Software Architect Sênior** — estrutura, padrões, escalabilidade
4. **Frontend Engineer Sênior** — React, Next.js, performance
5. **Backend Engineer Sênior** — APIs, lógica de negócio, segurança
6. **Database Architect** — schema, queries, performance de banco
7. **AI Engineer** — prompts, RAG, memórias, agentes
8. **DevOps Engineer** — CI/CD, deploy, infraestrutura
9. **Security Engineer** — autenticação, autorização, dados sensíveis
10. **Performance Engineer** — Core Web Vitals, latência, otimização

### Formato de resposta padrão

Ao implementar qualquer coisa, o Claude deve explicar:
- **O que** está fazendo
- **Por que** essa abordagem
- **Impactos futuros** e trade-offs
- **Alternativas** consideradas

---

## MODELO DE NEGÓCIO (SaaS)

O produto será comercializado como SaaS. Portanto:

- **Multi-tenant** — toda arquitetura suporta múltiplos workspaces
- **Módulos desacoplados** — cada módulo pode ser ligado/desligado por workspace
- **Dados isolados** — todo dado pertence a um `workspaceId`
- **Planos** — Free, Pro, Team, Enterprise
- **Billing** — Stripe com usage-based pricing em alguns módulos
- **Escalabilidade** — nenhuma decisão pode bloquear crescimento horizontal

---

*Versão: 1.0 | Criado: 2026-06-26*
