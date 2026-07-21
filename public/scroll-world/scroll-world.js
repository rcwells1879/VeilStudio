const MEDIA = '/media/scroll-world'
const CONTACT_ENDPOINT = 'https://formspree.io/f/xdkdvdol'
const FINALE_MOBILE_VERSION = '20260721-1'

const scenes = [
  {
    id: '02-observatory-study',
    label: 'VeilStudio',
    side: 'right',
    objectPosition: '32% 48%',
    accent: '#9fd5c2',
    title: 'VeilStudio',
    tagline: 'Imagine. Build. Transform.',
    body: 'Private creative AI for image editing, video generation, and intelligent chat workflows. Build with the models and keys you choose.',
    actions: [
      { label: 'VeilPix Image & Video', href: 'https://veilstudio.io/veilpix/' },
      { label: 'VeilChat beta', href: 'https://veilstudio.io/veilchat/' },
    ],
  },
  {
    id: '03-floating-atelier',
    label: 'Creation',
    side: 'left',
    objectPosition: '68% 50%',
    accent: '#a995d9',
    title: 'Image and Video Creation',
    body: 'Use VeilPix for AI photo editing, text-to-image creation, reference-driven video, and image-to-video workflows.',
    actions: [
      { label: 'Open VeilPix', href: 'https://veilstudio.io/veilpix/' },
    ],
  },
  {
    id: '04-badger-sea',
    label: 'Workflows',
    side: 'right',
    objectPosition: '32% 48%',
    accent: '#de7a68',
    title: 'Flexible AI Workflows',
    body: 'Move from creative generation to AI chat, research, and task execution while keeping control of models, keys, and data.',
    actions: [
      { label: 'Open VeilChat', href: 'https://veilstudio.io/veilchat/' },
      { label: 'Explore VeilStudio', href: 'https://veilstudio.io/' },
    ],
  },
]

const connectorIds = ['conn-02-03', 'conn-03-04']
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches
const compactViewport = window.matchMedia('(max-width: 900px)')
const phoneClass = Math.min(window.screen.width, window.screen.height) <= 600
const connection = navigator.connection
const dataSaver = Boolean(connection?.saveData)
const slowConnection = /^(slow-2g|2g|3g)$/.test(connection?.effectiveType || '')
const forcedStills = new URLSearchParams(window.location.search).has('stills')
let stillsOnly = reduceMotion || dataSaver || forcedStills
let mediaEnabled = false
let userReady = false
let activeSceneIndex = -1
let activeSegmentIndex = -1
let viewportHeight = window.innerHeight
let laidOutWidth = window.innerWidth
let totalPixels = 0
let targetScrollY = window.scrollY || window.pageYOffset
let renderedScrollY = targetScrollY
let scrollAnimationFrame = 0

const root = document.querySelector('#scroll-world')
const stage = root.querySelector('.world-stage')
const copyLayer = root.querySelector('.world-copy')
const route = root.querySelector('.world-route')
const track = root.querySelector('.world-track')
const progress = root.querySelector('.world-progress span')
const hint = root.querySelector('.world-hint')
const header = document.querySelector('.preview-header')
const progressBar = root.querySelector('.world-progress')
const finale = root.querySelector('.world-finale')
const finaleContact = finale.querySelector('.finale-contact')
const finaleFooter = finale.querySelector('[data-finale-footer]')
const contactForm = finale.querySelector('[data-contact-form]')
const contactStatus = finale.querySelector('[data-contact-status]')
const seoCopy = root.querySelector('[data-scroll-world-seo]')
const siteLinksToggle = document.querySelector('[data-links-toggle]')
const siteLinksPanel = document.querySelector('[data-links-panel]')

const segmentWeight = compactViewport.matches ? 2.15 : 1.85
const connectorWeight = compactViewport.matches ? 1.15 : 0.9
const finaleWeight = compactViewport.matches ? 2.8 : 2.45
const segments = []

