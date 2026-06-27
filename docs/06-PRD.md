# PRD — PRODUCT REQUIREMENTS DOCUMENT
# Life OS — Sistema Operacional Pessoal

> Documento definitivo de requisitos de produto. Define o que o Life OS faz, como funciona e por quê. Nenhuma feature deve ser implementada sem estar aqui descrita.

**Versão:** 1.0 | **Status:** Aprovado | **Criado:** 2026-06-27

---

## VISÃO DO PRODUTO

**Missão:** Dar ao usuário clareza total sobre sua vida e o que fazer agora.

**Proposta de valor em uma frase:**
> "O único lugar onde você gerencia tudo — tarefas, agenda, finanças, hábitos — com uma IA que te conhece de verdade."

**Substitui:**
- Todoist / Things 3 → Tarefas
- Notion → Notas e documentos
- Google Calendar → Agenda
- YNAB / Mobills → Finanças
- Streaks / Habitica → Hábitos
- Day One → Diário
- ChatGPT → Assistente IA
- Sunsama / Akiflow → Planejamento diário

---

## USUÁRIO-ALVO

**Persona primária:** Profissional de alta performance, 25-45 anos, que:
- Usa 6+ apps de produtividade simultaneamente
- Perde tempo alternando entre ferramentas
- Sente que está sempre atrasado e sobrecarregado
- Quer clareza: "o que devo fazer agora?"
- Valoriza design premium e experiência refinada

**Dores principais:**
1. Informações espalhadas em 10 lugares
2. Não sabe o que priorizar
3. Capturar ideias é lento e esquecido
4. IA genérica (ChatGPT) não conhece seu contexto
5. Reuniões sem follow-up estruturado

---

## OBJETIVO PRINCIPAL DO USUÁRIO

O usuário deve conseguir responder "O que devo fazer agora?" em menos de 5 segundos após abrir o app.

---

## CLASSIFICAÇÃO DE PRIORIDADES

```
P0 = MVP obrigatório (Sprints 1-4)
P1 = Importante, pós-MVP (Sprints 5-8)
P2 = Futuro / roadmap longo prazo
```

---

## KPIs DO PRODUTO

| Métrica | Definição | Meta MVP | Meta Crescimento |
|---|---|---|---|
| DAU/MAU | Usuários ativos diariamente / mensalmente | > 40% | > 60% |
| Tasks Completed/Day | Média de tarefas concluídas por usuário/dia | > 3 | > 7 |
| Habit Completion Rate | % de hábitos marcados no dia | > 50% | > 70% |
| Weekly Review Rate | % de usuários que fazem revisão semanal | > 30% | > 60% |
| Inbox Zero | % de usuários com inbox vazia ao final do dia | > 20% | > 50% |
| Retenção D7 | Usuários que voltam em 7 dias | > 40% | > 65% |
| Retenção D30 | Usuários que voltam em 30 dias | > 20% | > 45% |
| AI Messages/Week | Média de mensagens para a IA por usuário/semana | > 5 | > 20 |
| Time to First Value | Tempo até criar primeira tarefa após signup | < 2 min | < 1 min |

---

## MÓDULOS

---

### MÓDULO 1 — DASHBOARD HOJE

**Prioridade:** P0

#### Objetivo
Ser a tela de abertura do app. O usuário vê exatamente o que precisa fazer hoje sem navegar a lugar nenhum.

#### Problema que resolve
O usuário abre o app sem saber por onde começar. O Dashboard Hoje elimina essa fricção: a IA e o sistema já selecionaram o que importa.

#### Funcionalidades

**P0 — MVP:**
- [ ] Saudação contextual ("Bom dia, Fabio. Você tem 5 tarefas para hoje.")
- [ ] Lista de tarefas do dia (agendadas + vencendo hoje)
- [ ] Seção "Mais tarde" (tarefas sem data atribuídas ao inbox)
- [ ] Contador de progresso: "3 de 8 tarefas concluídas"
- [ ] Quick Capture: campo de input sempre visível para capturar itens
- [ ] Seção de eventos do dia (manual, sem integração)
- [ ] Botão "Adicionar ao dia" para puxar tarefas de outros dias

**P1:**
- [ ] "Modo Foco": exibe uma tarefa por vez, pressiona Espaço para avançar
- [ ] Bloco de hábitos do dia (check-in rápido)
- [ ] Resumo financeiro do dia (gastos de hoje)
- [ ] Sugestão da IA: "Com base na sua agenda, a melhor hora para X é 14h"

**P2:**
- [ ] Life Score diário (0-100, calculado pelo sistema)
- [ ] Widget de clima + contexto temporal
- [ ] Planejamento via voz

#### Fluxo principal
```
Abrir app → Dashboard Hoje
→ Ver tarefas do dia
→ Clicar em tarefa → Marcar como concluída (checkbox) OU Abrir detalhes
→ Quick Capture → digitar + Enter → item vai para inbox ou dia de hoje
```

#### Estados
- **Com tarefas:** lista normal, progresso visível
- **Sem tarefas:** Empty state motivador: "Você está livre. Capture algo novo."
- **Tudo concluído:** Celebração discreta: "Dia incrível. Todas as tarefas concluídas."
- **Loading:** Skeleton das seções

