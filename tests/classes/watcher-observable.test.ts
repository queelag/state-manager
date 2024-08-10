import { beforeEach, describe, expect, it } from 'vitest'
import { WatcherObservable } from '../../src/classes//watcher-observable'
import { Store, getTestStore } from '../get.test.store'

describe('WatcherObservable', () => {
  let store: Store, observables: WatcherObservable[]

  beforeEach(() => {
    store = getTestStore()
  })

  it('gets the correct value from the MAP types', () => {
    observables = [
      new WatcherObservable('entries', undefined, store.map, 'map-entries', [...store.map.entries()]),
      new WatcherObservable(0, undefined, store.map, 'map-get', undefined),
      new WatcherObservable('keys', undefined, store.map, 'map-keys', [...store.map.keys()]),
      new WatcherObservable('values', undefined, store.map, 'map-values', [...store.map.values()])
    ]

    expect([...observables[0].get()]).toStrictEqual([])
    expect(observables[1].get()).toBe(undefined)
    expect([...observables[2].get()]).toStrictEqual([])
    expect([...observables[3].get()]).toStrictEqual([])
    store.map.set(0, 0)
    expect([...observables[0].get()]).toStrictEqual([[0, 0]])
    expect(observables[1].get()).toBe(0)
    expect([...observables[2].get()]).toStrictEqual([0])
    expect([...observables[3].get()]).toStrictEqual([0])
  })

  it('gets the correct value from the PROXY_HANDLER_GET type', () => {
    observables = [new WatcherObservable(0, undefined, store.array, 'proxy-handler-get', undefined)]
    expect(observables[0].get()).toBe(undefined)
    store.array.push(0)
    expect(observables[0].get()).toBe(0)
  })

  it('gets the correct value from the SET types', () => {
    observables = [
      new WatcherObservable('entries', undefined, store.set, 'set-entries', [...store.set.entries()]),
      new WatcherObservable('keys', undefined, store.set, 'set-keys', [...store.set.keys()]),
      new WatcherObservable('values', undefined, store.set, 'set-values', [...store.set.values()])
    ]

    expect([...observables[0].get()]).toStrictEqual([])
    expect([...observables[1].get()]).toStrictEqual([])
    expect([...observables[2].get()]).toStrictEqual([])
    store.set.add(0)
    expect([...observables[0].get()]).toStrictEqual([[0, 0]])
    expect([...observables[1].get()]).toStrictEqual([0])
    expect([...observables[2].get()]).toStrictEqual([0])
  })

  it('shallowly diffs map and set entries', () => {
    observables = [new WatcherObservable('entries', undefined, store.map, 'map-entries', [...store.map.entries()])]
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeTruthy()

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeFalsy()
    observables = [new WatcherObservable('entries', undefined, store.map, 'map-entries', [...store.map.entries()])]

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeTruthy()
    observables = [new WatcherObservable('entries', undefined, store.map, 'map-entries', [...store.map.entries()])]

    store.map.set(0, 1)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeFalsy()
    observables = [new WatcherObservable('entries', undefined, store.map, 'map-entries', [...store.map.entries()])]

    store.map.clear()
    store.map.set(1, 0)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeFalsy()
  })

  it('shallowly diffs map and set keys and values', () => {
    observables = [new WatcherObservable('keys', undefined, store.map, 'map-keys', [...store.map.keys()])]
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeTruthy()

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeFalsy()
    observables = [new WatcherObservable('keys', undefined, store.map, 'map-keys', [...store.map.keys()])]

    store.map.set(0, 1)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeTruthy()
    observables = [new WatcherObservable('keys', undefined, store.map, 'map-keys', [...store.map.keys()])]

    store.map.clear()
    store.map.set(1, 0)
    expect(WatcherObservable.match(observables, 'map-set', store.map)).toBeFalsy()
  })

  it('diffs with simple equality checks the MAP_GET and PROXY_HANDLER_GET types', () => {
    observables = [new WatcherObservable('number', store, store, 'proxy-handler-get', store.number)]
    expect(WatcherObservable.match(observables, 'proxy-handler-set', store)).toBeTruthy()

    store.number++
    expect(WatcherObservable.match(observables, 'proxy-handler-set', store)).toBeFalsy()
    observables = [new WatcherObservable('number', store, store, 'proxy-handler-get', store.number)]

    store.number = 1
    expect(WatcherObservable.match(observables, 'proxy-handler-set', store)).toBeTruthy()
    observables = [new WatcherObservable('number', store, store, 'proxy-handler-get', store.number)]

    observables = [new WatcherObservable('object', store, store, 'proxy-handler-get', store.object)]
    expect(WatcherObservable.match(observables, 'proxy-handler-set', {})).toBeTruthy()
    expect(WatcherObservable.match(observables, 'proxy-handler-set', store)).toBeFalsy()

    store.object.a = 0
    expect(WatcherObservable.match(observables, 'proxy-handler-set', store)).toBeFalsy()
    observables = [new WatcherObservable('object', store, store, 'proxy-handler-get', store.object)]

    delete store.object.a
    expect(WatcherObservable.match(observables, 'proxy-handler-delete-property', store)).toBeFalsy()

    store.map.set(0, {})
    observables = [new WatcherObservable(0, undefined, store.map, 'map-get', store.map.get(0))]
    expect(WatcherObservable.match(observables, 'map-clear', store.map)).toBeTruthy()

    store.map.clear()
    expect(WatcherObservable.match(observables, 'map-clear', store.map)).toBeFalsy()
  })
})
