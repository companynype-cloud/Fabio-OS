export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function generateSlug(name: string, suffix?: string): string {
  const base = slugify(name)
  return suffix ? `${base}-${suffix}` : base
}
