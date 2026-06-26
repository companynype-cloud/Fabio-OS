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

*Sistema: Apex Velocity | Versão: 1.0 | Criado: 2026-06-26*
