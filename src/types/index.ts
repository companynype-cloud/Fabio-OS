export type { User, Session } from '@/lib/auth'

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST'
export type Plan = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE'
export type TaskStatus = 'INBOX' | 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'
export type Priority = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type ProjectStatus = 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
export type HabitFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY'
export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'ABANDONED' | 'PAUSED'

export interface ActiveWorkspace {
  id: string
  slug: string
  name: string
  plan: Plan
  role: WorkspaceRole
}
