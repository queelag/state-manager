import { describe, expect, it } from 'vitest'
import { isObservable } from '../../src'
import { getTestStore } from '../get.test.store'

describe('isObservable', () => {
  it('works', () => {
    const store = getTestStore()

    expect(isObservable(store)).toBeTruthy()
    expect(isObservable(store.array)).toBeTruthy()
    expect(isObservable(store.date)).toBeFalsy()
    expect(isObservable(store.dayjs)).toBeFalsy()
    expect(isObservable(store.function)).toBeFalsy()
    expect(isObservable(store.map)).toBeTruthy()
    expect(isObservable(store.null)).toBeFalsy()
    expect(isObservable(store.object)).toBeTruthy()
    expect(isObservable(store.set)).toBeTruthy()
    expect(isObservable(store.undefined)).toBeFalsy()
  })
})