scenes.forEach((scene, index) => {
  const segment = makeSegment({
    id: scene.id,
    kind: 'scene',
    sceneIndex: index,
    weight: segmentWeight,
    objectPosition: scene.objectPosition,
    still: `${MEDIA}/stills/web/${scene.id}.webp`,
  })
  segments.push(segment)
  scene.segment = segment

  if (index < scenes.length - 1) {
    const id = connectorIds[index]
    segments.push(makeSegment({
      id,
      kind: 'connector',
      sceneIndex: index,
      weight: connectorWeight,
      objectPosition: scene.objectPosition,
      startObjectPosition: scene.objectPosition,
      endObjectPosition: scenes[index + 1].objectPosition,
      still: `${MEDIA}/stills/web/${scenes[index + 1].id}.webp`,
    }))
  }
})

const finaleSegment = makeSegment({
  id: '05-finale-contact',
  kind: 'finale',
  sceneIndex: scenes.length - 1,
  weight: finaleWeight,
  // Match the badger scene's crop so the portrait handoff does not jump sideways.
  objectPosition: scenes[scenes.length - 1].objectPosition,
  still: finaleStillUrl(),
})
segments.push(finaleSegment)

const copies = scenes.map((scene, index) => makeCopy(scene, index))
const routeButtons = scenes.map((scene, index) => makeRouteButton(scene, index))
seoCopy.hidden = true
root.classList.add('is-mounted')
document.documentElement.classList.toggle('is-stills', stillsOnly)

layout()
render()
requestAnimationFrame(seekLoop)

contactForm.addEventListener('submit', submitContactForm)
siteLinksToggle?.addEventListener('click', toggleSiteLinks)
siteLinksPanel?.addEventListener('click', (event) => event.stopPropagation())
document.addEventListener('click', closeSiteLinks)
document.addEventListener('keydown', onDocumentKeydown)
document.querySelectorAll('[data-scroll-finale]').forEach((link) => {
  link.addEventListener('click', scrollToFinale)
})

const enableMedia = () => {
  if (mediaEnabled || stillsOnly) return
  mediaEnabled = true
  render()
}

window.setTimeout(enableMedia, 1200)
window.addEventListener('wheel', enableMedia, { once: true, passive: true })
window.addEventListener('pointerdown', onFirstGesture, { once: true, passive: true })
window.addEventListener('touchstart', onFirstGesture, { once: true, passive: true })
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onResize)
window.addEventListener('orientationchange', layout)
window.addEventListener('pagehide', releaseVideos, { once: true })

function mediaUrl(id, type) {
  const mobile = phoneClass ? '-m' : ''
  const url = `${MEDIA}/${type}/${id}${mobile}.${type === 'video' ? 'mp4' : 'webp'}`
  return phoneClass && id === '05-finale-contact'
    ? `${url}?v=${FINALE_MOBILE_VERSION}`
    : url
}

function finaleStillUrl() {
  const url = `${MEDIA}/posters/05-finale-contact-final${phoneClass ? '-m' : ''}.webp`
  return phoneClass ? `${url}?v=${FINALE_MOBILE_VERSION}` : url
}

function makeSegment(config) {
  const existingElement = stage.querySelector(`[data-id="${config.id}"]`)
  const element = existingElement || document.createElement('div')
  element.classList.add('world-segment', `world-segment--${config.kind}`)
  element.dataset.id = config.id
  element.style.setProperty('--object-position', config.objectPosition)

  const image = element.querySelector('img') || document.createElement('img')
  image.alt = ''
  image.decoding = 'async'
  image.draggable = false
  if (!image.parentElement) element.appendChild(image)
  if (!existingElement) stage.appendChild(element)

  return {
    ...config,
    element,
    image,
    clip: mediaUrl(config.id, 'video'),
    poster: mediaUrl(config.id, 'posters'),
    video: null,
    blobUrl: null,
    loading: false,
    ready: false,
    visible: false,
    current: 0,
    target: 0,
  }
}

