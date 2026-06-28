# UI BIBLE — LIFE OS (Apex Velocity)

> Guia definitivo de design do sistema. Todo componente, página e interação deve seguir estas diretrizes. Inconsistência visual é um bug.

---

## BRAND & PERSONALIDADE

O Life OS usa o sistema de design **Apex Velocity** — uma estética de alta performance e precisão de engenharia voltada para power users.

**Personalidade:** agressivo, porém disciplinado. Urgência, controle e artesanato premium.

**Estilo visual:** fusão de *Modern Corporate* com *Dark Tech Minimalism*. Pense num cockpit de alta performance: cada elemento é funcional, cada transição é rápida, a hierarquia é absoluta.

**Referências:** Linear, Raycast, Vercel, cockpits aeronáuticos, interfaces de F1.

---

## SISTEMA DE CORES

### Tokens Completos (Dark Mode — padrão)

```css
/* Surfaces */
--surface:                   #131313;
--surface-dim:               #131313;
--surface-bright:            #3a3939;
--surface-container-lowest:  #0e0e0e;  /* base canvas / bg raiz */
--surface-container-low:     #1c1b1b;  /* sidebar, painéis */
--surface-container:         #201f1f;  /* cards nível 1 */
--surface-container-high:    #2a2a2a;  /* modais, popovers */
--surface-container-highest: #353534;  /* elementos elevados */

/* On-Surface */
--on-surface:         #e5e2e1;  /* texto principal */
--on-surface-variant: #e6bdb8;  /* texto secundário, metadados */

/* Inverse */
--inverse-surface:    #e5e2e1;
--inverse-on-surface: #313030;

/* Borders */
--outline:         #ac8884;  /* bordas visíveis */
--outline-variant: #5c403c;  /* bordas sutis */

/* Background */
--background:    #131313;
--on-background: #e5e2e1;

/* Surface Variant */
--surface-variant: #353534;
```

### Cor Primária — Apex Red

```css
/* Primary */
--primary:           #ffb4ab;  /* texto em fundos escuros */
--on-primary:        #690005;
--primary-container: #dc2626;  /* ← APEX RED — COR PRINCIPAL */
--on-primary-container: #fff6f5;
--inverse-primary:   #bf0715;

/* Primary Fixed */
--primary-fixed:     #ffdad6;
--primary-fixed-dim: #ffb4ab;
--on-primary-fixed:  #410002;
--on-primary-fixed-variant: #93000b;

/* Surface Tint */
--surface-tint: #ffb4ab;
```

### Cores Secundárias

```css
/* Secondary */
--secondary:           #c8c6c5;
--on-secondary:        #303030;
--secondary-container: #474746;
--on-secondary-container: #b7b5b4;

/* Secondary Fixed */
--secondary-fixed:     #e5e2e1;
--secondary-fixed-dim: #c8c6c5;
--on-secondary-fixed:  #1b1b1c;
--on-secondary-fixed-variant: #474746;
```

### Cores Terciárias

```css
/* Tertiary */
--tertiary:           #ccc5c1;
--on-tertiary:        #33302d;
--tertiary-container: #76716d;
--on-tertiary-container: #fef7f2;

/* Tertiary Fixed */
--tertiary-fixed:     #e8e1dd;
--tertiary-fixed-dim: #ccc5c1;
--on-tertiary-fixed:  #1e1b19;
--on-tertiary-fixed-variant: #4a4643;
```

### Status / Error

```css
--error:           #ffb4ab;
--on-error:        #690005;
--error-container: #93000a;
--on-error-container: #ffdad6;
```

### Referência Rápida — Uso Cotidiano

| Token | Valor | Uso |
|---|---|---|
| `--background` | `#131313` | Fundo raiz da aplicação |
| `--surface-container-low` | `#1c1b1b` | Sidebar, painéis laterais |
| `--surface-container` | `#201f1f` | Cards padrão |
| `--surface-container-high` | `#2a2a2a` | Modais, dropdowns |
| `--on-surface` | `#e5e2e1` | Texto principal |
| `--on-surface-variant` | `#e6bdb8` | Labels, metadados |
| `--primary-container` | `#dc2626` | **Apex Red** — ações primárias, estados ativos |
| `--outline-variant` | `#5c403c` | Bordas sutis de repouso |
| `--outline` | `#ac8884` | Bordas visíveis, hover |

