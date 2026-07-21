import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import ffmpegPath from 'ffmpeg-static'
import ffprobeStatic from 'ffprobe-static'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW = path.join(ROOT, 'tmp', 'scroll-world', 'raw')
const QA = path.join(ROOT, 'tmp', 'scroll-world', 'qa')
const MEDIA = path.join(ROOT, 'public', 'media', 'scroll-world')
const VIDEO = path.join(MEDIA, 'video')
const POSTERS = path.join(MEDIA, 'posters')
const WEB_STILLS = path.join(MEDIA, 'stills', 'web')
const FINALE_SCENE_ID = '04-badger-sea'

const ffprobePath = ffprobeStatic.path

const scenes = [
  {
    id: '01-observatory-exterior',
    still: '01-observatory-exterior-right.png',
  },
  {
    id: '02-observatory-study',
    still: '02-observatory-study-left.png',
  },
  {
    id: '03-floating-atelier',
    still: '03-floating-atelier-right.png',
  },
  {
    id: '04-badger-sea',
    still: '04-badger-sea-left.png',
  },
]

const connectorEdges = [
  { id: 'conn-01-02', from: '01-observatory-exterior', to: '02-observatory-study' },
  { id: 'conn-02-03', from: '02-observatory-study', to: '03-floating-atelier' },
  {
    id: 'conn-03-04',
    from: '03-floating-atelier',
    to: '04-badger-sea',
    endFadeOffset: 4.75,
  },
]
const connectors = connectorEdges.map((edge) => edge.id)
const chain = [
  '01-observatory-exterior',
  'conn-01-02',
  '02-observatory-study',
  'conn-02-03',
  '03-floating-atelier',
  'conn-03-04',
  '04-badger-sea',
]

function run(bin, args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, {
      cwd: ROOT,
      windowsHide: true,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    })

    let stdout = ''
    let stderr = ''
    if (capture) {
      child.stdout.on('data', (chunk) => { stdout += chunk })
      child.stderr.on('data', (chunk) => { stderr += chunk })
    }

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve({ stdout, stderr })
      else reject(new Error(`${path.basename(bin)} exited with code ${code}\n${stderr}`))
    })
  })
}

async function exists(filePath) {
  try {
    return (await stat(filePath)).size > 0
  } catch {
    return false
  }
}

async function ensureInputs() {
  const missing = []
  for (const id of [...scenes.map((scene) => scene.id), ...connectors]) {
    const source = path.join(RAW, `${id}.mp4`)
    if (!(await exists(source))) missing.push(path.relative(ROOT, source))
  }
  if (missing.length) throw new Error(`Missing raw clips:\n${missing.join('\n')}`)
}

async function probe(filePath) {
  const { stdout } = await run(ffprobePath, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,r_frame_rate,codec_name:format=duration,size',
    '-of', 'json',
    filePath,
  ], { capture: true })
  return JSON.parse(stdout)
}

async function encodeClip(id, { mobile = false } = {}) {
  const input = path.join(RAW, `${id}.mp4`)
  const output = path.join(VIDEO, `${id}${mobile ? '-m' : ''}.mp4`)
  const height = mobile ? 540 : 720
  const crf = id === '03-floating-atelier'
    ? (mobile ? 27 : 25)
    : (mobile ? 25 : 22)
  const gop = mobile ? 4 : 8
  const sharpen = mobile ? '0.35' : '0.55'

  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', input,
    '-an',
    '-vf', `scale=-2:${height}:flags=lanczos,unsharp=5:5:${sharpen}:5:5:0.0`,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'main',
    '-g', String(gop),
    '-keyint_min', String(gop),
    '-sc_threshold', '0',
    '-movflags', '+faststart',
    output,
  ])

  const info = await probe(output)
  const bytes = Number(info.format?.size || 0)
  console.log(`${path.basename(output)} ${(bytes / 1024 / 1024).toFixed(2)} MB`)
}

