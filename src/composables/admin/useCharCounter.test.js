import { nextTick, ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { getCounterState, useCharCounter } from './useCharCounter.js'

const messages = { nearLimit: (c, m) => `cerca ${c}/${m}`, overLimit: n => `sobran ${n}` }

describe('getCounterState', () => {
  it('sin máximo siempre ok', () => {
    expect(getCounterState(500, 0).level).toBe('ok')
  })
  it('umbrales 90 % y 100 %', () => {
    expect(getCounterState(89, 100).level).toBe('ok')
    expect(getCounterState(90, 100).level).toBe('warning')
    expect(getCounterState(100, 100).level).toBe('warning')
    expect(getCounterState(101, 100)).toEqual({ level: 'danger', over: 1 })
  })
})

describe('useCharCounter', () => {
  it('anuncia solo al cruzar umbrales', async () => {
    const count = ref(10)
    const { announcement, level } = useCharCounter(count, 100, messages)
    expect(announcement.value).toBe('')
    count.value = 91
    await nextTick()
    expect(level.value).toBe('warning')
    expect(announcement.value).toBe('cerca 91/100')
    count.value = 95
    await nextTick()
    expect(announcement.value).toBe('cerca 91/100') // sin re-anuncio por tecla
    count.value = 103
    await nextTick()
    expect(announcement.value).toBe('sobran 3')
    count.value = 5
    await nextTick()
    expect(announcement.value).toBe('')
  })
})
