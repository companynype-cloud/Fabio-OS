'use client'

import { useWorkspaceStore } from '@/stores/workspace.store'

export function useWorkspace() {
  const { slug, name, plan, setWorkspace, clear } = useWorkspaceStore()
  return { slug, name, plan, setWorkspace, clear }
}
