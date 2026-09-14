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
    activeSegmentIndex: 0,
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

test('policy rejection never disables scroll seeking for all clips', async () => {
  const runtime = makeHarness()
  const segment = makeSegment()
  runtime.primeVideo(segment, true)
  segment.pending[0].reject(mediaError('NotAllowedError'))
  await flush()
  assert.equal(runtime.stillsFallbacks, 0)
  runtime.snapSegmentTime(segment, 0.5)
  assert.deepEqual(segment.writes, [4])
  runtime.primeVideo(segment, true)
  assert.equal(segment.pending.length, 2)
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

test('back/forward cache preserves native media until the page is discarded', () => {
  const runtime = makeHarness()
  const calls = []
  runtime.segments.push({ video: {
    pause() { calls.push('pause') },
    removeAttribute(name) { calls.push(name) },
    load() { calls.push('load') },
  } })
  runtime.releaseVideos({ persisted: true })
  assert.deepEqual(calls, [])
  runtime.releaseVideos({ persisted: false })
  assert.deepEqual(calls, ['pause', 'src', 'load'])
})

const bootstrap = source.slice(source.lastIndexOf("if (document.readyState"))

function navigationHarness(hash = '#contact') {
  const target = () => ({ offsetTop: 600, attributes: {}, setAttribute(k, v) { this.attributes[k] = v }, focus(options) { this.focusOptions = options } })
  const context = {
    window: { location: { hash }, innerHeight: 800, scrollY: 0, scrollTo({ top }) { this.scrollY = top } },
    track: { style: {} },
    totalPixels: 8000, scrollAnimationFrame: 17, targetScrollY: 0, renderedScrollY: 0,
    finale: { scrollTop: 300 }, finaleContact: target(), finaleFooter: target(),
    cancelAnimationFrame(id) { context.cancelled = id },
    render(y) { context.lastRender = y },
  }
  vm.createContext(context)
  vm.runInContext(runtimeFunction('onHashChange'), context)
  return context
}

test('cold and repeated Contact anchors reveal the finale and reset its inner scroll', () => {
  const runtime = navigationHarness()
  runtime.onHashChange()
  assert.equal(runtime.window.scrollY, 8000)
  assert.equal(runtime.lastRender, 8000)
  assert.equal(runtime.cancelled, 17)
  assert.equal(runtime.finale.scrollTop, 0)
  assert.equal(runtime.finaleContact.focusOptions.preventScroll, true)
  runtime.window.scrollY = 0
  runtime.finale.scrollTop = 600
  runtime.onHashChange()
  assert.equal(runtime.window.scrollY, 8000)
  assert.equal(runtime.finale.scrollTop, 0)
})

test('About positions the independently scrolling footer; Home returns to the opening', () => {
  const runtime = navigationHarness('#about')
  runtime.onHashChange()
  assert.equal(runtime.finale.scrollTop, 600)
  assert.equal(runtime.finaleFooter.focusOptions.preventScroll, true)
  runtime.window.location.hash = '#home'
  runtime.onHashChange()
  assert.equal(runtime.lastRender, 0)
  runtime.window.location.hash = '#unknown'
  runtime.window.scrollY = 100
  runtime.onHashChange()
  assert.equal(runtime.window.scrollY, 100)
})

test('resize preserves the visible finale even when the browser already clamped scrollY', () => {
  const runtime = navigationHarness()
  runtime.window.scrollY = 7200
  runtime.window.innerHeight = 600
  runtime.window.innerWidth = 1000
  runtime.renderedScrollY = 8000
  runtime.finale.getAttribute = () => 'false'
  runtime.compactViewport = { matches: false }
  runtime.segments = [{ weight: 2 }, { weight: 2 }]
  runtime.track = { style: {} }
  vm.runInContext(runtimeFunction('clamp'), runtime)
  vm.runInContext(runtimeFunction('layout'), runtime)
  runtime.layout()
  assert.equal(runtime.window.scrollY, 2400)
  assert.equal(runtime.lastRender, 2400)
  assert.equal(runtime.track.style.height, '3000px')
})

test('mobile toolbar height changes keep the finale reachable without moving scene bands', () => {
  const runtime = navigationHarness()
  runtime.coarsePointer = true
  runtime.compactViewport = { matches: true }
  runtime.laidOutWidth = runtime.window.innerWidth = 390
  runtime.window.innerHeight = 844
  runtime.targetScrollY = 8000
  runtime.finale.getAttribute = () => 'false'
  runtime.onScroll = () => { runtime.scrolled = true }
  runtime.layout = () => { throw new Error('Toolbar resizing must not rebuild the scene bands') }
  vm.runInContext(runtimeFunction('onResize'), runtime)
  runtime.onResize()
  assert.equal(runtime.track.style.height, '8844px')
  assert.equal(runtime.window.scrollY, 8000)
  assert.equal(runtime.scrolled, true)
  runtime.targetScrollY = runtime.window.scrollY = 7970
  runtime.onResize()
  assert.equal(runtime.window.scrollY, 7970, 'toolbar updates must not undo a user scrolling upward')
})

test('entering at Contact prepares the preceding clip for reverse scrolling', () => {
  const prepared = []
  const runtime = { segments: Array.from({ length: 6 }, () => ({ image: { src: '' } })),
    mediaEnabled: true, stillsOnly: false, loadClip(segment) { prepared.push(runtime.segments.indexOf(segment)) } }
  vm.createContext(runtime)
  vm.runInContext(runtimeFunction('loadNearby'), runtime)
  runtime.loadNearby(8000, 5)
  assert.deepEqual(prepared, [4, 5])
  prepared.length = 0
  runtime.loadNearby(4000, 3)
  assert.deepEqual(prepared, [2, 3, 4])
})

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
