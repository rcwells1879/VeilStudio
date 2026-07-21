import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
const PORT = Number(process.env.PORT || 4173)
const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const requested = decoded === '/' ? '/scroll-world-preview/' : decoded
  const relative = requested.replace(/^\/+/, '')
  const resolved = path.resolve(ROOT, relative)
  return resolved.startsWith(ROOT) ? resolved : null
}

const server = http.createServer(async (request, response) => {
  try {
    let filePath = safePath(request.url || '/')
    if (!filePath) throw new Error('Invalid path')
    let info = await stat(filePath)
    if (info.isDirectory()) {
      filePath = path.join(filePath, 'index.html')
      info = await stat(filePath)
    }

    const type = MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
    response.writeHead(200, {
      'Content-Type': type,
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(filePath).pipe(response)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`VeilStudio scroll-world preview: http://127.0.0.1:${PORT}/scroll-world-preview/`)
})