### Cores dos Módulos

Módulos usam a cor base do sistema com variações de **accent** para ícones:

```
Tarefas       #dc2626  apex-red
Projetos      #ef4444  red-500
Agenda        #f97316  orange (destaque)
Reuniões      #c8c6c5  secondary
Notas         #ccc5c1  tertiary
Documentos    #e5e2e1  on-surface
Hábitos       #ffb4ab  primary
Finanças      #b7b5b4  secondary-container-on
Objetivos     #dc2626  apex-red
IA            #fff6f5  on-primary-container
```

---

## TIPOGRAFIA

### Fontes

```
Display / Headings / UI:  Geist       — sans-serif, técnico, legível em densidade alta
Metadata / Labels / Code: JetBrains Mono — monospaced, reforça o DNA "Life OS técnico"
```

### Escala

```yaml
display-lg:
  font: Geist 700
  size: 48px / 56px
  tracking: -0.02em

headline-lg:
  font: Geist 600
  size: 32px / 40px
  tracking: -0.01em

headline-lg-mobile:
  font: Geist 600
  size: 24px / 32px

body-md:
  font: Geist 400
  size: 16px / 24px

label-sm:
  font: JetBrains Mono 500
  size: 12px / 16px
  tracking: 0.05em    ← uppercase em labels técnicos
```

### Regras de Uso

- **Títulos de página e seção** → Geist 600-700, tight tracking
- **Body e descrições** → Geist 400
- **Status, badges, metadados** → JetBrains Mono uppercase
- **Código e timestamps** → JetBrains Mono
- Nunca misturar mais de 2 famílias na mesma tela

---

## ESPAÇAMENTO

Sistema baseado em grid de **4px**:

```
xs:    4px   — entre ícone e label
sm:    8px   — padding interno de badge, gap em grupos densos
md:    16px  — padding de cards, gutter mobile
lg:    24px  — espaçamento entre seções
xl:    40px  — separação de blocos maiores
gutter:        16px (mobile) / 32px (desktop)
```

---

## BORDAS (Border Radius)

O sistema usa bordas **Soft-Industrial** — pequeno arredondamento que suaviza o contraste extremo sem virar "friendly". **Nunca pill-shape em botões ou inputs.**

```
sm:      2px   (0.125rem)
DEFAULT: 4px   (0.25rem)   ← padrão da maioria dos componentes
md:      6px   (0.375rem)
lg:      8px   (0.5rem)    ← cards externos, containers grandes
xl:      12px  (0.75rem)   ← modais, sheets
full:    9999px             ← avatares circulares SOMENTE
```

---

## ELEVAÇÃO E PROFUNDIDADE

Profundidade via **Tonal Layering** + **Subtle Outlines**. Sem `box-shadow` clássico.

| Nível | Background | Borda | Uso |
|---|---|---|---|
| 0 — Canvas | `#0e0e0e` | — | Fundo raiz |
| 1 — Cards / Sidebar | `#1c1b1b` | `1px #262626` | Painéis, cards base |
| 2 — Modais / Popovers | `#2a2a2a` | `1px #5c403c` + glow vermelho 10% | Camada ativa, modais |

### Glow de Atividade (Nível 2)

```css
/* Aplicar em modais e elementos em foco profundo */
box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.15),
            0 0 24px rgba(220, 38, 38, 0.08);
```

---

## COMPONENTES

### Botões

