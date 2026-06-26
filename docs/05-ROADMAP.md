# ROADMAP DE DESENVOLVIMENTO — LIFE OS

> Sequência estratégica de desenvolvimento. Cada fase entrega valor real e é a base para a próxima.

---

## ESTRATÉGIA GERAL

**Princípio:** Entregar o núcleo com excelência antes de expandir.

Melhor ter 5 módulos perfeitos do que 20 módulos mediocres.

```
Fase 0 → Fundação técnica
Fase 1 → MVP do núcleo (valor imediato)
Fase 2 → Inteligência e conexões
Fase 3 → Vida completa
Fase 4 → Plataforma e escala
```

---

## FASE 0 — FUNDAÇÃO TÉCNICA
**Duração estimada:** 1-2 semanas
**Objetivo:** Stack completa rodando, sem funcionalidades de produto ainda.

### Entregas

- [ ] Setup Next.js 15 + TypeScript strict
- [ ] Tailwind CSS + shadcn/ui configurados com tema dark do Life OS
- [ ] Prisma + PostgreSQL (Supabase) conectados
- [ ] Better Auth configurado (email/senha + Google OAuth)
- [ ] Redis configurado (Upstash)
- [ ] BullMQ configurado
- [ ] Deploy funcionando (Vercel + Supabase)
- [ ] CI/CD básico (GitHub Actions)
- [ ] Variáveis de ambiente documentadas
- [ ] Schema inicial do banco aplicado

### Critério de conclusão
App rodando em produção com login/logout funcionando.

---

## FASE 1 — MVP DO NÚCLEO
**Duração estimada:** 3-4 semanas
**Objetivo:** Sistema utilizável diariamente. Substituir to-do list atual do usuário.

### 1.1 — Autenticação e Onboarding

- [ ] Tela de login (email/senha + Google)
- [ ] Fluxo de criação de workspace
- [ ] Onboarding em 3 passos (nome, timezone, primeiros hábitos)
- [ ] Perfil do usuário

### 1.2 — Sidebar e Navegação

- [ ] Layout principal com sidebar
- [ ] Navegação entre módulos
- [ ] Command Bar global (`⌘K`) — busca e ações rápidas
- [ ] Sidebar responsiva (mobile + desktop)
- [ ] Atalhos de teclado base

### 1.3 — Módulo de Tarefas

- [ ] CRUD completo de tarefas
- [ ] Status: Inbox → Todo → Em andamento → Feito
- [ ] Prioridades (nenhuma, baixa, média, alta, urgente)
- [ ] Data de vencimento com date picker
- [ ] Visualização em lista com filtros
- [ ] Subtarefas
- [ ] Busca em tarefas
- [ ] Ordenação e agrupamento
- [ ] Bulk actions (completar múltiplas, mover, deletar)

### 1.4 — Dashboard Hoje

- [ ] Lista de tarefas do dia
- [ ] Eventos do dia (sem integração ainda — manual)
- [ ] Contador de progresso (tarefas concluídas/total)
- [ ] Seção "Mais tarde" (tarefas sem data)
- [ ] Quick capture (adicionar tarefa rapidamente)

### 1.5 — Projetos (básico)

- [ ] CRUD de projetos
- [ ] Associar tarefas a projetos
- [ ] View de projeto com lista de tarefas
- [ ] Progresso automático baseado em tarefas concluídas

### Critério de conclusão
Usuário consegue usar o Life OS como gerenciador de tarefas diário completo.

---

## FASE 2 — INTELIGÊNCIA E CONEXÕES
**Duração estimada:** 3-4 semanas
**Objetivo:** A IA começa a agregar valor real. Dados se conectam.

### 2.1 — Assistente IA Base

- [ ] Interface de chat com a IA (streaming)
- [ ] Contexto do usuário injetado nas respostas
- [ ] IA pode criar/atualizar tarefas via tool use
- [ ] Histórico de conversas persistido
- [ ] IA contextual por módulo (botão "Perguntar à IA" em cada módulo)

### 2.2 — Sistema de Notas

- [ ] CRUD de notas com rich text (Tiptap)
- [ ] Tags e organização
- [ ] Busca semântica em notas (RAG)
- [ ] Conectar nota a tarefa ou projeto
- [ ] Quick note via Command Bar

### 2.3 — Agenda (básica, sem integração externa)

- [ ] Visualização de calendário (dia, semana, mês)
- [ ] CRUD de eventos
- [ ] Tarefas com data aparecem no calendário
- [ ] Drag & drop para reagendar

### 2.4 — Memórias de IA

- [ ] Extração automática de memórias das conversas
- [ ] Visualização e edição de memórias pelo usuário
- [ ] Memórias usadas para personalizar respostas

### 2.5 — Sistema de Relações

- [ ] Conectar qualquer item a qualquer outro
- [ ] "Ver relacionados" em tarefas, notas, projetos
- [ ] Backlinks (notas que referenciam esta nota)