#### Métricas de sucesso
- Tempo médio na tela: > 3 minutos
- Taxa de conclusão de tarefas do dia: > 60%
- Quick Capture utilizado: > 1x/dia por usuário ativo

---

### MÓDULO 2 — DASHBOARD GERAL

**Prioridade:** P1

#### Objetivo
Visão macro da vida do usuário: produtividade, saúde, finanças e objetivos em um painel.

#### Funcionalidades

**P1:**
- [ ] KPIs: tarefas semana, hábitos %, saldo do mês, progresso de objetivos
- [ ] Gráfico de produtividade (tarefas concluídas por dia, últimas 4 semanas)
- [ ] Heatmap de atividade (estilo GitHub)
- [ ] Próximos eventos (7 dias)
- [ ] Projetos em andamento com progresso
- [ ] Insights da IA: "Você foi 30% mais produtivo nas manhãs de terça"

**P2:**
- [ ] Comparativo semana anterior
- [ ] Metas de longo prazo com projeção
- [ ] Radar chart de áreas da vida

#### Estados
- Loading com skeletons de KPI
- Sem dados (novo usuário): onboarding guidance em cada widget

---

### MÓDULO 3 — TAREFAS

**Prioridade:** P0

#### Objetivo
Capturar, organizar e executar todas as tarefas do usuário. É o coração do Life OS.

#### Problema que resolve
Tarefas espalhadas em WhatsApp, email, papel e cabeça. Sem prioridade clara. Sem visibilidade do total.

#### Funcionalidades

**P0 — MVP:**
- [ ] Criar tarefa (título, prioridade, data, projeto, status)
- [ ] Status: Inbox → A fazer → Em andamento → Em revisão → Concluída → Cancelada
- [ ] Prioridades: Sem prioridade / Baixa / Média / Alta / Urgente
- [ ] Data de vencimento com date picker
- [ ] Subtarefas (1 nível de profundidade)
- [ ] Associar a projeto
- [ ] Busca em tempo real (client-side)
- [ ] Filtros: status, prioridade, data, projeto, sem data
- [ ] Ordenação: manual, data, prioridade, criação
- [ ] Bulk actions: completar, priorizar, mover para projeto, deletar
- [ ] Keyboard navigation: J/K para navegar, Enter para abrir, E para editar, D para data, P para prioridade
- [ ] Quick add via Command Bar (⌘N)
- [ ] Soft delete (lixeira com restauração)

**P1:**
- [ ] Tags/Labels personalizáveis
- [ ] Recorrência (diária, semanal, mensal, personalizada)
- [ ] Estimativa de tempo
- [ ] Assignee (para uso futuro multi-usuário)
- [ ] Dependências entre tarefas
- [ ] Visualização Kanban (por status)
- [ ] Visualização Calendário (tarefas com data)
- [ ] Anexos (links, arquivos)
- [ ] Comentários na tarefa
- [ ] Histórico de mudanças

**P2:**
- [ ] Subtarefas com múltiplos níveis
- [ ] Templates de tarefa
- [ ] Integração com GitHub Issues
- [ ] Automações: "Quando completar X, criar Y"

#### Fluxo principal — Criar tarefa
```
⌘N OU botão "+" → Quick input field
→ Digitar título → Enter → Tarefa criada no Inbox
→ Opcional: expandir para adicionar data, projeto, prioridade antes de salvar
```

#### Fluxo — Executar tarefa
```
Dashboard Hoje → Ver tarefa → Clicar checkbox → Tarefa marcada concluída
→ Animação discreta de check → Atualizar progresso do dia
→ OU: Abrir tarefa → Ver detalhes / subtarefas → Trabalhar → Marcar concluída
```

#### Estados de tarefa
```
Inbox:       capturada, sem processamento
A fazer:     planejada, aguardando execução
Em andamento:em execução agora
Em revisão:  aguardando aprovação/verificação
Concluída:   ✓ finalizada
Cancelada:   descartada (não deletada)
```

#### Casos de uso
1. "Tenho uma ideia de tarefa durante uma reunião" → Quick Capture → Inbox
2. "Quero ver tudo que está atrasado" → Filtro: data < hoje, status ≠ concluída
3. "Preciso mover 10 tarefas para outro projeto" → Selecionar todas → Bulk action → Mover
4. "Quero planejar minha semana" → Arrastar tarefas do Inbox para dias específicos

#### Métricas de sucesso
- Tempo para criar tarefa: < 5 segundos
- Taxa de tarefas no Inbox processadas por dia: > 80%
- Tarefas concluídas por usuário ativo por dia: > 3

---

### MÓDULO 4 — PROJETOS

**Prioridade:** P0

#### Objetivo
Agrupar tarefas relacionadas em projetos com progresso, prazo e visão macro.

#### Funcionalidades

**P0 — MVP:**
- [ ] Criar projeto (nome, cor, ícone, data alvo, status, descrição)
- [ ] Status: Ativo, Em pausa, Concluído, Arquivado
- [ ] Associar tarefas a projetos
- [ ] View do projeto: lista de tarefas + progresso automático
- [ ] Progresso: calculado por tarefas concluídas / total
- [ ] Milestones básicos (nome + data + status)
- [ ] Filtrar tarefas por projeto na view de tarefas

