import { ref } from 'vue'

export function useCarousel(itemWidth, gap = 0) {
  const current = ref(0)
  const containerRef = ref(null)

  function onScroll() {
    if (!containerRef.value) return
    const step = itemWidth + gap
    current.value = Math.round(containerRef.value.scrollLeft / step)
  }

  function goTo(index) {
    if (!containerRef.value) return
    containerRef.value.scrollTo({ left: index * (itemWidth + gap), behavior: 'smooth' })
    current.value = index
  }

  return { current, containerRef, onScroll, goTo }
}