### Critério de conclusão
A IA consegue responder "O que devo priorizar hoje?" com base nos dados reais do usuário.

---

## FASE 3 — VIDA COMPLETA
**Duração estimada:** 6-8 semanas
**Objetivo:** Cobrir todos os aspectos da vida do usuário.

### 3.1 — Integrações Google

- [ ] Google Calendar (sincronização bidirecional)
- [ ] Gmail (inbox integrado, email → tarefa)
- [ ] Google Drive (anexar arquivos de docs)

### 3.2 — Hábitos e Diário

- [ ] CRUD de hábitos com frequência configurável
- [ ] Check-in diário de hábitos
- [ ] Streak e estatísticas
- [ ] Diário pessoal com mood tracker
- [ ] IA analisa padrões de hábitos

### 3.3 — Objetivos e Metas

- [ ] CRUD de objetivos (OKR pessoal)
- [ ] Conectar tarefas e projetos a objetivos
- [ ] Check-ins periódicos
- [ ] Progresso visual
- [ ] IA avalia se está no caminho certo

### 3.4 — Finanças (básico)

- [ ] Contas financeiras manuais
- [ ] Lançamentos de receita/despesa
- [ ] Categorização
- [ ] Dashboard financeiro
- [ ] IA analisa padrões de gasto

### 3.5 — Revisão Semanal

- [ ] Fluxo guiado de revisão semanal
- [ ] Questões estruturadas (o que foi bem, o que melhorar...)
- [ ] IA facilita a reflexão com base nos dados da semana
- [ ] Histórico de revisões anteriores

### 3.6 — Módulo de Reuniões

- [ ] Notas de reunião estruturadas
- [ ] IA extrai itens de ação automaticamente
- [ ] Tarefas geradas vinculadas à reunião
- [ ] Participantes e follow-ups

### Critério de conclusão
O Life OS substitui pelo menos 5 apps diferentes do usuário.

---

## FASE 4 — PLATAFORMA E ESCALA
**Duração estimada:** ongoing
**Objetivo:** Produto pronto para crescimento e monetização.

### 4.1 — Billing e Planos

- [ ] Integração Stripe
- [ ] Planos: Free, Pro, Team
- [ ] Upgrade/downgrade de plano
- [ ] Trial de 14 dias
- [ ] Gestão de assinatura pelo usuário

### 4.2 — WhatsApp Integration

- [ ] WhatsApp Business API conectado
- [ ] Inbox de mensagens no Life OS
- [ ] Mensagem → tarefa em 1 clique
- [ ] IA prioriza mensagens pendentes

### 4.3 — Integrações Avançadas

- [ ] Open Finance (Pluggy) — banco automático
- [ ] Notion import
- [ ] GitHub (tarefas vinculadas a issues/PRs)
- [ ] Telegram bot

### 4.4 — Automações

- [ ] Engine de automações no-code
- [ ] Templates de automação prontos
- [ ] Trigger: evento → ação
- [ ] Exemplos: "Quando recebo email com [palavra], criar tarefa"

### 4.5 — Mobile Apps

- [ ] Progressive Web App (PWA) otimizado
- [ ] App nativo iOS (React Native ou Swift — a definir)
- [ ] Widget iOS para dashboard rápido
- [ ] Notificações push

### 4.6 — Conquistas e Gamificação

- [ ] Sistema de conquistas (marcos, streaks, marcos)
- [ ] Pontuação de produtividade
- [ ] Histórico de realizações
- [ ] Compartilhamento opcional

---

## MÉTRICAS DE SUCESSO POR FASE

| Fase | Métrica Principal |
|---|---|
| Fase 0 | Deploy rodando, tempo de build < 2min |
| Fase 1 | Usuário usa diariamente por 7 dias seguidos |
| Fase 2 | Usuário faz 10+ perguntas à IA por semana |
| Fase 3 | Usuário deletou 3+ outros apps |
| Fase 4 | 100 usuários pagantes |

---

## DÍVIDA TÉCNICA PLANEJADA (OK por agora)

Itens que serão implementados com qualidade menor inicialmente e melhorados depois:

1. **Busca** — texto simples nas fases 1-2, semântica completa na fase 2+
2. **Realtime** — polling na fase 1, WebSockets na fase 2+
3. **Mobile** — responsivo mas não nativo nas fases 1-3
4. **Relatórios** — simples nas fases 1-3, avançados na fase 4
5. **Testes** — unitários críticos desde o início, E2E na fase 2+

---

## ORDEM DE PRIORIZAÇÃO DE FEATURES (dentro de cada fase)

Critério de priorização (ICE Score):

```
Impact × Confidence × Ease / 3

Impact:     1-10 (quanto valor entrega ao usuário)
Confidence: 1-10 (quão certo é que vai funcionar)
Ease:       1-10 (quão fácil é de implementar)
```

Qualquer feature não planejada que surgir: deve ser pontuada antes de entrar no ciclo.

---

*Versão: 1.0 | Criado: 2026-06-26*
