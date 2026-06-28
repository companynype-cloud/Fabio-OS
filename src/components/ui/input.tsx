import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-on-surface text-xs font-medium">
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={cn(
            'border-border bg-surface-base text-on-surface placeholder:text-muted-foreground flex h-8 w-full rounded border px-3 text-sm',
            'transition-colors duration-150',
            'focus:border-primary focus:ring-primary focus:ring-1 focus:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-danger text-xs">{error}</p>}
        {hint && !error && <p className="text-muted-foreground text-xs">{hint}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