async function encodeLockedConnector(edge, { mobile = false } = {}) {
  const suffix = mobile ? '-m' : ''
  const height = mobile ? 540 : 720
  const crf = mobile ? 25 : 22
  const gop = mobile ? 4 : 8
  const sharpen = mobile ? '0.35' : '0.55'
  const input = path.join(RAW, `${edge.id}.mp4`)
  const fromVideo = path.join(VIDEO, `${edge.from}${suffix}.mp4`)
  const toVideo = path.join(VIDEO, `${edge.to}${suffix}.mp4`)
  const output = path.join(VIDEO, `${edge.id}${suffix}.mp4`)
  const inputInfo = await probe(input)
  const inputDuration = Number(inputInfo.format?.duration || 5)

  // Seedance follows the supplied endpoints compositionally but may repaint their
  // pixels. Blend five frames from the exact encoded neighbors into the generated
  // connector, leaving two exact frames at either edge for a frame-clean scrub seam.
  const endpointDuration = 0.3
  const fadeDuration = 5 / 24
  const firstOffset = 2 / 24
  const firstResultDuration = endpointDuration + inputDuration - fadeDuration
  const secondOffset = Number.isFinite(edge.endFadeOffset)
    ? edge.endFadeOffset
    : firstResultDuration - fadeDuration
  const filter = [
    `[0:v]trim=start_frame=0:end_frame=1,setpts=PTS-STARTPTS,scale=-2:${height}:flags=lanczos,fps=24,format=yuv420p,settb=AVTB,tpad=stop_mode=clone:stop_duration=${endpointDuration},trim=duration=${endpointDuration}[a]`,
    `[1:v]scale=-2:${height}:flags=lanczos,unsharp=5:5:${sharpen}:5:5:0.0,fps=24,format=yuv420p,settb=AVTB,trim=duration=${inputDuration},setpts=PTS-STARTPTS[b]`,
    `[2:v]trim=start_frame=0:end_frame=1,setpts=PTS-STARTPTS,scale=-2:${height}:flags=lanczos,fps=24,format=yuv420p,settb=AVTB,tpad=stop_mode=clone:stop_duration=${endpointDuration},trim=duration=${endpointDuration}[c]`,
    `[a][b]xfade=transition=fade:duration=${fadeDuration}:offset=${firstOffset}[ab]`,
    `[ab][c]xfade=transition=fade:duration=${fadeDuration}:offset=${secondOffset}[out]`,
  ]

  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    // Feed decoded neighboring video frames directly. A PNG round-trip shifts the
    // limited-range luma and caused a dark flash at the final Badger handoff.
    '-sseof', '-0.06', '-i', fromVideo,
    '-i', input,
    '-i', toVideo,
    '-filter_complex', filter.join(';'),
    '-map', '[out]',
    '-an',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', String(crf),
    '-pix_fmt', 'yuv420p',
    '-profile:v', 'main',
    '-g', String(gop),
    '-keyint_min', String(gop),
    '-sc_threshold', '0',
    '-movflags', '+faststart',
    '-shortest',
    output,
  ])

  const info = await probe(output)
  const bytes = Number(info.format?.size || 0)
  console.log(`${path.basename(output)} ${(bytes / 1024 / 1024).toFixed(2)} MB endpoint-locked`)
}

async function encodeAll() {
  await ensureInputs()
  await Promise.all([mkdir(VIDEO, { recursive: true }), mkdir(QA, { recursive: true })])
  for (const scene of scenes) {
    await encodeClip(scene.id)
    await encodeClip(scene.id, { mobile: true })
  }
  for (const edge of connectorEdges) {
    await encodeLockedConnector(edge)
    await encodeLockedConnector(edge, { mobile: true })
  }
}

async function makePoster(id, { mobile = false } = {}) {
  const suffix = mobile ? '-m' : ''
  const input = path.join(VIDEO, `${id}${suffix}.mp4`)
  const output = path.join(POSTERS, `${id}${suffix}.webp`)
  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-ss', '0', '-i', input,
    '-frames:v', '1',
    '-c:v', 'libwebp',
    '-quality', mobile ? '78' : '82',
    '-compression_level', '6',
    output,
  ])
}

