import { noop } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { WatcherType, watch } from '../../src'
import { WatcherManager } from '../../src/classes/watcher-manager'
import { Store, getTestStore } from '../get.test.store'

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