function makeCopy(scene, index) {
  const existingArticle = copyLayer.querySelector(`[data-scene-copy="${index}"]`)
  if (existingArticle) {
    existingArticle.style.setProperty('--scene-accent', scene.accent)
    return existingArticle
  }

  const article = document.createElement('article')
  article.className = `scene-copy scene-copy--${scene.side}`
  article.dataset.sceneCopy = String(index)
  article.style.setProperty('--scene-accent', scene.accent)
  const heading = index === 0 ? 'h1' : 'h2'
  article.innerHTML = `
    <${heading}>${escapeHtml(scene.title)}</${heading}>
    ${scene.tagline ? `<p class="scene-copy__tagline">${escapeHtml(scene.tagline)}</p>` : ''}
    <p class="scene-copy__body">${escapeHtml(scene.body)}</p>
    <div class="scene-copy__actions">${scene.actions.map((action) => `<a href="${escapeHtml(action.href)}">${escapeHtml(action.label)}</a>`).join('')}</div>
  `
  article.setAttribute('aria-hidden', 'true')
  copyLayer.appendChild(article)
  return article
}

function makeRouteButton(scene, index) {
  const button = document.createElement('button')
  button.type = 'button'
  button.style.setProperty('--route-accent', scene.accent)
  button.setAttribute('aria-label', `Jump to ${scene.label}`)
  button.addEventListener('click', () => {
    const segment = scene.segment
    window.scrollTo({
      top: segment.start,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  })
  route.appendChild(button)
  return button
}

function layout() {
  if (scrollAnimationFrame) cancelAnimationFrame(scrollAnimationFrame)
  scrollAnimationFrame = 0
  viewportHeight = window.innerHeight
  laidOutWidth = window.innerWidth
  const mobileFactor = compactViewport.matches ? 1.12 : 1
  let offset = 0
  segments.forEach((segment) => {
    segment.start = offset * viewportHeight
    offset += segment.weight * mobileFactor
    segment.end = offset * viewportHeight
  })
  totalPixels = offset * viewportHeight
  track.style.height = `${totalPixels + viewportHeight}px`
  targetScrollY = window.scrollY || window.pageYOffset
  renderedScrollY = targetScrollY
  render(renderedScrollY)
}

function render(y = renderedScrollY) {
  const activeSegment = findActiveSegment(y)
  const activeIndex = segments.indexOf(activeSegment)
  const fadePixels = stillsOnly
    ? Math.min(130, viewportHeight * 0.12)
    : Math.min(28, viewportHeight * 0.028)
  const nearbyBoundary = findNearbyBoundary(y, fadePixels)

  segments.forEach((segment) => {
    segment.element.style.opacity = '0'
    segment.visible = false
    const local = clamp((y - segment.start) / (segment.end - segment.start))
    segment.target = local
    if (segment.kind === 'connector') {
      segment.element.style.setProperty(
        '--object-position',
        interpolateObjectPosition(segment.startObjectPosition, segment.endObjectPosition, segment.target),
      )
    }
  })

  if (!stillsOnly && activeIndex !== activeSegmentIndex) {
    const previous = segments[activeSegmentIndex]
    if (previous) snapSegmentTime(previous, activeIndex > activeSegmentIndex ? 1 : 0)
    snapSegmentTime(activeSegment, activeSegment.target)
    activeSegmentIndex = activeIndex
  }

  if (nearbyBoundary) {
    const { before, after, mix } = nearbyBoundary
    showSegment(before, 1 - mix, 10)
    showSegment(after, mix, 11)
  } else if (activeSegment) {
    showSegment(activeSegment, 1, 11)
  }

  renderCopy(activeSegment)
  renderFinale(activeSegment.kind === 'finale' ? activeSegment.target : 0, activeSegment.kind === 'finale')
  const nearScene = activeSegment.kind === 'connector' && activeSegment.target > 0.5
    ? activeSegment.sceneIndex + 1
    : activeSegment.sceneIndex
  setActiveScene(clamp(nearScene, 0, scenes.length - 1))

  progress.style.transform = `scaleX(${clamp(y / totalPixels)})`
  hint.style.opacity = String(clamp(1 - y / (viewportHeight * 0.55)))
  const loadY = targetScrollY
  const loadIndex = segments.indexOf(findActiveSegment(loadY))
  loadNearby(loadY, loadIndex)
}

function findActiveSegment(y) {
  let current = segments[0]
  for (const segment of segments) {
    if (y >= segment.start) current = segment
    else break
  }
  return current
}

function findNearbyBoundary(y, radius) {
  for (let index = 1; index < segments.length; index += 1) {
    const boundary = segments[index].start
    if (Math.abs(y - boundary) <= radius) {
      return {
        before: segments[index - 1],
        after: segments[index],
        mix: smooth((y - (boundary - radius)) / (radius * 2)),
      }
    }
  }
  return null
}

function showSegment(segment, opacity, zIndex) {
  segment.element.style.opacity = String(opacity)
  segment.element.style.zIndex = String(zIndex)
  segment.visible = opacity > 0.002
}

function snapSegmentTime(segment, progress) {
  if (!segment) return
  segment.current = progress
  segment.target = progress
  const video = segment.video
  if (!video || !segment.ready) return
  try {
    video.currentTime = clamp(progress, 0, 0.999) * (video.duration || 1)
  } catch {
    // The poster remains visible until the media element becomes seekable.
  }
}

function renderCopy(segment) {
  copies.forEach((copy) => {
    copy.style.opacity = '0'
    copy.style.pointerEvents = 'none'
    copy.classList.remove('is-interactive')
    copy.setAttribute('aria-hidden', 'true')
  })

  if (segment.kind === 'finale') return

  if (segment.kind === 'connector') {
    const from = segment.sceneIndex
    const to = from + 1
    const outgoing = smooth(clamp((0.58 - segment.target) / 0.42))
    const incoming = smooth(clamp((segment.target - 0.42) / 0.42))
    setCopy(copies[from], outgoing)
    setCopy(copies[to], incoming)
    return
  }

  const isLastScene = segment.sceneIndex === scenes.length - 1
  const outroOpacity = isLastScene
    ? smooth(clamp((1 - segment.target) / 0.18))
    : 1
  setCopy(copies[segment.sceneIndex], outroOpacity)
}

function setCopy(copy, opacity) {
  copy.style.opacity = String(opacity)
  copy.style.transform = compactViewport.matches ? 'none' : 'translateY(-50%)'
  const interactive = opacity > 0.62
  copy.classList.toggle('is-interactive', interactive)
  copy.style.pointerEvents = interactive ? 'auto' : 'none'
  copy.setAttribute('aria-hidden', interactive ? 'false' : 'true')
}

function setActiveScene(index) {
  if (index === activeSceneIndex) return
  activeSceneIndex = index
  routeButtons.forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index)
    button.setAttribute('aria-current', buttonIndex === index ? 'step' : 'false')
  })
  document.documentElement.style.setProperty('--accent', scenes[index].accent)
}