**P1:**
- [ ] Vista Kanban do projeto
- [ ] Documentos vinculados ao projeto
- [ ] Notas do projeto
- [ ] Membros do projeto (futuro colaboração)
- [ ] Timeline / Gantt simplificado

**P2:**
- [ ] Templates de projeto
- [ ] Portfolio de projetos (agrupamento de projetos)
- [ ] Relatórios de projeto

#### Fluxo principal
```
Criar projeto → Definir nome/cor/data alvo
→ Adicionar tarefas (criar novas OU vincular existentes)
→ Acompanhar progresso na view do projeto
→ Marcar milestone como concluído
→ Arquivar projeto quando concluído
```

---

### MÓDULO 5 — AGENDA

**Prioridade:** P1

#### Objetivo
Visualizar o tempo do usuário: onde ele vai estar e o que vai fazer, integrado com tarefas e reuniões.

#### Funcionalidades

**P1:**
- [ ] Visualizações: Dia, Semana, Mês
- [ ] CRUD de eventos manuais
- [ ] Eventos: título, horário início/fim, local, descrição, recorrência, cor
- [ ] Tarefas com data aparecem na agenda como blocos
- [ ] Drag & drop para reagendar eventos
- [ ] Blocos de tempo (time blocking para tarefas)
- [ ] Vista "Agenda" (lista cronológica, sem grade)

**P1 — Integração Google Calendar:**
- [ ] Sincronização bidirecional
- [ ] Eventos do Google aparecem na agenda
- [ ] Criação de eventos no Life OS sincroniza com Google
- [ ] Webhook para updates em tempo real

**P2:**
- [ ] Sugestão de horário pela IA ("melhor hora para reunião X")
- [ ] Proteção de tempo de foco (bloquear slots automaticamente)
- [ ] Integração com múltiplos calendários

#### Fluxo — Time blocking
```
View de Semana → Ver slots livres
→ Arrastar tarefa do painel lateral para slot
→ Tarefa vira bloco de tempo na agenda
→ Aparece no Dashboard Hoje no horário definido
```

---

### MÓDULO 6 — REUNIÕES

**Prioridade:** P1

#### Objetivo
Transformar reuniões em resultados: capturar notas estruturadas e extrair próximos passos automaticamente via IA.

#### Funcionalidades

**P1:**
- [ ] Criar reunião (título, data/hora, participantes, pauta)
- [ ] Editor de notas de reunião (rich text)
- [ ] Seção de "Próximos passos" (extraída manualmente ou pela IA)
- [ ] Converter próximos passos em tarefas com 1 clique
- [ ] Vincular reunião a projeto
- [ ] Histórico de reuniões por projeto
- [ ] Modelo de reunião personalizável

**P1 — IA:**
- [ ] "Extrair próximos passos" — IA analisa as notas e identifica action items
- [ ] "Resumir reunião" — resumo executivo em 3 bullets
- [ ] Sugestão de assignee para cada ação

**P2:**
- [ ] Transcrição de áudio (integração com Whisper/AssemblyAI)
- [ ] Integração com Google Meet / Zoom (importar transcrição)
- [ ] Envio automático de resumo por email para participantes

#### Fluxo principal
```
Criar reunião → Adicionar pauta
→ Durante reunião: anotar no editor
→ Após reunião: clicar "Extrair próximos passos"
→ IA gera lista de action items
→ Usuário revisa e confirma
→ Tarefas criadas automaticamente, vinculadas à reunião e ao projeto
```

---

### MÓDULO 7 — WHATSAPP

**Prioridade:** P2

#### Objetivo
Transformar mensagens do WhatsApp em ações concretas sem sair do Life OS.

#### Funcionalidades

**P2:**
- [ ] Inbox de conversas do WhatsApp Business API
- [ ] Ler e responder mensagens
- [ ] Marcar mensagem como "A processar"
- [ ] Converter mensagem em tarefa (1 clique)
- [ ] Converter mensagem em nota / ideia
- [ ] IA classifica mensagens por urgência
- [ ] Notificações de novas mensagens

**Restrições técnicas:**
- Requer aprovação da Meta (2-4 semanas)
- Apenas WhatsApp Business API (não WhatsApp Web pessoal)
- Custo por conversa (modelo da Meta)

---

### MÓDULO 8 — EMAILS

**Prioridade:** P2

#### Objetivo
Inbox de email integrado com foco em ação: email → tarefa, email → lembrete.

#### Funcionalidades

**P2:**
- [ ] Inbox unificado (Gmail via OAuth)
- [ ] Ler emails
- [ ] Converter email em tarefa (1 clique)
- [ ] Arquivar, marcar como lido, responder
- [ ] IA resume emails longos
- [ ] "Snooze" de email (reaparece mais tarde)
- [ ] Filtros e labels

**Sem envio de emails em massa — foco em ação individual.**

---

### MÓDULO 9 — IDEIAS

**Prioridade:** P0

#### Objetivo
Capturar qualquer pensamento em menos de 3 segundos, sem atrito, para processar depois.

#### Problema que resolve
Boas ideias se perdem por falta de lugar imediato para anotar. A Ideia é o item mais rápido de criar no Life OS.

#### Funcionalidades

