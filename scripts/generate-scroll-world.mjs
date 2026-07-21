import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const API_BASE = process.env.KIE_API_BASE_URL || 'https://api.kie.ai'
const UPLOAD_BASE = process.env.KIE_UPLOAD_BASE_URL || 'https://kieai.redpandaai.co'
const DEFAULT_MODEL = process.env.KIE_SEEDANCE_MODEL || 'bytedance/seedance-2'
const DEFAULT_TIMEOUT_MS = Number(process.env.KIE_TIMEOUT_MS || 15 * 60 * 1000)

async function loadLocalEnv() {
  if (process.env.KIE_API_KEY) return

  try {
    const contents = await readFile(path.join(ROOT, '.env.local'), 'utf8')
    for (const line of contents.split(/\r?\n/)) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const separator = trimmed.indexOf('=')
      if (separator < 1) continue

      const key = trimmed.slice(0, separator).trim()
      const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '')
      if (key && value && !process.env[key]) process.env[key] = value
    }
  } catch {
    // Environment variables remain the primary path; .env.local is optional.
  }
}

function usage() {
  console.log(`Usage:
  npm run scroll-world:generate -- credits
  npm run scroll-world:generate -- dive <scene-id> --start-image <path> --prompt-section "Dive 01"
  npm run scroll-world:generate -- connector <edge-id> --start-frame <path> --end-frame <path> --prompt-section "Connector 01"
  npm run scroll-world:generate -- recover <task-id> --output <path>

Optional flags:
  --output <path>       Output MP4 path. Defaults under public/media/scroll-world/video.
  --duration <seconds>  Defaults to 8s for dives and 5s for connectors.
  --resolution <tier>   480p, 720p, or 1080p. Defaults to 720p.
  --aspect-ratio <r>    Defaults to 16:9.
  --prompt-file <path>  Read the prompt from a text file instead of the prompt pack.
  --prompt-section <h>  Extract the first text code block under a prompt-pack heading.
  --dry-run             Print the task payload without uploading or generating.
`)
}

function flag(args, name, fallback = undefined) {
  const index = args.indexOf(name)
  return index === -1 ? fallback : args[index + 1]
}

function hasFlag(args, name) {
  return args.includes(name)
}

function requiredFlag(args, name) {
  const value = flag(args, name)
  if (!value) throw new Error(`Missing required flag ${name}`)
  return value
}

function absolutePath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(ROOT, filePath)
}

