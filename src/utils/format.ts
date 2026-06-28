const ptBR = 'pt-BR'

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(ptBR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(ptBR, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const rtf = new Intl.RelativeTimeFormat(ptBR, { numeric: 'auto' })
  const diffMs = d.getTime() - Date.now()
  const diffDays = Math.round(diffMs / 86_400_000)
  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / 3_600_000)
    if (Math.abs(diffHours) < 1) return rtf.format(Math.round(diffMs / 60_000), 'minute')
    return rtf.format(diffHours, 'hour')
  }
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day')
  return formatDate(d)
}

export function formatCurrency(value: number | null | undefined, currency = 'BRL'): string {
  if (value == null) return '—'
  return new Intl.NumberFormat(ptBR, { style: 'currency', currency }).format(value)
}

export function formatNumber(value: number | null | undefined): string {
  if (value == null) return '—'
  return new Intl.NumberFormat(ptBR).format(value)
}

export function formatPercent(value: number | null | undefined, decimals = 0): string {
  if (value == null) return '—'
  return new Intl.NumberFormat(ptBR, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100)
}

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max - 1) + '…'
}

export function initials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
