import { describe, expect, it } from 'vitest'
import { classifyAuthError } from './authErrors.js'

describe('classifyAuthError', () => {
  it.each([
    [{ status: 400, code: 'invalid_credentials' }, 'invalid'],
    [{ status: 429 }, 'rate_limit'],
    [{ status: 422, code: 'weak_password' }, 'weak_password'],
    [{ status: 422, code: 'same_password' }, 'same_password'],
    [{ name: 'AuthSessionMissingError' }, 'no_session'],
    [{ name: 'AuthRetryableFetchError', status: 0 }, 'network'],
    [{ status: 500 }, 'unknown'],
    [null, null],
  ])('%j → %s', (error, expected) => {
    expect(classifyAuthError(error)).toBe(expected)
  })
})
