import { beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { observe, watch, WatcherType } from '../../src'
import { WatcherAutorunEffect, WatcherReactionEffect, WatcherWhenEffect } from '../../src/definitions/types'
import { Administration } from '../../src/modules/administration'
import { getTestStore, Store } from '../get.test.store'

describe('Administration', () => {
  let store: Store

  beforeEach(() => {
    store = getTestStore()
  })

  it('is defined after the target is made observable', () => {
    let keys: (keyof Store)[], administration: Administration<Store> | undefined

    store = new Store()
    expect(Administration.isNotDefined(store)).toBeTruthy()

    keys = Object.keys(store) as any
    observe(store, keys)

    expect(Administration.isDefined(store)).toBeTruthy()

    administration = Administration.get(store)
    expect(administration).toBeDefined()

    expect(administration?.keys).toBe(keys)
    // expect(administration?.watchers).toHaveLength(0)

    keys.forEach((k: keyof Store) => {
      expect(store[k]).toBe(administration?.proxy[k])
    })
  })

  it('can be used through with', () => {
    let fn: Mock

    store = new Store()
    fn = vi.fn()

    expect(Administration.with(store, fn)).toBeUndefined()
    expect(fn).not.toBeCalled()
    expect(Administration.with(store, fn, 0)).toBe(0)
    expect(fn).not.toBeCalled()

    observe(store, [])

    expect(
      Administration.with(store, (administration: Administration<Store>) => {
        expect(administration).toBeDefined()
        return true
      })
    ).toBeTruthy()
  })

  it('handles every watcher when there are changes', () => {
    let ae: WatcherAutorunEffect, re: WatcherReactionEffect<number>, we: WatcherWhenEffect

    ae = vi.fn()
    re = vi.fn()
    we = vi.fn()

    watch(WatcherType.AUTORUN, ae)
    watch(WatcherType.REACTION, () => store.number, re)
    watch(WatcherType.WHEN, () => store.boolean, we)

    store.boolean = true

    expect(ae).toBeCalledTimes(1)
    expect(re).toBeCalledTimes(0)
    expect(we).toBeCalledTimes(1)

    store.number++

    expect(ae).toBeCalledTimes(1)
    expect(re).toBeCalledTimes(1)
    expect(we).toBeCalledTimes(1)

    store.string = 'a'

    expect(ae).toBeCalledTimes(1)
    expect(re).toBeCalledTimes(1)
    expect(we).toBeCalledTimes(1)

    store.boolean = false

    expect(ae).toBeCalledTimes(1)
    expect(re).toBeCalledTimes(1)
    expect(we).toBeCalledTimes(1)
  })

  it('does not set if already exists', () => {
    expect(() => Administration.define(store, [], new Proxy(store, {}))).not.toThrow()
  })

  it('updates correctly', () => {
    Administration.update({})
    Administration.update(store, {}, {})
  })
})
