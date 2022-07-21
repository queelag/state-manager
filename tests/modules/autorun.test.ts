import { autorun } from '../../src'
import { WatcherAutorunEffect } from '../../src/definitions/types'
import { getTestStore, Store } from '../get.test.store'

describe('autorun', () => {
  it('runs on every change', async () => {
    let store: Store, effect: WatcherAutorunEffect

    store = getTestStore()
    effect = jest.fn(() => store.number)

    autorun(effect)

    expect(effect).toBeCalledTimes(1)
    store.number++
    expect(effect).toBeCalledTimes(2)
  })
})
