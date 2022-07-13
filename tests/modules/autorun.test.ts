import { autorun } from '../../src'
import { WatcherAutorunEffect } from '../../src/definitions/types'
import { getTestStore, Store } from '../get.test.store'

describe('autorun', () => {
  it('runs on every change', async () => {
    let store: Store, effect: WatcherAutorunEffect

    store = getTestStore()
    effect = jest.fn()

    autorun(effect, store)

    expect(effect).not.toBeCalled()
    store.number++
    expect(effect).toBeCalledTimes(1)
  })
})