**P0 — MVP:**
- [ ] Criar ideia (texto livre, sem campos obrigatórios além do conteúdo)
- [ ] Captura por texto (Quick Capture na Command Bar)
- [ ] Tags opcionais
- [ ] Status: Bruta / Refinada / Transformada / Arquivada
- [ ] Converter ideia em nota, projeto ou tarefa
- [ ] Lista de ideias com busca

**P1:**
- [ ] Captura por áudio (transcrição automática)
- [ ] Captura por imagem (OCR)
- [ ] Captura por link (preview automático)
- [ ] Relacionar ideias entre si
- [ ] IA: "Esta ideia é parecida com sua nota X"

**P2:**
- [ ] Mapa visual de ideias (mindmap leve)
- [ ] Importar de outras fontes (Readwise, etc.)

#### Fluxo — Captura rápida
```
⌘N → Selecionar "Ideia" OU
Abrir app → Quick Capture visível → Digitar → Enter
→ Vai para Inbox de Ideias
→ Depois: processar → Converter em projeto/tarefa/nota OU arquivar
```

---

### MÓDULO 10 — NOTAS

**Prioridade:** P0

#### Objetivo
Sistema de conhecimento pessoal: armazenar, organizar e encontrar informações rapidamente.

#### Funcionalidades

**P0 — MVP:**
- [ ] Criar nota (editor rich text: bold, italic, listas, títulos, links, código)
- [ ] Título + conteúdo
- [ ] Tags
- [ ] Pin de notas importantes
- [ ] Busca por texto (full-text search)
- [ ] Vincular nota a tarefa ou projeto
- [ ] CRUD completo

