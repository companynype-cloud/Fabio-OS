import { createServer } from 'http'
import { readFileSync, existsSync } from 'fs'
import { marked } from 'marked'
import { join, resolve } from 'path'

const ROOT = resolve(import.meta.dirname)

const FILES = {
  '/':               'docs/00-CTO-ARCHITECTURE.md',
  '/master':         'MASTER_CONTEXT.md',
  '/design':         'docs/01-DESIGN-BIBLE.md',
  '/architecture':   'docs/02-ARCHITECTURE.md',
  '/database':       'docs/03-DATABASE.md',
  '/ai':             'docs/04-AI-AGENTS.md',
  '/roadmap':        'docs/05-ROADMAP.md',
}

const NAV = `
<nav style="position:sticky;top:0;z-index:100;background:#0e0e0e;border-bottom:1px solid #2a2a2a;padding:12px 32px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
  <span style="color:#dc2626;font-weight:700;font-family:monospace;margin-right:16px">LIFE OS DOCS</span>
  ${Object.entries({
    '/': '00 · CTO Arch',
    '/master': 'Master Context',
    '/design': '01 · Design Bible',
    '/architecture': '02 · Architecture',
    '/database': '03 · Database',
    '/ai': '04 · AI Agents',
    '/roadmap': '05 · Roadmap',
  }).map(([href, label]) =>
    `<a href="${href}" style="color:#e6bdb8;text-decoration:none;font-size:13px;padding:4px 10px;border-radius:4px;border:1px solid #2a2a2a;font-family:monospace">${label}</a>`
  ).join('')}
</nav>`

const HTML = (title, body) => `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} — Life OS</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
  body { background: #0e0e0e; color: #e5e2e1; font-family: -apple-system, 'Geist', sans-serif; line-height: 1.7; }
  .content { max-width: 860px; margin: 0 auto; padding: 48px 32px 96px; }
  h1 { font-size: 2rem; font-weight: 700; color: #fff; margin: 48px 0 16px; letter-spacing: -0.02em; border-bottom: 1px solid #2a2a2a; padding-bottom: 12px; }
  h2 { font-size: 1.35rem; font-weight: 600; color: #fff; margin: 40px 0 12px; letter-spacing: -0.01em; }
  h3 { font-size: 1.05rem; font-weight: 600; color: #e5e2e1; margin: 28px 0 8px; }
  h4 { font-size: 0.95rem; font-weight: 600; color: #c8c6c5; margin: 20px 0 6px; }
  p { margin-bottom: 14px; color: #c8c6c5; font-size: 15px; }
  a { color: #ffb4ab; }
  pre { background: #131313; border: 1px solid #2a2a2a; border-radius: 8px; padding: 20px; overflow-x: auto; margin: 16px 0; }
  code { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #e6bdb8; background: #1c1b1b; padding: 2px 6px; border-radius: 4px; }
  pre code { background: none; padding: 0; color: #ccc5c1; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
  th { background: #1c1b1b; color: #e5e2e1; text-align: left; padding: 10px 14px; border: 1px solid #2a2a2a; font-weight: 600; }
  td { padding: 8px 14px; border: 1px solid #2a2a2a; color: #c8c6c5; vertical-align: top; }
  tr:nth-child(even) td { background: #131313; }
  ul, ol { margin: 8px 0 14px 24px; color: #c8c6c5; font-size: 15px; }
  li { margin-bottom: 4px; }
  blockquote { border-left: 3px solid #dc2626; padding-left: 16px; color: #ac8884; font-style: italic; margin: 16px 0; }
  hr { border: none; border-top: 1px solid #2a2a2a; margin: 32px 0; }
  strong { color: #fff; }
  em { color: #e6bdb8; }
  input[type=checkbox] { accent-color: #dc2626; margin-right: 8px; }
</style>
</head>
<body>
${NAV}
<div class="content">${body}</div>
</body>
</html>`

const server = createServer((req, res) => {
  const url = req.url.split('?')[0]
  const file = FILES[url]

  if (!file) {
    res.writeHead(302, { Location: '/' })
    return res.end()
  }

  const path = join(ROOT, file)
  if (!existsSync(path)) {
    res.writeHead(404)
    return res.end('Not found')
  }

  const md = readFileSync(path, 'utf-8')
  const body = marked.parse(md)
  const title = file.split('/').pop().replace('.md', '')

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
  res.end(HTML(title, body))
})

server.listen(3333, '0.0.0.0', () => {
  console.log('Preview server running at http://localhost:3333')
})