async function makePosters() {
  await mkdir(POSTERS, { recursive: true })
  for (const id of chain) {
    await makePoster(id)
    await makePoster(id, { mobile: true })
  }
  await makeFinaleFrames()
}

async function makeFinaleFrame({ mobile = false } = {}) {
  const suffix = mobile ? '-m' : ''
  const input = path.join(VIDEO, `${FINALE_SCENE_ID}${suffix}.mp4`)
  const output = path.join(POSTERS, `${FINALE_SCENE_ID}-end${suffix}.webp`)
  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-sseof', '-0.06', '-i', input,
    '-frames:v', '1',
    '-c:v', 'libwebp',
    '-quality', mobile ? '88' : '92',
    '-compression_level', '6',
    output,
  ])
  const bytes = (await stat(output)).size
  console.log(`${path.basename(output)} ${(bytes / 1024).toFixed(0)} KB finale frame`)
}

async function makeFinaleFrames() {
  await mkdir(POSTERS, { recursive: true })
  await makeFinaleFrame()
  await makeFinaleFrame({ mobile: true })
}

async function makeWebStills() {
  await mkdir(WEB_STILLS, { recursive: true })
  for (const scene of scenes) {
    const input = path.join(MEDIA, 'stills', scene.still)
    const output = path.join(WEB_STILLS, `${scene.id}.webp`)
    await run(ffmpegPath, [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', input,
      '-vf', 'scale=1536:-2:flags=lanczos',
      '-frames:v', '1',
      '-c:v', 'libwebp',
      '-quality', '82',
      '-compression_level', '6',
      output,
    ])
    const bytes = (await stat(output)).size
    console.log(`${path.basename(output)} ${(bytes / 1024).toFixed(0)} KB`)
  }
}

async function extractFrame(input, output, { last = false } = {}) {
  const seek = last ? ['-sseof', '-0.06'] : ['-ss', '0']
  await run(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-y',
    ...seek, '-i', input,
    '-frames:v', '1',
    output,
  ])
}

async function seamScore(fileA, fileB, label) {
  const a = path.join(QA, `${label}-a.png`)
  const b = path.join(QA, `${label}-b.png`)
  await extractFrame(fileA, a, { last: true })
  await extractFrame(fileB, b)
  const { stderr } = await run(ffmpegPath, [
    '-hide_banner', '-i', a, '-i', b,
    '-lavfi', 'ssim',
    '-f', 'null', '-',
  ], { capture: true })
  const match = stderr.match(/All:([0-9.]+)/)
  const score = match ? Number(match[1]) : 0
  return {
    label,
    score,
    status: score >= 0.9 ? 'pass' : score >= 0.75 ? 'warn' : 'fail',
  }
}

async function checkSeams() {
  await mkdir(QA, { recursive: true })
  const results = []
  for (const { tier, suffix } of [{ tier: 'desktop', suffix: '' }, { tier: 'mobile', suffix: '-m' }]) {
    for (let index = 0; index < chain.length - 1; index += 1) {
      const from = chain[index]
      const to = chain[index + 1]
      results.push(await seamScore(
        path.join(VIDEO, `${from}${suffix}.mp4`),
        path.join(VIDEO, `${to}${suffix}.mp4`),
        `${tier}:${from}--${to}`,
      ))
    }
  }
  const report = {
    generatedAt: new Date().toISOString(),
    threshold: { pass: 0.9, warn: 0.75 },
    results,
  }
  await writeFile(path.join(QA, 'seam-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  results.forEach((result) => {
    console.log(`${result.status.toUpperCase().padEnd(4)} ${result.score.toFixed(6)} ${result.label}`)
  })
  if (results.some((result) => result.status === 'fail')) process.exitCode = 2
  return report
}