```
Primary
  background: #dc2626 (Apex Red)
  color: #ffffff
  hover: background #ef4444
  radius: DEFAULT (4px)
  height: 36px
  padding: 0 16px
  font: Geist 500 14px

Secondary
  background: transparent
  border: 1px solid #404040
  color: #e5e2e1
  hover: border-color #dc2626, color #dc2626
  radius: DEFAULT (4px)

Ghost
  background: transparent
  border: none
  color: #e5e2e1
  hover: background #201f1f

Danger / Destructive
  background: rgba(220,38,38,0.15)
  color: #ffb4ab
  hover: background rgba(220,38,38,0.25)
```

Tamanhos:
```
sm:  h-7  px-3  text-xs
md:  h-9  px-4  text-sm   ← padrão
lg:  h-10 px-5  text-base
```

### Inputs & Fields

```css
/* Estado padrão */
height: 36px;
background: var(--surface-container);   /* #201f1f */
border-bottom: 2px solid var(--outline-variant);  /* #5c403c */
border-top: none;
border-left: none;
border-right: none;
border-radius: var(--radius-DEFAULT) var(--radius-DEFAULT) 0 0;
padding: 0 12px;
font-size: 14px;
color: var(--on-surface);

/* Label — JetBrains Mono uppercase */
font-family: 'JetBrains Mono', monospace;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.05em;
text-transform: uppercase;
color: var(--on-surface-variant);

/* Focus */
border-bottom-color: #dc2626;  /* Apex Red */
border-bottom-width: 2px;
outline: none;
```

### Cards

```css
background: var(--surface-container);    /* #201f1f */
border: 1px solid var(--outline-variant); /* #5c403c */
border-radius: var(--radius-lg);          /* 8px */
padding: 16px;

/* Hover */
border-color: var(--outline);  /* #ac8884 */

/* Active / Selected */
border-color: #dc2626;  /* Apex Red — sem mudar espessura */
```

### Chips & Tags

```css
/* Status chip padrão */
background: rgba(220, 38, 38, 0.15);
color: #dc2626;
font-family: 'JetBrains Mono', monospace;
font-size: 11px;
font-weight: 500;
letter-spacing: 0.05em;
text-transform: uppercase;
padding: 2px 8px;
border-radius: var(--radius-DEFAULT);  /* 4px */

/* Variações de status */
/* success  */ background: rgba(34,197,94,0.12);  color: #4ade80;
/* warning  */ background: rgba(245,158,11,0.12); color: #fbbf24;
/* neutral  */ background: var(--surface-container-high); color: var(--on-surface-variant);
```

### Listas e Navegação

```css
/* Item de lista padrão */
height: 36px;
padding: 0 12px;
border-radius: var(--radius-DEFAULT);

/* Hover */
background: var(--surface-container);  /* #201f1f */

/* Active — indicator bar esquerda */
background: var(--surface-container-high);
position: relative;

/* Barra vertical Apex Red */
::before {
  content: '';
  position: absolute;
  left: 0;
  top: 25%;
  height: 50%;
  width: 2px;
  background: #dc2626;
  border-radius: 0 2px 2px 0;
}
```

### Command Bar (`⌘K`)

```css
position: fixed;
top: 20%;
left: 50%;
transform: translateX(-50%);
width: min(640px, 90vw);

background: var(--surface-container-high);   /* #2a2a2a */
border: 1px solid var(--outline-variant);
border-radius: var(--radius-xl);              /* 12px */
box-shadow: 0 0 0 1px rgba(220,38,38,0.15),
            0 24px 48px rgba(0,0,0,0.7);

/* Input interno */
height: 52px;
font-size: 15px;
padding: 0 20px;
background: transparent;
border: none;
border-bottom: 1px solid var(--outline-variant);
color: var(--on-surface);
```

---

## LAYOUT

### Grid

```
Desktop:  12 colunas, max-width 1280px
Mobile:   4 colunas
Gutter:   16px (mobile) / 32px (desktop)
```

### Sidebar

```
Largura expandida:  240px
Largura colapsada:  56px
Background:         var(--surface-container-low)  #1c1b1b
Border right:       1px solid var(--outline-variant)
```

### Main Content

```
max-width: 1280px
padding:   24px 32px (desktop) / 16px (mobile)
```

---

## ANIMAÇÕES

