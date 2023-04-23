import { noop } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { watch, WatcherType } from '../../src'
import { WatcherManager } from '../../src/modules/watcher.manager'
import { getTestStore, Store } from '../get.test.store'

describe('watch', () => {
  it('does not allow duplicate watchers to be pushed', () => {
    let store: Store

    store = getTestStore()

    watch(WatcherType.AUTORUN, noop)
    watch(WatcherType.AUTORUN, noop)
    watch(WatcherType.REACTION, noop, noop)
    watch(WatcherType.REACTION, noop, noop)
    watch(WatcherType.READ, noop)
    watch(WatcherType.READ, noop)
    watch(WatcherType.WHEN, noop, noop)
    watch(WatcherType.WHEN, noop, noop)

    expect(WatcherManager.watchers).toHaveLength(4)
  })
})
