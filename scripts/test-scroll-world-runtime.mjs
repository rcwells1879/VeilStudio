import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'

const source = readFileSync(new URL('../public/scroll-world/scroll-world.js', import.meta.url), 'utf8')

// Exercise the production handlers with controllable media promises. This lets
// us reproduce mobile event races without relying on desktop autoplay policy.
function runtimeFunction(name) {
  const start = source.indexOf(`function ${name}(`)
  assert.ok(start >= 0, `Missing runtime function: ${name}`)
  const end = source.indexOf('\nfunction ', start + 1)
  return source.slice(start, end)
}

function makeHarness() {
  const context = {
    coarsePointer: true,
    compactViewport: { matches: true },
    stillsOnly: false,
    userReady: false,
    segments: [],
    stillsFallbacks: 0,
    revoked: [],
    enableMedia() {},
    enterStillsMode() { context.stillsOnly = true; context.stillsFallbacks += 1 },
    URL: { revokeObjectURL(url) { context.revoked.push(url) } },
  }
  vm.createContext(context)
  for (const name of ['primeVideo', 'onMediaGesture', 'seekVideo', 'snapSegmentTime', 'revealVideoFrame', 'releaseVideos', 'clamp']) {
    vm.runInContext(runtimeFunction(name), context)
  }
  return context
}

function makeSegment() {
  const pending = []
  const writes = []
  const classes = new Set()
  let time = 0
  const video = {
    duration: 8,
    readyState: 2,
    seeking: false,
    pauses: 0,
    get currentTime() { return time },
    set currentTime(value) { time = value; writes.push(value); this.seeking = true },
    play() { return new Promise((resolve, reject) => pending.push({ resolve, reject })) },
    pause() { this.pauses += 1 },
  }
  return {
    video,
    ready: true,
    visible: true,
    priming: false,
    primed: false,
    primeNeedsGesture: false,
    current: 0,
    target: 0,
    element: { classList: { add(name) { classes.add(name) } } },
    pending,
    writes,
    classes,
  }
}

const flush = () => new Promise(resolve => setImmediate(resolve))
const mediaError = name => Object.assign(new Error(name), { name })

test('overlapping gestures and media events start only one warm-up', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.segments.push(segment)
  runtime.onMediaGesture()
  runtime.primeVideo(segment)
  runtime.onMediaGesture()
  assert.equal(segment.pending.length, 1)
  segment.pending[0].resolve()
  await flush()
  runtime.primeVideo(segment)
  runtime.onMediaGesture()
  assert.equal(segment.pending.length, 1)
  assert.equal(segment.video.pauses, 1)
  assert.equal(segment.primed, true)
  assert.equal(runtime.stillsFallbacks, 0)
})

test('an interrupted play does not disable animation and retries on a gesture', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.primeVideo(segment, true)
  segment.pending[0].reject(mediaError('AbortError'))
  await flush()
  assert.equal(runtime.stillsFallbacks, 0)
  assert.equal(segment.priming, false)
  runtime.primeVideo(segment)
  assert.equal(segment.pending.length, 1)
  runtime.primeVideo(segment, true)
  segment.pending[1].resolve()
  await flush()
  assert.equal(segment.primed, true)
})

test('permission rejection during async loading waits for a gesture', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.primeVideo(segment)
  segment.pending[0].reject(mediaError('NotAllowedError'))
  await flush()
  assert.equal(runtime.stillsFallbacks, 0)
  assert.equal(segment.primeNeedsGesture, true)
  runtime.primeVideo(segment, true)
  segment.pending[1].resolve()
  await flush()
  assert.equal(segment.primed, true)
})

test('confirmed policy rejection on a gesture still provides the stills fallback', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.primeVideo(segment, true)
  segment.pending[0].reject(mediaError('NotAllowedError'))
  await flush()
  assert.equal(runtime.stillsFallbacks, 1)
})

test('scroll seeks wait for warm-up and then catch up to the latest target', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.primeVideo(segment)
  runtime.snapSegmentTime(segment, 0.2)
  runtime.snapSegmentTime(segment, 0.7)
  assert.deepEqual(segment.writes, [])
  segment.pending[0].resolve()
  await flush()
  assert.deepEqual(segment.writes, [5.6])
  assert.equal(segment.classes.has('has-frame'), false)
  segment.video.seeking = false
  runtime.revealVideoFrame(segment)
  assert.equal(segment.classes.has('has-frame'), true)
})

test('scene endpoints never interrupt a pending seek, including reverse scroll', () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.snapSegmentTime(segment, 0.5)
  runtime.snapSegmentTime(segment, 1)
  assert.deepEqual(segment.writes, [4])
  segment.video.seeking = false
  runtime.seekVideo(segment)
  assert.deepEqual(segment.writes, [4, 7.992])
  runtime.snapSegmentTime(segment, 0)
  assert.equal(segment.writes.length, 2)
  segment.video.seeking = false
  runtime.seekVideo(segment)
  assert.deepEqual(segment.writes, [4, 7.992, 0])
})

test('back/forward cache preserves video URLs until the page is discarded', () => {
  const runtime = makeHarness()
  runtime.segments.push({ blobUrl: 'blob:scene' })
  runtime.releaseVideos({ persisted: true })
  assert.deepEqual(runtime.revoked, [])
  runtime.releaseVideos({ persisted: false })
  assert.deepEqual(runtime.revoked, ['blob:scene'])
})

const bootstrap = source.slice(source.lastIndexOf("if (document.readyState"))
for (const readyState of ['loading', 'interactive', 'complete']) {
  test(`controller starts before window.load when document is ${readyState}`, () => {
    const documentEvents = new Map()
    const windowEvents = new Map()
    let starts = 0
    const context = {
      document: { readyState, addEventListener: (name, callback) => documentEvents.set(name, callback) },
      window: { addEventListener: (name, callback) => windowEvents.set(name, callback) },
      initScrollWorld() { starts += 1 },
    }
    vm.runInNewContext(bootstrap, context)
    if (readyState === 'loading') {
      assert.equal(starts, 0)
      documentEvents.get('DOMContentLoaded')()
    }
    assert.equal(starts, 1)
    assert.equal(windowEvents.has('load'), false)
  })
}