```css
/* Transições */
--transition-fast:   100ms ease;
--transition-base:   150ms ease;
--transition-slow:   200ms ease;

/* Regra geral */
/* Cor, border, opacity: 150ms ease */
/* Aparição de modais:   200ms ease + translate Y 4px → 0 */
/* Sidebar:              200ms ease */
/* Hover de lista:       100ms ease */
```

Framer Motion — usar apenas para:
- Entrada de modais e sheets (fade + translateY)
- Drag & drop de tarefas
- Layout animations em listas
- Micro-interações de feedback (checkbox, check de hábito)

**Proibido:** bouncy excessivo, spring animations longas, qualquer coisa que atrase uma ação do usuário.

---

## ÍCONES

- Biblioteca: **Lucide React** (padrão)
- Tamanhos: 14px (micro), 16px (padrão), 18px (médio)
- Stroke width: 1.5px
- Cor: herdar do texto pai; Apex Red apenas em ícones de estado ativo

---

## ATALHOS DE TECLADO

```
⌘K          — Command Bar (global)
⌘N          — Novo item contextual
⌘/          — Painel de atalhos
⌘,          — Configurações
J/K         — Navegação em listas
Enter       — Abrir / confirmar
E           — Edição rápida
D           — Definir data
P           — Definir prioridade
Escape      — Fechar / cancelar
⌘1-9        — Navegação entre módulos
```

---

## RESPONSIVIDADE

```
Mobile:   < 768px   — bottom nav, sidebar oculta, margem 16px
Tablet:   768-1024px — sidebar colapsada
Desktop:  > 1024px  — sidebar expandida, layout completo
Wide:     > 1440px  — max-width centralizado
```

---

## ACESSIBILIDADE

- Contraste mínimo AA (4.5:1 para texto normal)
- Focus visible em todos os interativos — ring Apex Red `rgba(220,38,38,0.5)`
- ARIA labels em ícones sem texto
- `prefers-reduced-motion` → desligar todas as animações

---

## ANTI-PATTERNS — NUNCA FAZER

- Bordas pill-shape em botões ou inputs
- `box-shadow` clássico (usar tonal layering)
- Light mode como experiência principal
- Mais de 2 famílias tipográficas na mesma tela
- Apex Red em elementos decorativos que não são interativos
- Animações longas que atrasam ações

---

---

## ESTADOS DE UI

### Loading — Spinner

```css
/* Usar apenas em ações pontuais (submit de form, delete) */
/* Nunca em carregamento de página inteira */
.spinner {
  width: 16px;
  height: 16px;
  border: 1.5px solid var(--outline-variant);
  border-top-color: #dc2626;
  border-radius: 9999px;
  animation: spin 600ms linear infinite;
}
```

Regra: botão em loading → substituir label por spinner + desabilitar. Nunca mostrar spinner flutuante genérico.

### Skeleton

```
Cor base:    var(--surface-container-high)   #2a2a2a
Cor shimmer: var(--surface-bright)           #3a3939
Animação:    shimmer 1.4s ease infinite (gradiente horizontal)
Border radius: mesmo do elemento real
```

Regras:
- Skeleton deve ter exatamente o mesmo layout do conteúdo real (mesmas alturas, larguras, gaps)
- Nunca mostrar skeleton por mais de 3s — se demorar, mostrar Error State
- Não animar skeleton em `prefers-reduced-motion`

```tsx
// Padrões de altura
linha de texto:   h-4  (16px)
título:           h-6  (24px)
card pequeno:     h-16 (64px)
card normal:      h-24 (96px)
avatar:           h-8 w-8 rounded-full
```

### Empty State

Estrutura obrigatória: ícone → título → descrição → ação primária (opcional)

```
ícone:      Lucide, 32px, cor --on-surface-variant
título:     Geist 500, 15px, --on-surface
descrição:  Geist 400, 13px, --on-surface-variant, max 2 linhas
ação:       Button secondary sm (quando aplicável)
```

