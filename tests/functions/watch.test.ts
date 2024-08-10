import { noop } from '@aracna/core'
import { describe, expect, it } from 'vitest'
import { watch } from '../../src'
import { WatcherManager } from '../../src/classes/watcher-manager'
import { Store, getTestStore } from '../get.test.store'

describe('watch', () => {
  it('does not allow duplicate watchers to be pushed', () => {
    let store: Store

    store = getTestStore()

    watch('autorun', noop)
    watch('autorun', noop)
    watch('reaction', noop, noop)
    watch('reaction', noop, noop)
    watch('read', noop)
    watch('read', noop)
    watch('when', noop, noop)
    watch('when', noop, noop)

    expect(WatcherManager.watchers).toHaveLength(4)
  })
})
