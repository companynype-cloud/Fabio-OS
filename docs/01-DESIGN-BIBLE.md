# UI BIBLE — LIFE OS

> Guia definitivo de design do sistema. Todo componente, página e interação deve seguir estas diretrizes. Inconsistência visual é um bug.

---

## FILOSOFIA DE DESIGN

O design do Life OS comunica:

- **Controle** — o usuário sente que domina sua vida
- **Velocidade** — tudo responde imediatamente
- **Clareza** — nunca confuso, nunca sobrecarregado
- **Premium** — parece caro, cuida dos detalhes

Referências primárias: **Linear**, **Raycast**, **Arc**, **Vercel**, **Superhuman**

---

## SISTEMA DE CORES

### Paleta Base (Dark Mode — padrão)

```css
/* Backgrounds */
--bg-base:        #0a0a0a;   /* fundo raiz da aplicação */
--bg-surface:     #111111;   /* cards, painéis, sidebars */
--bg-elevated:    #1a1a1a;   /* modais, dropdowns, tooltips */
--bg-overlay:     #222222;   /* hover states, seleções */

/* Borders */
--border-subtle:  #1f1f1f;   /* separadores sutis */
--border-default: #2a2a2a;   /* bordas de componentes */
--border-strong:  #3a3a3a;   /* bordas em foco */

/* Text */
--text-primary:   #efefef;   /* título, conteúdo principal */
--text-secondary: #888888;   /* labels, metadados */
--text-tertiary:  #555555;   /* placeholders, desabilitados */
--text-inverse:   #0a0a0a;   /* texto em fundos claros */

/* Brand */
--brand-primary:  #6366f1;   /* indigo-500 — cor principal */
--brand-hover:    #4f46e5;   /* indigo-600 — hover */
--brand-subtle:   #1e1b4b;   /* indigo-950 — fundo sutil */
--brand-glow:     rgba(99,102,241,0.15); /* glow suave */

/* Status */
--success:        #22c55e;   /* verde */
--warning:        #f59e0b;   /* âmbar */
--danger:         #ef4444;   /* vermelho */
--info:           #3b82f6;   /* azul */

/* Status (backgrounds sutis) */
--success-subtle: rgba(34,197,94,0.1);
--warning-subtle: rgba(245,158,11,0.1);
--danger-subtle:  rgba(239,68,68,0.1);
--info-subtle:    rgba(59,130,246,0.1);
```

### Paleta Light Mode (secundária)

```css
--bg-base:        #ffffff;
--bg-surface:     #f8f8f8;
--bg-elevated:    #f0f0f0;
--bg-overlay:     #e8e8e8;
--border-subtle:  #ececec;
--border-default: #e0e0e0;
--text-primary:   #0a0a0a;
--text-secondary: #666666;
--text-tertiary:  #aaaaaa;
```

### Cores dos Módulos

Cada módulo tem uma cor de identidade para uso em ícones e acentos:

```
Tarefas       #6366f1  indigo
Projetos      #8b5cf6  violet
Agenda        #3b82f6  blue
Reuniões      #06b6d4  cyan
WhatsApp      #22c55e  green
Emails        #f59e0b  amber
Notas         #eab308  yellow
Documentos    #f97316  orange
Hábitos       #ec4899  pink
Diário        #a855f7  purple
Saúde         #ef4444  red
Finanças      #10b981  emerald
Objetivos     #6366f1  indigo
IA            #818cf8  indigo-400
```

---

## TIPOGRAFIA

```css
/* Font Stack */
--font-sans:  'Geist', 'Inter', system-ui, sans-serif;
--font-mono:  'Geist Mono', 'JetBrains Mono', monospace;

/* Escala Tipográfica */
--text-xs:    11px / 1.4;
--text-sm:    13px / 1.5;
--text-base:  14px / 1.6;   /* padrão da interface */
--text-md:    15px / 1.6;
--text-lg:    17px / 1.4;
--text-xl:    20px / 1.3;
--text-2xl:   24px / 1.25;
--text-3xl:   30px / 1.2;
--text-4xl:   38px / 1.15;

/* Pesos */
--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
--font-bold:    700;
```

---

## ESPAÇAMENTO

Sistema baseado em múltiplos de 4px:

```
4px   — micro (entre ícone e label)
8px   — pequeno (padding interno de badge)
12px  — base (padding de botões pequenos)
16px  — médio (padding padrão de cards)
20px  — grande (espaçamento entre seções)
24px  — xl (padding de painéis)
32px  — 2xl (margem entre blocos maiores)
48px  — 3xl (espaçamento de seções de página)
64px  — 4xl (margens de layout)
```

---

## BORDAS E SOMBRAS

```css
/* Border Radius */
--radius-sm:   4px;
--radius-md:   8px;
--radius-lg:   12px;
--radius-xl:   16px;
--radius-2xl:  20px;
--radius-full: 9999px;

/* Sombras */
--shadow-sm:  0 1px 2px rgba(0,0,0,0.4);
--shadow-md:  0 4px 12px rgba(0,0,0,0.4);
--shadow-lg:  0 8px 24px rgba(0,0,0,0.5);
--shadow-xl:  0 16px 48px rgba(0,0,0,0.6);

/* Glow do brand */
--shadow-brand: 0 0 0 1px var(--brand-primary),
                0 0 20px var(--brand-glow);
```

---

## GLASSMORPHISM

Usar com moderação — apenas em modais flutuantes e Command Bar:

