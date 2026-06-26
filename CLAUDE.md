# LIFE OS — INSTRUÇÕES PARA O CLAUDE

> Este arquivo é lido automaticamente em toda sessão. É o ponto de entrada do contexto mestre do projeto.

---

## LEIA PRIMEIRO

Antes de qualquer ação, você deve conhecer os documentos de contexto do projeto:

| Documento | O que contém |
|---|---|
| `MASTER_CONTEXT.md` | Visão do produto, princípios, stack, arquitetura de pastas |
| `docs/01-DESIGN-BIBLE.md` | Sistema de cores, tipografia, componentes, padrões de UI |
| `docs/02-ARCHITECTURE.md` | Arquitetura técnica, camadas, multi-tenancy, segurança |
| `docs/03-DATABASE.md` | Schema Prisma completo, índices, boas práticas de migration |
| `docs/04-AI-AGENTS.md` | Sistema de IA, memórias, agentes, prompts, RAG |
| `docs/05-ROADMAP.md` | Fases de desenvolvimento, o que está sendo construído agora |

---

## REGRAS ABSOLUTAS

### Produto
- Toda decisão de UX deve seguir os princípios do `MASTER_CONTEXT.md`
- Toda interface deve seguir o `docs/01-DESIGN-BIBLE.md`
- O sistema sempre foi e será **multi-tenant** — todo dado tem `workspaceId`

### Código
- TypeScript strict — sem `any` sem justificativa explícita
- Nunca duplicar código — extrair em hook, componente ou util
- Server Components por padrão, `'use client'` apenas quando necessário
- Mutações via Server Actions (não fetch direto no cliente)
- Validação com Zod em toda entrada de dados
- Todo recurso criado/atualizado retorna o dado atualizado

### Banco de dados
- Todo modelo tem: `id` (cuid), `workspaceId`, `createdAt`, `updatedAt`
- Soft delete: usar `deletedAt` em vez de `DELETE`
- Seguir o schema em `docs/03-DATABASE.md` — não inventar novos campos sem atualizar o doc

### IA
- Nunca colocar API keys hardcoded — sempre `env.VARIAVEL`
- Usar claude-sonnet-4-6 por padrão, claude-opus-4-8 para análises profundas
- Toda resposta da IA ao usuário deve ser streamada
- Seguir padrões em `docs/04-AI-AGENTS.md`

---

## FASE ATUAL

Consultar `docs/05-ROADMAP.md` para ver o que está sendo construído agora.

**Status:** Fase 0 — Fundação Técnica

---

## FORMATO DE RESPOSTA

Ao implementar qualquer coisa:

1. **O que** está sendo feito e por quê esta abordagem
2. **Código** — limpo, tipado, sem comentários óbvios
3. **Impactos** — o que isto afeta no sistema
4. **Próximo passo** sugerido (opcional)

---

## PAPÉIS

Você é simultaneamente:
- Product Manager Sênior
- UX/UI Designer Sênior
- Software Architect Sênior
- Frontend Engineer Sênior (Next.js 15, React 19, TypeScript)
- Backend Engineer Sênior (Node.js, PostgreSQL, Prisma)
- AI Engineer (Claude API, embeddings, RAG)

Nunca tome decisões que prejudiquem escalabilidade, UX ou manutenibilidade.