Exemplos por módulo:
```
Tarefas vazias:   "Nenhuma tarefa"          → "Tudo limpo por hoje."
                                              → [+ Nova tarefa]
Notas vazias:     "Nenhuma nota"            → "Capture seus pensamentos."
                                              → [+ Nova nota]
Busca sem result: "Sem resultados para X"  → "Tente um termo diferente."
```

Regra: Empty state deve ser motivador, nunca deprimente. Tom de controle, não de falha.

### Error State

```
Estrutura: ícone AlertCircle (vermelho) → título → descrição técnica → ação de retry
Cor:       --error (#ffb4ab) para ícone, --on-surface para texto
```

```tsx
// Componente padrão
<ErrorState
  title="Não foi possível carregar"
  description="Erro ao conectar com o servidor."
  onRetry={() => refetch()}
/>
```

Regra: nunca mostrar stack trace ao usuário. Log interno, mensagem simples para o usuário.

### Offline State

```
Banner fixo no topo: altura 36px, fundo #1c1b1b, borda bottom 1px #dc2626
Ícone WifiOff 14px + texto "Sem conexão — trabalhando offline"
Desaparecer com slide-up quando conexão voltar
```

---

## PADRÕES DE PÁGINA

### Dashboard

```
Layout: grid 12 colunas
Header: título da página (h1) + ações primárias (direita) — height 56px
Widgets: 3 tamanhos — sm (3 col), md (6 col), lg (12 col)
Gap entre widgets: 16px
Padding do container: 24px 32px (desktop), 16px (mobile)
```

Ordem de prioridade visual de cima para baixo:
1. KPIs / números principais (sm widgets na primeira linha)
2. Lista de foco principal (md ou lg)
3. Conteúdo secundário (md widgets)
4. Atividade recente (lg, última linha)

### Tabela

```
Header: sticky top, fundo --surface-container-low, borda bottom
Linha:  height 44px, hover fundo --surface-container
Seleção: checkbox esquerda, fundo --surface-container-high quando selecionada
Paginação: cursor-based, "Mostrar mais" ou navegação numérica — nunca offset puro
Colunas: mínimo de largura, sem truncar texto importante
Coluna de ações: direita, visível apenas no hover da linha
```

### Kanban

```
Coluna: width 280px, fundo --surface-container-low, border-radius lg
Header da coluna: status chip + contador de cards + botão "+"
Card: fundo --surface-container, border 1px --outline-variant
      hover: border --outline
      dragging: opacity 0.5, shadow level 2
Gap entre colunas: 12px
Gap entre cards: 8px
Scroll: cada coluna scroll independente, overflow-y auto
```

### Formulário

```
Layout: max-width 560px, centralizado ou em drawer
Seções: agrupadas com título de seção (label-sm uppercase)
Gap entre campos: 20px
Gap entre seções: 32px
Ações: sempre no final, alinhadas à direita — [Cancelar ghost] [Confirmar primary]
Validação: inline, abaixo do campo, font 12px, cor --error
```

Regras:
- Nunca abrir formulário em página nova se couber em modal ou drawer
- Campos obrigatórios: asterisco vermelho após o label, nunca "* obrigatório" no rodapé
- Autofocus no primeiro campo sempre

### Detalhes (item aberto)

```
Layout: 2 colunas — conteúdo principal (flex-1) + sidebar de metadados (280px)
Header: título editável inline (click to edit) + breadcrumb + ações
Sidebar de metadados: status, prioridade, data, projeto, assignee, tags
Seção de conteúdo: rich text ou descrição + subtarefas/subitens
Seção de atividade: comentários e histórico de mudanças (colapsável)
```

### Configurações

```
Layout: sidebar de navegação (200px) + conteúdo (flex-1)
Sidebar: grupos de seções com labels uppercase, items com ícone 16px
Seções de conteúdo: título h2 + descrição + cards de configuração
Cards de configuração: label + descrição curta + controle (toggle, select, input) — tudo na mesma linha
Ação de salvar: auto-save com feedback toast OU botão "Salvar" sticky no bottom
```

---

## DASHBOARD — WIDGETS

### Tamanhos de Widget

