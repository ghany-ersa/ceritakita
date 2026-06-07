import { ref, computed } from 'vue'

const THROW_THRESHOLD = 100
const ROTATION_FACTOR = 0.10
const VELOCITY_BOOST  = 0.4

export function useSwipeCard({ onSwipeRight, onSwipeLeft } = {}) {
  const dragX      = ref(0)
  const dragY      = ref(0)
  const isDragging = ref(false)
  const isFlying   = ref(false)

  let startX = 0
  let startY = 0
  let lastX  = 0
  let velX   = 0

  const rotate = computed(() => dragX.value * ROTATION_FACTOR)

  const swipeProgress = computed(() => {
    const p = dragX.value / THROW_THRESHOLD
    return Math.max(-1, Math.min(1, p))
  })

  const showAnswerHint = computed(() => swipeProgress.value >  0.3)
  const showDareHint   = computed(() => swipeProgress.value < -0.3)

  // Kartu yang sedang drag — transform langsung tanpa transition
  const cardStyle = computed(() => {
    if (isFlying.value) {
      // fly-out: CSS transition aktif, terbang ke arah yang sudah di-set di dragX
      return {
        transform: `translate(${dragX.value}px, ${dragY.value * 0.4}px) rotate(${rotate.value}deg)`,
        transition: 'transform 0.38s cubic-bezier(0.4, 0, 1, 1)',
        pointerEvents: 'none',
      }
    }
    if (isDragging.value) {
      return {
        transform: `translate(${dragX.value}px, ${dragY.value * 0.25}px) rotate(${rotate.value}deg)`,
        transition: 'none',
        cursor: 'grabbing',
        willChange: 'transform',
      }
    }
    // snap-back / idle
    return {
      transform: 'translate(0px, 0px) rotate(0deg)',
      transition: 'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
      cursor: 'grab',
    }
  })

  function onPointerDown(e) {
    if (isFlying.value) return
    isDragging.value = true
    startX = lastX = e.clientX
    startY = e.clientY
    velX   = 0
    e.currentTarget?.setPointerCapture?.(e.pointerId)
  }

  function onPointerMove(e) {
    if (!isDragging.value) return
    velX         = e.clientX - lastX
    lastX        = e.clientX
    dragX.value  = e.clientX - startX
    dragY.value  = e.clientY - startY
  }

  function onPointerUp() {
    if (!isDragging.value) return
    isDragging.value = false

    const projected = dragX.value + velX / VELOCITY_BOOST

    if (projected > THROW_THRESHOLD)       _flyOut(1)
    else if (projected < -THROW_THRESHOLD) _flyOut(-1)
    else                                   _snapBack()
  }

  function _flyOut(dir) {
    isFlying.value = true
    // Set destination — cardStyle computed akan pakai transition 0.38s
    dragX.value = dir * (window.innerWidth + 300)
    dragY.value = dragY.value * 0.4

    // Callback setelah animasi selesai, lalu reset state
    setTimeout(() => {
      if (dir > 0) onSwipeRight?.()
      else         onSwipeLeft?.()
      // Reset setelah callback (komponen baru sudah di-mount)
      setTimeout(_reset, 50)
    }, 380)
  }

  function _snapBack() {
    dragX.value = 0
    dragY.value = 0
  }

  function _reset() {
    isFlying.value = false
    dragX.value    = 0
    dragY.value    = 0
  }

  function triggerSwipe(dir) {
    if (isFlying.value) return
    // nudge kecil dulu supaya terlihat bergerak
    dragX.value = dir * 30
    dragY.value = 0
    setTimeout(() => _flyOut(dir), 40)
  }

  return {
    cardStyle,
    swipeProgress,
    showAnswerHint,
    showDareHint,
    isDragging,
    isFlying,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    triggerSwipe,
  }
}
