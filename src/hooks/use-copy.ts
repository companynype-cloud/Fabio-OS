'use client'

import * as React from 'react'

export function useCopy(timeout = 2000) {
  const [copied, setCopied] = React.useState(false)

  async function copy(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), timeout)
  }

  return { copy, copied }
}
