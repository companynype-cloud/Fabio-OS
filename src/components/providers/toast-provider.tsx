'use client'

import { Toaster } from 'sonner'

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      toastOptions={{
        style: {
          background: '#2a2a2a',
          border: '1px solid #353534',
          color: '#e5e2e1',
          fontSize: '13px',
        },
      }}
    />
  )
}