**P1:**
- [ ] Busca semântica (RAG — encontra por significado, não só por palavra)
- [ ] Backlinks (ver quais notas referenciam esta)
- [ ] Templates de nota (reunião, ideia, sprint, etc.)
- [ ] Markdown shortcuts (## → H2, ** → bold)
- [ ] Tabelas no editor
- [ ] Upload de imagens inline
- [ ] Exportar para Markdown / PDF

**P2:**
- [ ] Colaboração em tempo real (Tiptap Collaboration)
- [ ] Wiki do workspace
- [ ] Integração com Readwise
- [ ] Publicar nota como página pública

#### Fluxo principal
```
⌘N → Nova nota → Título → Escrever
→ Adicionar tags → Vincular a projeto (opcional)
→ Salvar automático (sem botão de salvar)
→ Buscar depois: ⌘K → "nota sobre X"
```

---

### MÓDULO 11 — HÁBITOS

**Prioridade:** P1

#### Objetivo
Construir rotinas consistentes com tracking visual e contexto da IA.

#### Funcionalidades

**P1:**
- [ ] Criar hábito (nome, frequência: diária/semanal/mensal, hora alvo, cor, ícone)
- [ ] Check-in diário (botão de confirmar hábito do dia)
- [ ] Streak counter (dias consecutivos)
- [ ] Calendário de histórico (heatmap estilo GitHub)
- [ ] Estatísticas: taxa de conclusão, melhor streak, média semanal
- [ ] Agrupamento por categoria (saúde, aprendizado, produtividade)
- [ ] Notificação no horário configurado

**P1 — IA:**
- [ ] "Análise de padrões": "Você completa hábitos 80% mais no período da manhã"
- [ ] Sugestão de hora ideal baseada no histórico
- [ ] Alert quando streak em risco

**P2:**
- [ ] Hábitos quantitativos (ex: "beber 2L de água" com slider)
- [ ] Gamificação: conquistas por streaks
- [ ] Hábitos negativos (evitar: cigarro, redes sociais)
- [ ] Integração com Apple Health / Google Fit

---

### MÓDULO 12 — DIÁRIO

**Prioridade:** P1

#### Objetivo
Espaço de reflexão privada, estruturada. Memória pessoal do usuário.

#### Funcionalidades

**P1:**
- [ ] Entrada diária (data automática)
- [ ] Editor rico (texto livre + prompts de reflexão)
- [ ] Mood tracker (emoji ou escala 1-5)
- [ ] Prompts do dia (gerados pela IA ou templates)
- [ ] Histórico de entradas (calendário)
- [ ] Privacidade: entradas encriptadas localmente (flag para futuro)
- [ ] Busca em entradas anteriores

**P1 — IA:**
- [ ] Gerar prompts de reflexão baseados no dia do usuário ("Como foi a reunião com X?")
- [ ] "Relembrar": IA mostra entrada de 1 ano atrás
- [ ] Identificar padrões de humor ao longo do tempo

**P2:**
- [ ] Exportar diário completo
- [ ] Templates avançados (gratidão, intenções, revisão)
- [ ] Análise de sentimento ao longo do tempo

---

### MÓDULO 13 — FINANÇAS

**Prioridade:** P1

#### Objetivo
Visibilidade financeira completa: onde o dinheiro está, para onde vai, e se as metas estão sendo atingidas.

#### Funcionalidades

**P1 — Manual:**
- [ ] Contas: corrente, poupança, cartão, investimento, criptomoeda
- [ ] Lançamentos: receita, despesa, transferência
- [ ] Categorias personalizáveis (com ícone e cor)
- [ ] Dashboard financeiro: saldo total, gastos do mês, receitas
- [ ] Gráfico de gastos por categoria (pizza / barras)
- [ ] Histórico de transações com filtros
- [ ] Metas financeiras (ex: "Juntar R$ 10.000 até dezembro")

**P1 — IA:**
- [ ] "Onde estou gastando mais?" — análise por categoria
- [ ] "Vou conseguir atingir minha meta?" — projeção
- [ ] Alertas: "Você já gastou 80% do orçamento de alimentação"
- [ ] Categorização automática de transações por descrição

**P2 — Open Finance (Pluggy):**
- [ ] Conectar conta bancária via Open Finance Brasil
- [ ] Importar transações automaticamente
- [ ] Sincronização diária

---

### MÓDULO 14 — OBJETIVOS

**Prioridade:** P1

#### Objetivo
Definir e acompanhar metas de vida com clareza: o que quer atingir, como está progredindo.

#### Funcionalidades

**P1:**
- [ ] Criar objetivo (título, descrição, tipo: numérico/binário/hábito, data alvo)
- [ ] Progresso numérico: valor atual vs meta (ex: "Correr 500km — 213km feitos")
- [ ] Check-ins periódicos (semanais)
- [ ] Conectar tarefas e projetos ao objetivo
- [ ] Área do objetivo: carreira, saúde, finanças, relacionamentos, aprendizado
- [ ] Status: Ativo, Pausado, Concluído, Abandonado
- [ ] Vista de todos os objetivos com progresso visual

**P1 — IA:**
- [ ] "Estou no caminho certo?" — análise do ritmo atual vs necessário
- [ ] Sugestão de próximo passo para cada objetivo
- [ ] Alerta quando objetivo está em risco (sem atualização há muito tempo)

**P2:**
- [ ] OKRs (Objective + Key Results)
- [ ] Compartilhar objetivo com accountability partner
- [ ] Revisão de objetivos guiada pela IA (trimestral)

---

### MÓDULO 15 — REVISÃO SEMANAL

**Prioridade:** P1

#### Objetivo
Ritual semanal guiado que fecha a semana passada e planeja a próxima com clareza.

#### Funcionalidades

**P1:**
- [ ] Fluxo em 5 etapas:
  1. **Olhar para trás:** tarefas concluídas, hábitos, objetivos da semana
  2. **Processar inbox:** tarefas e ideias não processadas
  3. **Revisão de projetos:** o que avançou, o que está parado
  4. **Planejar próxima semana:** selecionar tarefas prioritárias
  5. **Reflexão:** o que funcionou, o que melhorar
- [ ] IA gera perguntas baseadas nos dados da semana
- [ ] Tempo estimado: 15-20 minutos
- [ ] Histórico de revisões anteriores
- [ ] Insights pós-revisão: "Você completou 87% das metas desta semana"

**P2:**
- [ ] Revisão mensal / trimestral guiada
- [ ] Exportar revisão como PDF
- [ ] Compartilhar resumo com mentor ou coach

---

### MÓDULO 16 — ASSISTENTE IA

**Prioridade:** P0 (interface básica) / P1 (avançado)

#### Objetivo
IA que realmente conhece o usuário e responde perguntas sobre sua vida com base nos dados reais.

#### Funcionalidades

**P0 — MVP:**
- [ ] Interface de chat com streaming (SSE)
- [ ] Contexto injetado: tarefas, projetos ativos, hábitos, objetivos
- [ ] Tool use: IA pode criar tarefas, notas e ideias
- [ ] Histórico de conversas persistido
- [ ] Rate limit por plano (Free: 10/dia, Pro: 200/dia)

**P1:**
- [ ] Botão "Perguntar à IA" contextual em cada módulo
- [ ] Perguntas sugeridas por contexto ("Deseja priorizar suas tarefas de hoje?")
- [ ] Tool use expandido: criar evento, atualizar status de projeto
- [ ] Modo "Coach de produtividade": perguntas proativas
- [ ] Análise de padrões semanais

**P1 — Memórias:**
- [ ] Extração automática de memórias das conversas
- [ ] Categorias: preferência, fato, objetivo, padrão, compromisso
- [ ] Memórias usam embedding vetorial (pgvector)
- [ ] UI para ver, editar e deletar memórias
- [ ] Memórias injetadas no contexto de cada conversa

**P2:**
- [ ] Insights proativos (push): "Você não atualizou seu projeto X há 5 dias"
- [ ] Agentes especializados: FinanceAgent, HabitAgent, MeetingAgent
- [ ] Integração com WhatsApp: conversar com a IA pelo WhatsApp
- [ ] API pública para integrações externas

#### Oportunidades de IA por módulo

| Módulo | Oportunidade IA |
|---|---|
| Dashboard | "O que você recomenda priorizar hoje?" |
| Tarefas | Ordenar por impacto estimado, decompor tarefa complexa |
| Reuniões | Extrair action items, resumir notas |
| Notas | Busca semântica, sugerir conexões |
| Hábitos | Detectar padrões, melhor horário |
| Finanças | Projeção de metas, alertas de orçamento |
| Objetivos | "Estou no caminho certo?", próximo passo |
| Diário | Prompts de reflexão personalizados |
| Revisão Semanal | Perguntas baseadas nos dados da semana |

---

### MÓDULO 17 — CONFIGURAÇÕES

**Prioridade:** P0

#### Funcionalidades

**P0 — MVP:**
- [ ] Perfil: nome, avatar, timezone, idioma
- [ ] Workspace: nome, slug, plano
- [ ] Notificações: email, push, configuração por módulo
- [ ] Integrações: Google OAuth (Calendar + Gmail)
- [ ] Aparência: tema (dark only no MVP)
- [ ] Dados: exportar tudo, deletar conta
- [ ] Segurança: trocar senha, sessões ativas

**P1:**
- [ ] Membros do workspace (multi-usuário)
- [ ] Permissões e papéis
- [ ] Billing e planos (Stripe)
- [ ] Shortcuts personalizados
- [ ] Templates customizados

---

## USER FLOWS

---

### FLUXO 1 — Dia de trabalho padrão

```
Tela inicial: Dashboard Hoje (após login)

→ Ver saudação com número de tarefas do dia
→ Revisar lista de tarefas (agendadas para hoje)
→ Selecionar tarefa mais prioritária → Clicar para abrir detalhes
→ Trabalhar na tarefa → Marcar subtarefas conforme avança
→ Marcar tarefa como concluída → Animação de check
→ Progresso do dia atualiza ("4 de 8 concluídas")
→ Próxima tarefa (auto-scroll ou seleção manual)
→ Quick Capture: ideia surgiu durante o trabalho → ⌘N → "Ideia sobre X" → Enter → Vai para inbox
→ Fim do dia: inbox zero → Empty state positivo

Exceções:
- Tarefa com data passada: badge "Atrasada" em vermelho
- Tarefa bloqueada: indicador de dependência
- Internet caiu: modo offline, ações salvas localmente e sincronizadas depois

Oportunidades IA:
- Botão "Priorizar com IA" → IA ordena tarefas por impacto + urgência
- "Você está fazendo X há muito tempo. Quer dividir em subtarefas?"
```

---

### FLUXO 2 — WhatsApp → Tarefa → Agenda

```
Tela inicial: Módulo WhatsApp (P2)

→ Ver inbox de mensagens
→ Identificar mensagem importante de cliente
→ Clicar no ícone "+" → "Converter em tarefa"
→ Modal: título pré-preenchido com texto da mensagem
→ Ajustar título, definir prioridade ALTA, data de amanhã, projeto "Cliente X"
→ Tarefa criada → Aparece em Tarefas e no Dashboard de amanhã
→ "Adicionar à agenda" → Abrir date picker + time picker
→ Bloco de tempo criado na agenda de amanhã
→ Toast: "Tarefa criada e agendada para amanhã às 10h"

Exceções:
- WhatsApp desconectado: banner de reconexão
- Mensagem muito longa: IA resume automaticamente para o título

MVP fallback (antes do WhatsApp estar disponível):
→ Usar Quick Capture para digitar a mensagem manualmente
```

---

### FLUXO 3 — Ideia → Projeto

```
Tela inicial: Quick Capture (qualquer tela)

→ ⌘N → "Nova ideia" → "Criar um curso online sobre produtividade"
→ Ideia salva no Inbox de Ideias
→ Mais tarde: abrir módulo Ideias → Selecionar ideia
→ Clicar "Transformar em projeto"
→ Modal: nome do projeto pré-preenchido com título da ideia
→ Definir: cor, data alvo, área (carreira)
→ Projeto criado → Aberto automaticamente
→ Adicionar tarefas iniciais: "Definir estrutura do curso", "Criar landing page", "Gravar módulo 1"
→ Conectar ao objetivo "Gerar R$ 50k em 2026"
→ Toast: "Projeto criado e vinculado ao objetivo"

Oportunidades IA:
- "Gerar tarefas iniciais para este projeto" → IA cria 5-10 tarefas com base no título
```

---

### FLUXO 4 — Objetivo → Tarefas → Progresso

```
Tela inicial: Módulo Objetivos

→ Criar objetivo: "Correr minha primeira meia maratona"
→ Definir: tipo numérico (distância km), meta 21.1km, data 2026-10-15, área Saúde
→ "Gerar plano com IA" → IA cria hábito "Correr 3x por semana" + tarefas:
   - "Comprar tênis de corrida adequado" (urgente)
   - "Fazer check-up médico" (alta)
   - "Criar planilha de treino" (média)
→ Hábito criado automaticamente no módulo Hábitos
→ Tarefas criadas e vinculadas ao objetivo
→ Semanas depois: Dashboard mostra progresso "47km / 21.1km acumulados"
→ IA: "No ritmo atual, você vai atingir a meta 2 semanas antes do prazo. 🎉"

Exceções:
- Objetivo muito vago: IA pede mais detalhes antes de gerar plano
```

---

### FLUXO 5 — Reunião → Resumo IA → Tarefas

```
Tela inicial: Módulo Reuniões → Nova Reunião

→ Criar reunião: "Kickoff Projeto Novo Cliente"
→ Definir participantes, data/hora, pauta
→ Durante reunião: escrever notas no editor
   "João vai enviar proposta até sexta"
   "Preciso criar deck de apresentação"
   "Cliente quer integração com SAP — verificar viabilidade"
→ Após reunião: clicar "Extrair próximos passos com IA"
→ IA identifica:
   □ João: enviar proposta (até sexta) — assignee: João
   □ Eu: criar deck de apresentação — assignee: Eu, alta prioridade
   □ Eu: verificar viabilidade integração SAP — assignee: Eu, média
→ Usuário revisa e confirma → Tarefas criadas
→ Vincular ao projeto "Novo Cliente"
→ Reunião aparece no histórico do projeto

Exceções:
- Notas muito longas: IA usa apenas seção de "Próximos passos"
- Sem internet: salvar notas localmente, extrair quando reconectar
```

---

### FLUXO 6 — Captura rápida multiformat

```
Tela inicial: qualquer tela

Texto:
→ ⌘N → Campo de texto → "Ligar para Ana sobre contrato" → Enter
→ Item no Inbox (tipo: tarefa automático por linguagem)

Áudio (P1):
→ Segurar botão de microfone → Falar → Soltar
→ Transcrição automática → Preview → Confirmar → Inbox

Imagem (P1):
→ ⌘N → Upload de imagem → OCR extrai texto
→ Preview → Editar → Salvar como nota ou ideia

Link (P1):
→ Colar URL → Preview automático com título + descrição + thumbnail
→ Salvar como ideia / nota com link

Todos vão para:
→ Inbox → Tag automática por tipo
→ Processar depois: converter em tarefa, nota, projeto ou descartar

Oportunidades IA:
- "Ligar para Ana sobre contrato" → IA detecta ação → sugere criar como tarefa
- Imagem de recibo → IA sugere criar como lançamento financeiro
```

---

### FLUXO 7 — Planejamento semanal

```
Tela inicial: Módulo Revisão Semanal (todo domingo ou segunda-manhã)

ETAPA 1 — Olhar para trás:
→ IA exibe: "Você concluiu 23 tarefas (67%), fez 5 de 7 hábitos, avançou 2 objetivos"
→ Celebrar conquistas, notar padrões

ETAPA 2 — Processar inbox:
→ Lista de itens não processados no Inbox
→ Para cada: converter em tarefa/nota/projeto OU arquivar
→ Meta: Inbox Zero ao terminar esta etapa

ETAPA 3 — Revisão de projetos:
→ Ver status de cada projeto ativo
→ Projeto parado há +7 dias: alerta
→ Atualizar status, adicionar notas

ETAPA 4 — Planejar próxima semana:
→ Ver tarefas sem data (backlog)
→ Arrastar tarefas para dias da próxima semana
→ Time blocking: reservar slots na agenda para trabalho profundo
→ Meta: cada dia com máximo de 3 tarefas principais definidas

ETAPA 5 — Reflexão (opcional):
→ Editor de texto livre: "O que funcionou? O que melhorar?"
→ Mood do final de semana
→ Intenção para próxima semana (1 frase)

Ao finalizar:
→ Toast: "Planejamento concluído. Boa semana! 💪"
→ Insights da IA: "Na semana passada você foi mais produtivo nas manhãs de terça"
→ Revisão salva no histórico

Exceções:
- Usuário pula etapa: pode voltar depois
- Sem dados suficientes: etapa 1 mostra 0 tarefas → "Esta é sua primeira semana!"
```

---

## JORNADA DO USUÁRIO

### Fase 1 — Descoberta e Signup (D0)
```
Landing page → Ver proposta de valor → Criar conta (email ou Google)
→ Onboarding em 3 passos:
  1. "Qual é seu nome?" + foto
  2. "Qual é seu fuso horário?"
  3. "Quais módulos você quer usar?" (selecionar 3+)
→ Workspace criado → Dashboard Hoje vazio
→ Primeira Quick Capture: "Criar sua primeira tarefa" como onboarding hint
→ Tarefa criada → Primeiro check → "Você está pronto para usar o Life OS"
```

### Fase 2 — Ativação (D1-D3)
```
D1: Criar 5+ tarefas, completar pelo menos 1
D2: Criar 1 projeto e vincular tarefas
D3: Primeira conversa com a IA
→ Gatilho de ativação: usuário completa a primeira tarefa do Dashboard Hoje
```

### Fase 3 — Retenção (D7-D30)
```
D7:  Hábito de abrir o app de manhã formado
D14: Fazer primeira revisão semanal
D30: Usar pelo menos 4 módulos regularmente
→ Retenção depende de: velocidade, confiabilidade e valor percebido da IA
```

### Fase 4 — Conversão (D30-D60)
```
→ Atingir limite do plano Free
→ Ver modal de upgrade com benefícios claros
→ Trial de 14 dias do Pro (sem cartão)
→ Converter para Pro
```

---

## FUNCIONALIDADES DO MVP (P0)

### O que vai estar pronto nos Sprints 1-4

```
✅ Autenticação (login, signup, Google OAuth)
✅ Workspace e perfil de usuário
✅ Dashboard Hoje
✅ Quick Capture (texto)
✅ Tarefas (CRUD completo + subtarefas + filtros + bulk actions)
✅ Projetos (CRUD + associar tarefas + progresso)
✅ Ideias (captura e listagem)
✅ Notas (editor rich text + tags + busca por texto)
✅ IA básica (chat + contexto + criar tarefas via tool use)
✅ Configurações (perfil, workspace)
✅ Command Bar (⌘K) — busca e ações rápidas
✅ Keyboard shortcuts
✅ Sidebar + navegação
✅ Dark mode premium
✅ Responsive (desktop + mobile)
```

### O que NÃO está no MVP
```
❌ Hábitos
❌ Diário
❌ Finanças
❌ Objetivos (básico entra no Sprint 6)
❌ Revisão Semanal
❌ Agenda
❌ Reuniões
❌ WhatsApp / Email
❌ Memórias de IA
❌ Google Calendar
❌ Billing / Stripe
❌ Notificações push
```

---

## ROADMAP DE EVOLUÇÃO

| Sprint | Entrega | Valor |
|---|---|---|
| 1 | Auth + Shell + Navigation | Usuário consegue logar e navegar |
| 2 | Tarefas completas | Substitui Todoist |
| 3 | Dashboard Hoje + Projetos | Visão do dia + organização |
| 4 | Notas + IA básica | Substitui Notion + ChatGPT parcialmente |
| 5 | Hábitos + Agenda | Adiciona rotina e tempo |
| 6 | Finanças + Objetivos | Visão de vida completa |
| 7 | Memórias IA + Revisão Semanal | IA que realmente te conhece |
| 8 | Polish + Performance + PWA | Beta fechado com 50 usuários |
| 9 | Google Calendar integration | Agenda real |
| 10 | Gmail integration | Email → tarefa |
| 11 | Billing Stripe | Monetização |
| 12 | Reuniões com IA | Meetings produtivos |
| 13 | Diário + Saúde | Vida pessoal completa |
| 14 | Open Finance | Finanças automáticas |
| 15 | WhatsApp Business | Canal de captura |
| 16 | Motor de Automações | Conexões entre módulos |
| 17 | Mobile PWA otimizado | Mobile-first experience |
| 18 | API pública | Plataforma aberta |

---

## RISCOS DE PRODUTO

### Risco 1 — Complexidade vs Adoção (ALTO)
```
Problema: Muitos módulos podem confundir o usuário novo.
Mitigação: Onboarding seleciona apenas os módulos relevantes.
           Sidebar esconde módulos não selecionados até o usuário ativar.
           First Run Experience guiada com 1 objetivo claro.
```

### Risco 2 — IA como diferencial frágil (ALTO)
```
Problema: Se a IA não impressionar na primeira semana, usuário abandona.
Mitigação: Foco em 2-3 casos de uso de IA com WOW imediato:
           1. "Priorize minhas tarefas para hoje" → resposta em <2s
           2. "Extrair próximos passos da reunião" → precisão > 90%
           3. "Quanto gastei em alimentação este mês?" → responde com dados reais
```

### Risco 3 — Substituição de apps estabelecidos (MÉDIO)
```
Problema: Usuário tem Todoist + Notion + Google Calendar há anos.
          Migração de dados é uma barreira enorme.
Mitigação: Importadores: Todoist CSV, Notion export.
           Extensão Chrome para captura de qualquer página.
           Não forçar migração total — deixar coexistir.
```

### Risco 4 — Retention sem killer habit (MÉDIO)
```
Problema: Sem uma funcionalidade que cria hábito diário, churn é alto.
Mitigação: Dashboard Hoje como ritual matinal (abertura obrigatória).
           Notificação matinal: "Você tem X tarefas para hoje. Bom dia!"
           Streak de dias com app aberto (gamificação discreta).
```

### Risco 5 — Custo de IA em escala (MÉDIO)
```
Problema: Com muitos usuários, custo de Claude pode inviabilizar Free tier.
Mitigação: Claude Haiku para respostas simples, Sonnet para análises.
           Cache Redis de respostas similares.
           Limite hard de 10 mensagens/dia no Free.
           Monitorar custo por usuário em dashboard admin.
```

---

## SUGESTÕES DE PRODUTO

### 1. "Momento Zen" — Abertura do app
Antes do Dashboard, 2 segundos mostrando apenas: hora + data + frase motivacional curta. Remove ansiedade antes de ver a lista de tarefas. Pode ser desativado.

### 2. "Delegado à IA"
Status especial de tarefa: usuário pede à IA para acompanhar e lembrar. IA envia proativamente atualização de status.

### 3. "Capture por Gesto" no Mobile
No mobile: segurar botão flutuante 1 segundo → gravação de áudio começa. Soltar → transcreve → Inbox. Zero taps para capturar pensamento.

### 4. "Weekly Score"
Todo domingo, notificação com placar da semana: "⚡ 74 pontos — Sua melhor semana em 3 meses!" Combina tarefas, hábitos e objetivos.

### 5. "Templates de Vida"
No signup, escolher perfil: Empreendedor, Freelancer, Estudante, Executivo, Pai/Mãe. Cada perfil pré-configura módulos, hábitos sugeridos, categorias financeiras e projetos de exemplo. Reduz time-to-value drasticamente.

### 6. "Perguntas Rápidas da IA"
Na abertura do app, 1 pergunta da IA contextual: "Você marcou reunião com X para hoje — já tem pauta preparada?" Com botões [Criar pauta] [Já tenho] [Não é hoje]. 3 taps máximo para acionar contexto relevante.

---

*Versão: 1.0 | Status: Aprovado para desenvolvimento | Criado: 2026-06-27*