async function checkFinaleFrames() {
  await mkdir(QA, { recursive: true })
  const results = []
  for (const { tier, suffix } of [{ tier: 'desktop', suffix: '' }, { tier: 'mobile', suffix: '-m' }]) {
    const source = path.join(VIDEO, `${FINALE_SCENE_ID}${suffix}.mp4`)
    const frame = path.join(POSTERS, `${FINALE_SCENE_ID}-end${suffix}.webp`)
    const exact = path.join(QA, `finale-${tier}-source.png`)
    await extractFrame(source, exact, { last: true })
    const { stderr } = await run(ffmpegPath, [
      '-hide_banner', '-i', exact, '-i', frame,
      '-filter_complex', '[0:v]format=yuv420p[reference];[1:v]format=yuv420p[candidate];[reference][candidate]ssim',
      '-f', 'null', '-',
    ], { capture: true })
    const match = stderr.match(/All:([0-9.]+)/)
    const score = match ? Number(match[1]) : 0
    const result = { tier, score, status: score >= 0.95 ? 'pass' : 'fail' }
    results.push(result)
    console.log(`${result.status.toUpperCase().padEnd(4)} ${score.toFixed(6)} ${tier}:badger-video--pupil-frame`)
  }
  if (results.some((result) => result.status === 'fail')) process.exitCode = 2
  return results
}

async function writeManifest() {
  const files = []
  for (const id of chain) {
    const desktop = path.join(VIDEO, `${id}.mp4`)
    const mobile = path.join(VIDEO, `${id}-m.mp4`)
    const desktopInfo = await probe(desktop)
    const mobileInfo = await probe(mobile)
    files.push({
      id,
      desktopBytes: Number(desktopInfo.format?.size || 0),
      mobileBytes: Number(mobileInfo.format?.size || 0),
      duration: Number(desktopInfo.format?.duration || 0),
      width: Number(desktopInfo.streams?.[0]?.width || 0),
      height: Number(desktopInfo.streams?.[0]?.height || 0),
    })
  }
  const finaleFrames = []
  for (const { tier, suffix } of [{ tier: 'desktop', suffix: '' }, { tier: 'mobile', suffix: '-m' }]) {
    const file = path.join(POSTERS, `${FINALE_SCENE_ID}-end${suffix}.webp`)
    if (await exists(file)) {
      const info = await probe(file)
      finaleFrames.push({
        tier,
        bytes: (await stat(file)).size,
        width: Number(info.streams?.[0]?.width || 0),
        height: Number(info.streams?.[0]?.height || 0),
      })
    }
  }
  await writeFile(
    path.join(MEDIA, 'asset-manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), files, finaleFrames }, null, 2)}\n`,
  )
}

async function optimizeAtelier() {
  const atelier = '03-floating-atelier'
  const affectedEdges = connectorEdges.filter((edge) => edge.from === atelier || edge.to === atelier)
  const changedIds = [...affectedEdges.slice(0, 1).map((edge) => edge.id), atelier, ...affectedEdges.slice(1).map((edge) => edge.id)]

  await Promise.all([mkdir(VIDEO, { recursive: true }), mkdir(POSTERS, { recursive: true }), mkdir(QA, { recursive: true })])
  await encodeClip(atelier)
  await encodeClip(atelier, { mobile: true })

  for (const edge of affectedEdges) {
    await encodeLockedConnector(edge)
    await encodeLockedConnector(edge, { mobile: true })
  }

  for (const id of changedIds) {
    await makePoster(id)
    await makePoster(id, { mobile: true })
  }

  await checkSeams()
  await writeManifest()
}

async function main() {
  const command = process.argv[2] || 'all'
  if (!ffmpegPath || !ffprobePath) throw new Error('Project-local FFmpeg tooling is unavailable')

  if (command === 'encode') await encodeAll()
  else if (command === 'posters') {
    await makePosters()
    await checkFinaleFrames()
  }
  else if (command === 'stills') await makeWebStills()
  else if (command === 'seams') await checkSeams()
  else if (command === 'finale') {
    await makeFinaleFrames()
    await checkFinaleFrames()
    await writeManifest()
  }
  else if (command === 'optimize-atelier') await optimizeAtelier()
  else if (command === 'all') {
    await encodeAll()
    await makePosters()
    await makeWebStills()
    await checkSeams()
    await checkFinaleFrames()
    await writeManifest()
  } else {
    throw new Error('Usage: npm run scroll-world:process -- [all|encode|posters|stills|seams|finale|optimize-atelier]')
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
