import { noop } from '@queelag/core'
import { watch, WatcherType } from '../../src'
import { Administration } from '../../src/modules/administration'
import { getTestStore, Store } from '../get.test.store'

describe('watch', () => {
  it('does not allow duplicate watchers to be pushed', () => {
    let store: Store

    store = getTestStore()

    watch(WatcherType.AUTORUN, noop, store)
    watch(WatcherType.AUTORUN, noop, store)
    watch(WatcherType.DISPATCH, noop, store)
    watch(WatcherType.DISPATCH, noop, store)
    watch(WatcherType.REACTION, noop, noop, store)
    watch(WatcherType.REACTION, noop, noop, store)
    watch(WatcherType.WHEN, noop, noop, store)
    watch(WatcherType.WHEN, noop, noop, store)

    expect(Administration.get(store)?.watchers).toHaveLength(4)
  })
})