```css
.glass {
  background: rgba(17, 17, 17, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## COMPONENTES — PADRÕES

### Botões

```
Primary   — bg brand-primary, texto branco, hover brand-hover
Secondary — bg bg-elevated, borda border-default, hover bg-overlay
Ghost     — sem fundo, sem borda, hover bg-overlay
Danger    — bg danger-subtle, texto danger, hover bg danger com opacity
```

Tamanhos:
```
sm   — h-7  px-3 text-xs
md   — h-8  px-3 text-sm   (padrão)
lg   — h-9  px-4 text-sm
xl   — h-10 px-5 text-base
```

### Inputs

```css
height: 32px;
padding: 0 12px;
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: var(--radius-md);
font-size: 13px;
color: var(--text-primary);

/* Focus */
border-color: var(--brand-primary);
box-shadow: var(--shadow-brand);
outline: none;
```

### Cards

```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-lg);
padding: 16px;

/* Hover interativo */
&:hover {
  border-color: var(--border-default);
  background: var(--bg-elevated);
}
```

### Badges

```
default   — bg bg-elevated, texto secondary
success   — bg success-subtle, texto success
warning   — bg warning-subtle, texto warning
danger    — bg danger-subtle, texto danger
brand     — bg brand-subtle, texto brand-primary
```

---

## LAYOUT

### Sidebar

```
Largura:   240px (expandida) / 56px (colapsada)
Background: bg-surface
Border:     border-right 1px border-subtle
```

Hierarquia da sidebar:
```
[Logo / Workspace Switcher]
─────────────
[Ações rápidas: Nova tarefa, Capture, Busca]
─────────────
[Seções com ícone + label]
  ↳ Hoje
  ↳ Inbox
  ↳ Projetos
  ↳ ...
─────────────
[Seções expansíveis por módulo]
─────────────
[Footer: Perfil, Configurações, Plano]
```

### Main Content

```
max-width: 860px (conteúdo de documentos)
max-width: 1200px (dashboards, listagens)
padding: 24px 32px
```

### Command Bar (`⌘K`)

```css
/* Container */
position: fixed;
top: 20%;
left: 50%;
transform: translateX(-50%);
width: min(640px, 90vw);
background: glass;
border-radius: 16px;
box-shadow: var(--shadow-xl);
border: 1px solid var(--border-strong);

/* Input */
height: 56px;
font-size: 16px;
padding: 0 20px;
```

---

## ANIMAÇÕES

```css
/* Transições padrão */
--transition-fast:   100ms ease;
--transition-base:   150ms ease;
--transition-slow:   250ms ease;
--transition-spring: 200ms cubic-bezier(0.34, 1.56, 0.64, 1);

/* Regras */
/* Hover de cor/border:  150ms ease */
/* Aparecer/desaparecer: 150ms ease (fade) */
/* Modais e popovers:    200ms spring */
/* Sidebar:              250ms ease */
/* Page transitions:     200ms ease */
```

Framer Motion — usar apenas para:
- Entrada de modais e sheets
- Drag & drop
- Animações de lista (layout animations)
- Micro-interações de feedback (checkbox, like)

**Evitar** animações longas, bouncy excessivo, ou qualquer coisa que atrase uma ação.

---

## ÍCONES

- Biblioteca: **Lucide React** (padrão)
- Tamanhos: 14px (micro), 16px (padrão), 18px (médio), 20px (grande)
- Stroke width: 1.5px (padrão), 2px (destaque)
- Cor: sempre herdar da cor do texto pai

---

## DENSIDADE DE INFORMAÇÃO

### Modos de visualização

Toda lista principal deve suportar:

```
List    — alta densidade, 1 linha por item (padrão)
Board   — kanban, cards médios
Grid    — cards maiores, mais visual
Calendar — view de calendário
```

### Padrão de linha (modo List)

```
[checkbox] [ícone] [título principal] ... [meta 1] [meta 2] [assignee] [data]
height: 36px
padding: 0 12px
```

---

## PADRÕES DE INTERAÇÃO

### Keyboard First

Toda ação principal tem atalho:

```
⌘K          — Command Bar (global)
⌘N          — Nova tarefa/item contextual
⌘/          — Ajuda de atalhos
⌘,          — Configurações
⌘[          — Voltar
⌘]          — Avançar
⌘1-9        — Navegação entre módulos
J/K         — Navegação em listas (vim-style)
Enter       — Abrir item selecionado
E           — Edição rápida
D           — Definir data
P           — Definir prioridade
Escape      — Fechar / cancelar
```

### Hover States

- Ações secundárias (editar, deletar, mover) aparecem no hover da linha
- Nunca mostrar mais de 3 ações no hover
- Sempre incluir opção "Mais ações" (três pontos) para o resto

### Empty States

Todo estado vazio deve ter:
- Ícone contextual (suave, 40px)
- Título curto e encorajador
- Subtítulo explicativo (1 linha)
- CTA opcional

---

## RESPONSIVIDADE

```
Mobile:   < 768px   — navegação em bottom bar, sidebar oculta
Tablet:   768-1024px — sidebar colapsada por padrão
Desktop:  > 1024px  — sidebar expandida, layout completo
Wide:     > 1440px  — max-width no conteúdo central
```

### Mobile — prioridades
- Bottom navigation com 5 itens principais
- Swipe gestures em listas
- FAB (Floating Action Button) para capture rápido
- Sheets em vez de modais
- Touch targets mínimo 44px

---

## ACESSIBILIDADE

- Contraste mínimo AA (4.5:1 para texto normal, 3:1 para texto grande)
- Focus visible em todos os elementos interativos
- ARIA labels em ícones sem texto
- Navegação por teclado completa
- `prefers-reduced-motion` respeitar para animações

---

*Versão: 1.0 | Criado: 2026-06-26*