| Tamanho | Colunas | Uso |
|---|---|---|
| sm | 3 col (25%) | KPI único: número + label + delta |
| md | 6 col (50%) | Lista curta, gráfico simples |
| lg | 12 col (100%) | Tabela, lista principal, gráfico completo |

### KPI Card (sm widget)

```
Estrutura:
  label:  JetBrains Mono 11px uppercase, --on-surface-variant
  valor:  Geist 700 28px, --on-surface
  delta:  12px, verde (#4ade80) se positivo, vermelho (#f87171) se negativo
          acompanha ícone TrendingUp / TrendingDown 12px

Background: --surface-container
Border:     1px --outline-variant
Padding:    16px
```

### Indicadores de Progresso

```css
/* Barra linear */
height: 4px;
background: var(--surface-container-high);
border-radius: 9999px;

/* Fill */
background: #dc2626; /* Apex Red para progresso principal */
background: #4ade80; /* Verde para metas/hábitos */
transition: width 300ms ease;
```

```css
/* Circular (hábitos, objetivos) */
/* SVG stroke-dasharray / stroke-dashoffset */
stroke: #dc2626;
stroke-width: 3;
stroke-linecap: round;
```

---

## COMPONENT INVENTORY POR MÓDULO

### Core / Global
```
CommandBar, Sidebar, TopBar, UserAvatar, WorkspaceSwitcher,
NotificationBell, KeyboardShortcutHint, Breadcrumb,
ThemeProvider, ToastProvider, ModalProvider
```

### Dashboard Hoje
```
DayProgressBar, TaskListWidget, QuickCaptureInput,
EventTimelineWidget, HabitCheckWidget, KpiCard,
FocusModeToggle, GreetingHeader
```

### Tarefas
```
TaskList, TaskItem, TaskForm, TaskFilters, TaskBulkActions,
TaskStatusBadge, PriorityBadge, DueDatePicker,
SubtaskList, SubtaskItem, TaskDetailPanel,
TaskGroupHeader, TaskEmptyState, TaskSearchBar
```

### Projetos
```
ProjectList, ProjectCard, ProjectForm, ProjectHeader,
MilestoneList, MilestoneItem, ProjectProgressBar,
ProjectTaskList, ProjectEmptyState
```

### Agenda
```
CalendarView, DayView, WeekView, MonthView,
EventCard, EventForm, EventDetailPanel,
TimeGrid, AgendaList, RecurrenceSelector
```

### Notas
```
NoteList, NoteCard, NoteEditor (Tiptap wrapper),
NoteForm, TagInput, TagBadge, NoteSearchBar,
NoteDetailPanel, PinnedNotes, NoteEmptyState
```

### Hábitos
```
HabitList, HabitCard, HabitForm, HabitCheckButton,
HabitStreakBadge, HabitHeatmap, HabitStats,
DailyCheckinPanel, HabitEmptyState
```

### Finanças
```
AccountList, AccountCard, TransactionList, TransactionItem,
TransactionForm, CategoryBadge, FinanceDashboard,
BalanceCard, SpendingChart, BudgetProgressBar
```

### IA
```
AiChatPanel, AiMessageBubble, AiInputBar, AiStreamingCursor,
AiContextBadge, AiMemoryList, AiMemoryCard,
AiSuggestionChip, AiLoadingState
```

### Shared / Primitivos
```
Button, Input, Textarea, Select, Checkbox, Toggle, RadioGroup,
DatePicker, TimePicker, DateRangePicker,
Modal, Drawer, Popover, Dropdown, Tooltip, Toast,
Table, TableHeader, TableRow, TableCell,
Tabs, TabsList, TabsTrigger, TabsContent,
Card, CardHeader, CardContent, CardFooter,
Badge, Chip, Avatar, Spinner, Skeleton,
EmptyState, ErrorState, OfflineBanner,
RichTextEditor, FileUpload, ColorPicker, IconPicker
```

---

## REGRAS DE CONSISTÊNCIA

