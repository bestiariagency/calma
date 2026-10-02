import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { resetToasts, useToast } from './useToast.js'

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    resetToasts()
    vi.useRealTimers()
  })

  it('éxito/info 4 s, warning 6 s, error persistente', () => {
    const t = useToast()
    t.success('ok')
    t.warning('ojo')
    t.error('mal')
    expect(t.toasts.value).toHaveLength(3)
    vi.advanceTimersByTime(4000)
    expect(t.toasts.value.map(x => x.type)).toEqual(['warning', 'error'])
    vi.advanceTimersByTime(2000)
    expect(t.toasts.value.map(x => x.type)).toEqual(['error'])
    vi.advanceTimersByTime(60_000)
    expect(t.toasts.value).toHaveLength(1)
  })

  it('máximo 3 visibles; el resto espera en cola y arranca su temporizador al entrar', () => {
    const t = useToast()
    ;['a', 'b', 'c', 'd'].forEach(title => t.info(title))
    expect(t.toasts.value.map(x => x.title)).toEqual(['a', 'b', 'c'])
    expect(t.queued.value).toBe(1)
    vi.advanceTimersByTime(4000)
    expect(t.toasts.value.map(x => x.title)).toEqual(['d'])
    vi.advanceTimersByTime(3999)
    expect(t.toasts.value).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(t.toasts.value).toHaveLength(0)
  })

  it('pausa y reanuda conservando el tiempo restante', () => {
    const t = useToast()
    const id = t.info('hola')
    vi.advanceTimersByTime(3000)
    t.pause(id)
    vi.advanceTimersByTime(60_000)
    expect(t.toasts.value).toHaveLength(1)
    t.resume(id)
    vi.advanceTimersByTime(1000)
    expect(t.toasts.value).toHaveLength(0)
  })

  it('dismiss manual y duración personalizada', () => {
    const t = useToast()
    const id = t.error('x')
    t.dismiss(id)
    expect(t.toasts.value).toHaveLength(0)
    t.info('largo', { duration: 10_000 })
    vi.advanceTimersByTime(9999)
    expect(t.toasts.value).toHaveLength(1)
  })
})