function renderFinale(progressValue, isActive) {
  const progressValueClamped = clamp(progressValue)
  const contactProgress = smooth(clamp((progressValueClamped - 0.94) / 0.055))
  const footerProgress = smooth(clamp((progressValueClamped - 0.958) / 0.038))
  const chromeOpacity = isActive ? 1 - smooth(clamp(progressValueClamped / 0.16)) : 1

  finale.style.opacity = isActive ? '1' : '0'
  finaleContact.style.opacity = String(contactProgress)
  finaleContact.style.transform = `translate3d(0, ${((1 - contactProgress) * 18).toFixed(2)}px, 0)`
  finaleFooter.style.opacity = String(footerProgress)
  finaleFooter.style.transform = `translate3d(0, ${((1 - footerProgress) * 12).toFixed(2)}px, 0)`

  header.style.opacity = String(chromeOpacity)
  header.style.pointerEvents = chromeOpacity < 0.05 ? 'none' : ''
  route.style.opacity = String(chromeOpacity)
  progressBar.style.opacity = String(chromeOpacity)

  if (chromeOpacity < 0.35 && siteLinksPanel && !siteLinksPanel.hidden) setSiteLinksOpen(false)

  const interactive = isActive && contactProgress > 0.88
  finale.style.pointerEvents = interactive ? 'auto' : 'none'
  finale.setAttribute('aria-hidden', interactive ? 'false' : 'true')
  if (interactive) finale.removeAttribute('inert')
  else finale.setAttribute('inert', '')
}