### Quando usar Modal
- Ações destrutivas (confirmar delete)
- Formulários curtos (até 5 campos) sem contexto de navegação
- Visualização rápida de item sem sair da página atual
- Máximo: largura 560px, nunca full-screen em desktop

### Quando usar Drawer (Sheet)
- Formulários médios (6-12 campos)
- Detalhes de item com contexto rico (tarefa, nota, projeto)
- Configurações de filtro/view em mobile
- Painéis de IA contextual
- Sempre desliza da direita em desktop, de baixo em mobile

### Quando usar Tabela
- Listas com 5+ colunas de dados
- Quando comparação entre linhas é importante
- Relatórios financeiros, logs, histórico
- Nunca para listas simples de 1-2 atributos — usar lista estilizada

### Quando usar Cards
- Projetos, hábitos, contas financeiras (entidades "ricas" com preview)
- Grid de visualização quando espaço horizontal permite
- Dashboard widgets
- Nunca para tarefas simples (usar lista densa, não cards)

### Quando usar Navegação Lateral (Sidebar)
- Módulos principais da aplicação — sempre na sidebar
- Sub-navegação dentro de um módulo (ex: configurações) — sidebar secundária 200px
- Nunca usar tabs horizontais para navegação entre módulos

### Quando usar Command Bar (⌘K)
- Criar qualquer item rápido sem contexto de navegação
- Busca global entre todos os módulos
- Ações rápidas em item selecionado (mudar status, prioridade, data)
- Navegar entre módulos
- Nunca duplicar ação que já está a 1 clique visível na tela

### Quando usar Popover vs Tooltip
- **Tooltip:** informação estática, aparece em hover, desaparece ao mover, sem interação
- **Popover:** tem conteúdo interativo (seletor de data, seletor de prioridade, mini-formulário)

### Quando usar Toast vs Banner
- **Toast:** feedback de ação concluída (criou, atualizou, deletou) — 3s, canto inferior direito
- **Banner:** estado persistente que precisa de atenção (offline, erro de sync, aviso de plano) — topo da página

---

## DESIGN TOKENS COMPLETOS

```json
{
  "color": {
    "background": "#131313",
    "surface": {
      "dim": "#131313",
      "DEFAULT": "#131313",
      "bright": "#3a3939",
      "lowest": "#0e0e0e",
      "low": "#1c1b1b",
      "base": "#201f1f",
      "high": "#2a2a2a",
      "highest": "#353534"
    },
    "on-surface": "#e5e2e1",
    "on-surface-variant": "#e6bdb8",
    "outline": "#ac8884",
    "outline-variant": "#5c403c",
    "primary": "#dc2626",
    "primary-text": "#ffb4ab",
    "secondary": "#c8c6c5",
    "error": "#ffb4ab",
    "success": "#4ade80",
    "warning": "#fbbf24",
    "info": "#60a5fa"
  },
  "spacing": {
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px",
    "12": "48px",
    "16": "64px"
  },
  "radius": {
    "sm": "2px",
    "DEFAULT": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "full": "9999px"
  },
  "shadow": {
    "card": "none (tonal layering)",
    "modal": "0 0 0 1px rgba(220,38,38,0.15), 0 24px 48px rgba(0,0,0,0.7)",
    "dropdown": "0 0 0 1px rgba(220,38,38,0.10), 0 8px 24px rgba(0,0,0,0.5)",
    "hover-glow": "0 0 0 1px rgba(220,38,38,0.15), 0 0 24px rgba(220,38,38,0.08)"
  },
  "font": {
    "sans": "Geist, system-ui, sans-serif",
    "mono": "JetBrains Mono, monospace",
    "size": {
      "xs":   "11px",
      "sm":   "12px",
      "base": "14px",
      "md":   "15px",
      "lg":   "16px",
      "xl":   "20px",
      "2xl":  "24px",
      "3xl":  "32px",
      "4xl":  "48px"
    },
    "weight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600,
      "bold": 700
    }
  },
  "animation": {
    "fast":   "100ms ease",
    "base":   "150ms ease",
    "slow":   "200ms ease",
    "modal":  "200ms ease + translateY(4px → 0)",
    "sidebar":"200ms ease"
  },
  "z-index": {
    "base":     0,
    "raised":   10,
    "dropdown": 100,
    "sticky":   200,
    "modal":    300,
    "toast":    400,
    "command":  500
  },
  "layout": {
    "sidebar-expanded":  "240px",
    "sidebar-collapsed": "56px",
    "content-max-width": "1280px",
    "widget-sm":         "25%",
    "widget-md":         "50%",
    "widget-lg":         "100%",
    "modal-max-width":   "560px",
    "drawer-width":      "480px",
    "detail-sidebar":    "280px"
  }
}
```