function mimeType(filePath) {
  const extension = path.extname(filePath).toLowerCase()
  if (extension === '.png') return 'image/png'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.mp4') return 'video/mp4'
  return 'application/octet-stream'
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function readPrompt(args) {
  const promptFile = flag(args, '--prompt-file')
  if (promptFile) return (await readFile(absolutePath(promptFile), 'utf8')).trim()

  const heading = flag(args, '--prompt-section')
  if (!heading) throw new Error('Provide --prompt-file or --prompt-section')

  const pack = await readFile(path.join(ROOT, 'docs/scroll-world/veilpix-prompt-pack.md'), 'utf8')
  const headingMatch = pack.match(new RegExp(`^###\\s+${escapeRegExp(heading)}[^\\n]*`, 'm'))
  if (!headingMatch || headingMatch.index == null) {
    throw new Error(`Prompt section not found in the prompt pack: ${heading}`)
  }

  const section = pack.slice(headingMatch.index + headingMatch[0].length)
  const codeStart = section.indexOf('```text')
  if (codeStart === -1) throw new Error(`Prompt section has no text code block: ${heading}`)
  const promptStart = codeStart + '```text'.length
  const codeEnd = section.indexOf('```', promptStart)
  if (codeEnd === -1) throw new Error(`Prompt section code block is not closed: ${heading}`)
  return section.slice(promptStart, codeEnd).trim()
}

function apiUrl(base, endpoint) {
  return endpoint.startsWith('http://') || endpoint.startsWith('https://')
    ? endpoint
    : `${base}${endpoint}`
}

async function request(base, endpoint, options = {}) {
  const apiKey = process.env.KIE_API_KEY
  if (!apiKey) {
    throw new Error('KIE_API_KEY is not set. Put it in .env.local or set it in the shell environment.')
  }

  const headers = new Headers(options.headers || {})
  headers.set('Authorization', `Bearer ${apiKey}`)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(apiUrl(base, endpoint), { ...options, headers })
  const text = await response.text()
  let body
  try {
    body = text ? JSON.parse(text) : null
  } catch {
    body = text
  }

  if (!response.ok) {
    throw new Error(`Kie.ai ${response.status}: ${typeof body === 'string' ? body : JSON.stringify(body)}`)
  }

  return body
}

async function getCredits() {
  const body = await request(API_BASE, '/api/v1/chat/credit')
  console.log(`Kie.ai credits: ${body?.data ?? 'unknown'}`)
}

async function uploadFile(filePath) {
  const resolved = absolutePath(filePath)
  const buffer = await readFile(resolved)
  const fileName = path.basename(resolved)
  const form = new FormData()
  form.append('file', new Blob([buffer], { type: mimeType(resolved) }), fileName)
  form.append('uploadPath', 'veilstudio-scroll-world')
  form.append('fileName', fileName)

  const body = await request(UPLOAD_BASE, '/api/file-stream-upload', {
    method: 'POST',
    body: form,
  })
  const url = body?.data?.fileUrl || body?.data?.downloadUrl
  if (!url) throw new Error(`Kie.ai upload did not return a usable URL for ${fileName}`)
  console.log(`Uploaded ${fileName}`)
  return url
}

function parseResultJson(value) {
  if (!value) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

function resultUrlFromTask(taskData) {
  const result = parseResultJson(taskData?.resultJson) || taskData?.resultJson || taskData
  const urls = result?.resultUrls || result?.result_urls || result?.urls
  if (Array.isArray(urls) && urls[0]) return urls[0]
  return result?.resultUrl || result?.videoUrl || result?.url || null
}

async function pollTask(taskId) {
  const startedAt = Date.now()
  let previousState = ''

  while (Date.now() - startedAt < DEFAULT_TIMEOUT_MS) {
    const body = await request(API_BASE, `/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`)
    const taskData = body?.data
    const state = taskData?.state || 'unknown'
    if (state !== previousState) {
      console.log(`Task ${taskId}: ${state}${taskData?.progress != null ? ` (${taskData.progress}%)` : ''}`)
      previousState = state
    }

    if (state === 'success') {
      const resultUrl = resultUrlFromTask(taskData)
      if (!resultUrl) throw new Error(`Task ${taskId} completed without a result URL`)
      return resultUrl
    }

    if (state === 'fail') {
      throw new Error(`Task ${taskId} failed: ${taskData?.failMsg || taskData?.failCode || 'unknown error'}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  throw new Error(`Task ${taskId} exceeded the ${Math.round(DEFAULT_TIMEOUT_MS / 60000)} minute timeout`)
}

async function downloadResult(resultUrl, outputPath) {
  const body = await request(API_BASE, '/api/v1/common/download-url', {
    method: 'POST',
    body: JSON.stringify({ url: resultUrl }),
  })
  const downloadUrl = typeof body?.data === 'string' ? body.data : body?.data?.url || body?.data?.downloadUrl
  if (!downloadUrl) throw new Error('Kie.ai did not return a temporary download URL')

  const response = await fetch(downloadUrl)
  if (!response.ok) throw new Error(`Result download failed: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const resolvedOutput = absolutePath(outputPath)
  await mkdir(path.dirname(resolvedOutput), { recursive: true })
  await writeFile(resolvedOutput, buffer)
  console.log(`Saved ${resolvedOutput} (${Math.round(buffer.length / 1024)} KB)`)
}

async function recoverTask(taskId, args) {
  const output = flag(args, '--output', `public/media/scroll-world/recovered/${taskId}.bin`)
  const body = await request(API_BASE, `/api/v1/jobs/recordInfo?taskId=${encodeURIComponent(taskId)}`)
  const taskData = body?.data
  if (taskData?.state !== 'success') {
    throw new Error(`Task ${taskId} is not complete: ${taskData?.state || 'unknown'}`)
  }

  const resultUrl = resultUrlFromTask(taskData)
  if (!resultUrl) throw new Error(`Task ${taskId} completed without a result URL`)
  await downloadResult(resultUrl, output)
}

async function generate(kind, id, args) {
  const prompt = await readPrompt(args)
  if (!prompt) throw new Error('Resolved prompt is empty')

  const duration = Number(flag(args, '--duration', kind === 'connector' ? '5' : '8'))
  const resolution = flag(args, '--resolution', '720p')
  const aspectRatio = flag(args, '--aspect-ratio', '16:9')
  const output = flag(
    args,
    '--output',
    kind === 'connector'
      ? `public/media/scroll-world/video/conn-${id}.mp4`
      : `public/media/scroll-world/video/${id}.mp4`,
  )

  const startPath = absolutePath(requiredFlag(args, kind === 'connector' ? '--start-frame' : '--start-image'))
  const endPath = kind === 'connector' ? absolutePath(requiredFlag(args, '--end-frame')) : null
  const dryRun = hasFlag(args, '--dry-run')

  const input = {
    prompt,
    first_frame_url: dryRun ? `[upload:${startPath}]` : await uploadFile(startPath),
    ...(endPath
      ? { last_frame_url: dryRun ? `[upload:${endPath}]` : await uploadFile(endPath) }
      : {}),
    duration,
    resolution,
    aspect_ratio: aspectRatio,
    generate_audio: false,
    web_search: false,
    watermark: false,
    return_last_frame: true,
  }

  const payload = { model: DEFAULT_MODEL, input }
  if (dryRun) {
    console.log(JSON.stringify({ endpoint: `${API_BASE}/api/v1/jobs/createTask`, payload }, null, 2))
    return
  }

  const task = await request(API_BASE, '/api/v1/jobs/createTask', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  const taskId = task?.data?.taskId
  if (!taskId) throw new Error(`Kie.ai did not return a task ID: ${JSON.stringify(task)}`)

  console.log(`Created ${kind} task ${taskId}`)
  const resultUrl = await pollTask(taskId)
  await downloadResult(resultUrl, output)
}

await loadLocalEnv()

const [command, kind, id, ...args] = process.argv.slice(2)
try {
  if (!command || command === '--help' || command === '-h') {
    usage()
  } else if (command === 'credits') {
    await getCredits()
  } else if (command === 'recover') {
    if (!kind) throw new Error('Usage requires a task id after recover')
    await recoverTask(kind, [id, ...args])
  } else if (command === 'dive' || command === 'connector') {
    if (!kind || !id) throw new Error(`Usage requires an id after ${command}`)
    await generate(command, kind, [id, ...args])
  } else {
    usage()
    process.exitCode = 1
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
}
