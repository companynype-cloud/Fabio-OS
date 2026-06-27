import {
  Home,
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Video,
  Lightbulb,
  FileText,
  Activity,
  BookOpen,
  Wallet,
  Target,
  RefreshCw,
  Bot,
  Puzzle,
  Settings,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

export interface NavGroup {
  id: string
  label?: string
  items: NavItem[]
}

export function getNavGroups(workspaceSlug: string): NavGroup[] {
  const w = `/w/${workspaceSlug}`

  return [
    {
      id: 'home',
      items: [
        { id: 'hoje', label: 'Hoje', href: `${w}/hoje`, icon: Home },
        { id: 'dashboard', label: 'Dashboard', href: `${w}/dashboard`, icon: LayoutDashboard },
      ],
    },
    {
      id: 'execution',
      label: 'Execução',
      items: [
        { id: 'tasks', label: 'Tarefas', href: `${w}/tarefas`, icon: CheckSquare },
        { id: 'projects', label: 'Projetos', href: `${w}/projetos`, icon: FolderKanban },
        { id: 'calendar', label: 'Agenda', href: `${w}/agenda`, icon: Calendar },
        { id: 'meetings', label: 'Reuniões', href: `${w}/reunioes`, icon: Video },
      ],
    },
    {
      id: 'knowledge',
      label: 'Conhecimento',
      items: [
        { id: 'ideas', label: 'Ideias', href: `${w}/ideias`, icon: Lightbulb },
        { id: 'notes', label: 'Notas', href: `${w}/notas`, icon: FileText },
      ],
    },
    {
      id: 'personal',
      label: 'Pessoal',
      items: [
        { id: 'habits', label: 'Hábitos', href: `${w}/habitos`, icon: Activity },
        { id: 'journal', label: 'Diário', href: `${w}/diario`, icon: BookOpen },
      ],
    },
    {
      id: 'financial',
      label: 'Financeiro',
      items: [{ id: 'finances', label: 'Finanças', href: `${w}/financas`, icon: Wallet }],
    },
    {
      id: 'growth',
      label: 'Crescimento',
      items: [
        { id: 'goals', label: 'Objetivos', href: `${w}/objetivos`, icon: Target },
        { id: 'weekly', label: 'Revisão Semanal', href: `${w}/revisao`, icon: RefreshCw },
      ],
    },
    {
      id: 'ai',
      label: 'IA',
      items: [{ id: 'assistant', label: 'Assistente', href: `${w}/assistente`, icon: Bot }],
    },
    {
      id: 'system',
      label: 'Sistema',
      items: [
        { id: 'integrations', label: 'Integrações', href: `${w}/integracoes`, icon: Puzzle },
        { id: 'settings', label: 'Configurações', href: `${w}/configuracoes`, icon: Settings },
      ],
    },
  ]
}