---

## ACESSIBILIDADE — GUIA COMPLETO

### Contraste
- Texto normal (< 18px): mínimo **4.5:1** (WCAG AA)
- Texto grande (≥ 18px bold): mínimo **3:1**
- `--on-surface` (#e5e2e1) sobre `--background` (#131313): **contraste ~11:1** ✅
- `--on-surface-variant` (#e6bdb8) sobre `--surface-container` (#201f1f): verificar por uso

### Focus
```css
/* Padrão global — nunca remover outline sem substituir */
:focus-visible {
  outline: 2px solid rgba(220, 38, 38, 0.6);
  outline-offset: 2px;
  border-radius: var(--radius-DEFAULT);
}
```

### Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Semântica
- Usar elementos HTML semânticos (`<nav>`, `<main>`, `<aside>`, `<button>`, `<h1-h6>`)
- `aria-label` em todos os ícones sem texto visível
- `aria-live="polite"` em toasts e atualizações dinâmicas
- `aria-expanded` em sidebar, accordions, dropdowns
- `role="dialog"` + `aria-modal="true"` em modais
- Ordem de tab lógica — nunca usar `tabindex > 0`

---

## PERFORMANCE DE UI

### Regras de Renderização
- Server Components por padrão — `'use client'` apenas quando necessário (interatividade, hooks de browser)
- Virtualizar listas com mais de 50 itens (`@tanstack/react-virtual`)
- Imagens: sempre `next/image` com `sizes` definido
- Fontes: `next/font` com `display: swap`, subsets apenas pt e latin

### Percepção de Velocidade
- Optimistic updates em todas as mutações (criar, completar, deletar)
- Skeleton imediato — nunca tela em branco esperando dados
- Prefetch de rotas em hover no nav da sidebar (`prefetch={true}`)
- Debounce de 300ms em buscas, 150ms em filtros

### Bundle
- Componentes pesados (editor rich-text, calendário, charts) sempre com `dynamic(() => import(...), { ssr: false })`
- Não importar bibliotecas inteiras: `import { format } from 'date-fns'` nunca `import * as dateFns`

---

## SUGESTÕES FUTURAS DE EVOLUÇÃO DO DESIGN

### Curto prazo (pós-MVP)
1. **Temas por módulo** — cada módulo com accent color própria aplicada sutil no header (agenda laranja, finanças azul)
2. **Densidade configurável** — "Compact" / "Normal" / "Relaxed" no perfil do usuário, ajusta line-height e padding de listas
3. **Modo Foco** — interface stripped, remove sidebar, mostra apenas 1 tarefa por vez

### Médio prazo
4. **Customização de sidebar** — usuário reordena módulos via drag, oculta os que não usa
5. **Wallpaper/Background do Dashboard** — imagem sutil ou gradiente personalizado no canvas raiz
6. **Animações de transição entre rotas** — View Transitions API quando suporte for amplo

### Longo prazo
7. **Light mode premium** — não é inversão do dark, é tema próprio com mesma linguagem visual
8. **Design adaptativo por contexto** — modo "planejamento" (mais espaço, menos densidade) vs modo "execução" (denso, rápido)
9. **Componentes de dados em 3D** — gráficos de progresso com profundidade leve para dashboard executivo

---

*Sistema: Apex Velocity | Versão: 2.0 | Atualizado: 2026-06-27*
