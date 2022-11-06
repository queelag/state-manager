import { describe, expect, it } from 'vitest'
import { isObservable, toJS } from '../../src'
import { getTestStore, Store } from '../get.test.store'

describe('toJS', () => {
  it('works', () => {
    let store: Store, js: Store

    store = getTestStore()
    js = toJS(store)

    expect(isObservable(js.object)).toBeFalsy()
    expect(isObservable(js.array)).toBeFalsy()
    expect(isObservable(js.date)).toBeFalsy()
    expect(isObservable(js.map)).toBeFalsy()
    expect(isObservable(js.set)).toBeFalsy()
    expect(isObservable(js.dayjs)).toBeFalsy()
  })
})
