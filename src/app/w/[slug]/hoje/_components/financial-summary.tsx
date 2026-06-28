import Link from 'next/link'
import { Widget } from './widget'
import { formatCurrency } from '@/utils/format'
import { cn } from '@/lib/utils'

interface FinancialSummaryProps {
  workspaceSlug: string
}

const MOCK_FINANCE = {
  balance: 12_450.0,
  monthIncome: 8_200.0,
  monthExpense: 3_750.25,
  monthBudget: 5_000.0,
  recentTransactions: [
    { id: '1', title: 'Supermercado', amount: -285.5, type: 'EXPENSE' as const },
    { id: '2', title: 'Salário', amount: 8200, type: 'INCOME' as const },
    { id: '3', title: 'Netflix', amount: -55.9, type: 'EXPENSE' as const },
  ],
}

export function FinancialSummary({ workspaceSlug }: FinancialSummaryProps) {
  const data = MOCK_FINANCE
  const spent = data.monthExpense
  const budget = data.monthBudget
  const pct = Math.min((spent / budget) * 100, 100)
  const overBudget = spent > budget

  const action = (
    <Link
      href={`/w/${workspaceSlug}/financas`}
      className="text-xs text-[var(--outline)] transition-colors hover:text-[var(--foreground)]"
    >
      Ver finanças →
    </Link>
  )

  return (
    <Widget title="Resumo financeiro" action={action}>
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-[var(--outline)]">Saldo total</p>
            <p className="mt-0.5 text-lg font-semibold">{formatCurrency(data.balance)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--outline)]">Receita do mês</p>
            <p className="mt-0.5 text-lg font-semibold text-green-400">
              +{formatCurrency(data.monthIncome)}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs text-[var(--outline)]">Gastos do mês</span>
            <span
              className={cn(
                'font-mono text-xs',
                overBudget ? 'text-red-400' : 'text-[var(--outline)]'
              )}
            >
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface-high)]">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                overBudget ? 'bg-red-500' : 'bg-green-500'
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          {data.recentTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between">
              <span className="flex-1 truncate text-xs text-[var(--outline)]">{tx.title}</span>
              <span
                className={cn(
                  'ml-2 flex-shrink-0 font-mono text-xs',
                  tx.type === 'INCOME' ? 'text-green-400' : 'text-[var(--foreground)]'
                )}
              >
                {tx.type === 'INCOME' ? '+' : ''}
                {formatCurrency(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}

export function FinancialSummarySkeleton() {
  return (
    <Widget title="Resumo financeiro">
      <div className="animate-pulse space-y-4 p-4">
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 rounded bg-[var(--surface-high)]" />
              <div className="h-6 w-28 rounded bg-[var(--surface-high)]" />
            </div>
          ))}
        </div>
        <div className="h-1.5 rounded-full bg-[var(--surface-high)]" />
        <div className="space-y-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-3 w-24 rounded bg-[var(--surface-high)]" />
              <div className="h-3 w-16 rounded bg-[var(--surface-high)]" />
            </div>
          ))}
        </div>
      </div>
    </Widget>
  )
}
