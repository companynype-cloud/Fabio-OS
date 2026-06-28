import { create } from 'zustand'

interface WorkspaceState {
  slug: string | null
  name: string | null
  plan: string | null
  setWorkspace: (data: { slug: string; name: string; plan: string }) => void
  clear: () => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  slug: null,
  name: null,
  plan: null,
  setWorkspace: (data) => set(data),
  clear: () => set({ slug: null, name: null, plan: null }),
}))
