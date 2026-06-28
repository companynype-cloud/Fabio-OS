interface GreetingProps {
  name: string
  date: string
  greeting: string
}

export function Greeting({ name, date, greeting }: GreetingProps) {
  const firstName = name.split(' ')[0]

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">
        {greeting}, {firstName}.
      </h1>
      <p className="text-sm text-[var(--outline)] capitalize">{date}</p>
    </div>
  )
}