function loadNearby(y, activeIndex) {
  segments.forEach((segment, index) => {
    const distance = index - activeIndex
    const shouldPreparePoster = Math.abs(distance) <= 1
    if (shouldPreparePoster && !segment.image.src) {
      segment.image.src = stillsOnly ? segment.still : segment.poster
    }

    if (!mediaEnabled || stillsOnly) return
    const lookahead = slowConnection ? 0.08 : 0.48
    const inWindow = y >= segment.start - lookahead * viewportHeight
      && y <= segment.end + lookahead * viewportHeight
    if (inWindow) loadClip(segment)
  })
}

async function loadClip(segment) {
  if (!segment.clip || segment.loading || segment.video || stillsOnly) return
  segment.loading = true
  if (!segment.image.src) segment.image.src = segment.poster

  try {
    const response = await fetch(segment.clip)
    if (!response.ok) throw new Error(`Video request failed: ${response.status}`)
    const blob = await response.blob()
    if (stillsOnly) return

    const video = document.createElement('video')
    segment.blobUrl = URL.createObjectURL(blob)
    video.src = segment.blobUrl
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.setAttribute('muted', '')
    video.setAttribute('playsinline', '')
    video.setAttribute('aria-hidden', 'true')
    video.addEventListener('loadedmetadata', () => {
      segment.ready = true
      if (userReady) primeVideo(video)
      render()
    })
    video.addEventListener('seeked', () => {
      segment.element.classList.add('has-frame')
    }, { once: true })
    video.addEventListener('loadeddata', () => {
      if (userReady) primeVideo(video)
    })
    segment.video = video
    segment.element.appendChild(video)
  } catch {
    segment.loading = false
  }
}

function seekLoop() {
  const mobileBehavior = coarsePointer || compactViewport.matches
  const epsilon = mobileBehavior ? 0.025 : 0.009
  for (const segment of segments) {
    const video = segment.video
    if (!video || !segment.ready) continue
    const atEndpoint = segment.target <= 0.015 || segment.target >= 0.985
    if (video.seeking && !atEndpoint) continue
    if (!segment.visible && Math.abs(segment.current - segment.target) < 0.002) continue
    segment.current = segment.target
    const targetTime = clamp(segment.current, 0, 0.999) * (video.duration || 1)
    if (Math.abs(video.currentTime - targetTime) > epsilon) {
      try {
        video.currentTime = targetTime
      } catch {
        // A still remains visible until the media element becomes seekable.
      }
    }
  }
  requestAnimationFrame(seekLoop)
}

function onFirstGesture() {
  userReady = true
  enableMedia()
  segments.forEach((segment) => primeVideo(segment.video))
}

function primeVideo(video) {
  if (!video || !(coarsePointer || compactViewport.matches)) return
  try {
    const play = video.play()
    if (play?.then) {
      play.then(() => video.pause()).catch(() => enterStillsMode())
    }
  } catch {
    // Some desktop browsers throw during speculative priming; normal seeking still works.
  }
}

function enterStillsMode() {
  if (stillsOnly) return
  stillsOnly = true
  document.documentElement.classList.add('is-stills')
  segments.forEach((segment) => {
    if (segment.video) segment.video.remove()
    if (segment.blobUrl) URL.revokeObjectURL(segment.blobUrl)
    segment.video = null
    segment.blobUrl = null
    segment.ready = false
    segment.element.classList.remove('has-frame')
    segment.image.src = segment.still
  })
  render()
}

function onScroll() {
  targetScrollY = window.scrollY || window.pageYOffset
  if (reduceMotion) {
    renderedScrollY = targetScrollY
    render(renderedScrollY)
    return
  }
  if (!scrollAnimationFrame) scrollAnimationFrame = requestAnimationFrame(animateScroll)
}

function animateScroll() {
  const difference = targetScrollY - renderedScrollY
  if (Math.abs(difference) <= 0.35) {
    renderedScrollY = targetScrollY
    render(renderedScrollY)
    scrollAnimationFrame = 0
    return
  }

  const response = coarsePointer || compactViewport.matches ? 0.24 : 0.18
  renderedScrollY += difference * response
  render(renderedScrollY)
  scrollAnimationFrame = requestAnimationFrame(animateScroll)
}

function onResize() {
  const widthChanged = Math.abs(window.innerWidth - laidOutWidth) > 2
  // Chrome's mobile toolbar changes viewport height while scrolling. Rebuilding the
  // scene bands for that height-only resize makes the pinned world appear to scroll.
  if ((coarsePointer || compactViewport.matches) && !widthChanged) return
  layout()
}

function releaseVideos() {
  segments.forEach((segment) => {
    if (segment.blobUrl) URL.revokeObjectURL(segment.blobUrl)
  })
}

function toggleSiteLinks(event) {
  event.stopPropagation()
  setSiteLinksOpen(siteLinksPanel?.hidden ?? true)
}

function closeSiteLinks() {
  setSiteLinksOpen(false)
}

function setSiteLinksOpen(open) {
  if (!siteLinksToggle || !siteLinksPanel) return
  siteLinksPanel.hidden = !open
  siteLinksToggle.setAttribute('aria-expanded', open ? 'true' : 'false')
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') setSiteLinksOpen(false)
}

function scrollToFinale(event) {
  event.preventDefault()
  setSiteLinksOpen(false)
  window.scrollTo({
    top: totalPixels,
    behavior: reduceMotion ? 'auto' : 'smooth',
  })
}

async function submitContactForm(event) {
  event.preventDefault()
  if (contactForm.dataset.submitting === 'true') return

  const formData = new FormData(contactForm)
  if (String(formData.get('_gotcha') || '').trim()) {
    setContactStatus('success', 'Thank you. Your message has been received.')
    contactForm.reset()
    return
  }

  const submitButton = contactForm.querySelector('button[type="submit"]')
  const submitLabel = submitButton.querySelector('span')
  contactForm.dataset.submitting = 'true'
  submitButton.disabled = true
  submitLabel.textContent = 'Sending...'
  setContactStatus('loading', 'Sending your message...')

  try {
    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: String(formData.get('name') || ''),
        email: String(formData.get('email') || ''),
        phone: String(formData.get('phone') || ''),
        message: String(formData.get('message') || ''),
      }),
    })

    if (!response.ok) throw new Error(`Contact request failed: ${response.status}`)
    contactForm.reset()
    setContactStatus('success', "Message sent. We'll get back to you soon.")
  } catch {
    setContactStatus('error', 'We could not send that message. Please try again.')
  } finally {
    delete contactForm.dataset.submitting
    submitButton.disabled = false
    submitLabel.textContent = 'Send message'
  }
}

function setContactStatus(type, message) {
  contactStatus.className = `contact-form__status is-${type}`
  contactStatus.textContent = message
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

function smooth(value) {
  const x = clamp(value)
  return x * x * (3 - 2 * x)
}

function interpolateObjectPosition(from, to, progress) {
  const parse = (value) => String(value).match(/(-?[\d.]+)%\s+(-?[\d.]+)%/)
  const a = parse(from)
  const b = parse(to)
  if (!a || !b) return to || from || '50% 50%'
  const x = Number(a[1]) + (Number(b[1]) - Number(a[1])) * clamp(progress)
  const y = Number(a[2]) + (Number(b[2]) - Number(a[2])) * clamp(progress)
  return `${x.toFixed(2)}% ${y.toFixed(2)}%`
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  })[character])
}
