import { WatcherObservable } from '../../src/classes/watcher.observable'
import { WatcherObservableType, WriteType } from '../../src/definitions/enums'
import { getTestStore, Store } from '../get.test.store'

describe('WatcherObservable', () => {
  let store: Store, observables: WatcherObservable[]

  beforeEach(() => {
    store = getTestStore()
  })

  it('gets the correct value from the MAP types', () => {
    observables = [
      new WatcherObservable('entries', undefined, store.map, WatcherObservableType.MAP_ENTRIES, [...store.map.entries()]),
      new WatcherObservable(0, undefined, store.map, WatcherObservableType.MAP_GET, undefined),
      new WatcherObservable('keys', undefined, store.map, WatcherObservableType.MAP_KEYS, [...store.map.keys()]),
      new WatcherObservable('values', undefined, store.map, WatcherObservableType.MAP_VALUES, [...store.map.values()])
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
    observables = [new WatcherObservable(0, undefined, store.array, WatcherObservableType.PROXY_HANDLER_GET, undefined)]
    expect(observables[0].get()).toBe(undefined)
    store.array.push(0)
    expect(observables[0].get()).toBe(0)
  })

  it('gets the correct value from the SET types', () => {
    observables = [
      new WatcherObservable('entries', undefined, store.set, WatcherObservableType.SET_ENTRIES, [...store.set.entries()]),
      new WatcherObservable('keys', undefined, store.set, WatcherObservableType.SET_KEYS, [...store.set.keys()]),
      new WatcherObservable('values', undefined, store.set, WatcherObservableType.SET_VALUES, [...store.set.values()])
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
    observables = [new WatcherObservable('entries', undefined, store.map, WatcherObservableType.MAP_ENTRIES, [...store.map.entries()])]
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeTruthy()

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeFalsy()
    observables = [new WatcherObservable('entries', undefined, store.map, WatcherObservableType.MAP_ENTRIES, [...store.map.entries()])]

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeTruthy()
    observables = [new WatcherObservable('entries', undefined, store.map, WatcherObservableType.MAP_ENTRIES, [...store.map.entries()])]

    store.map.set(0, 1)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeFalsy()
    observables = [new WatcherObservable('entries', undefined, store.map, WatcherObservableType.MAP_ENTRIES, [...store.map.entries()])]

    store.map.clear()
    store.map.set(1, 0)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeFalsy()
  })

  it('shallowly diffs map and set keys and values', () => {
    observables = [new WatcherObservable('keys', undefined, store.map, WatcherObservableType.MAP_KEYS, [...store.map.keys()])]
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeTruthy()

    store.map.set(0, 0)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeFalsy()
    observables = [new WatcherObservable('keys', undefined, store.map, WatcherObservableType.MAP_KEYS, [...store.map.keys()])]

    store.map.set(0, 1)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeTruthy()
    observables = [new WatcherObservable('keys', undefined, store.map, WatcherObservableType.MAP_KEYS, [...store.map.keys()])]

    store.map.clear()
    store.map.set(1, 0)
    expect(WatcherObservable.match(observables, WriteType.MAP_SET, store.map)).toBeFalsy()
  })

  it('diffs with simple equality checks the MAP_GET and PROXY_HANDLER_GET types', () => {
    observables = [new WatcherObservable('number', store, store, WatcherObservableType.PROXY_HANDLER_GET, store.number)]
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, store)).toBeTruthy()

    store.number++
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, store)).toBeFalsy()
    observables = [new WatcherObservable('number', store, store, WatcherObservableType.PROXY_HANDLER_GET, store.number)]

    store.number = 1
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, store)).toBeTruthy()
    observables = [new WatcherObservable('number', store, store, WatcherObservableType.PROXY_HANDLER_GET, store.number)]

    observables = [new WatcherObservable('object', store, store, WatcherObservableType.PROXY_HANDLER_GET, store.object)]
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, {})).toBeTruthy()
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, store)).toBeFalsy()

    store.object.a = 0
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_SET, store)).toBeFalsy()
    observables = [new WatcherObservable('object', store, store, WatcherObservableType.PROXY_HANDLER_GET, store.object)]

    delete store.object.a
    expect(WatcherObservable.match(observables, WriteType.PROXY_HANDLER_DELETE_PROPERTY, store)).toBeFalsy()

    store.map.set(0, {})
    observables = [new WatcherObservable(0, undefined, store.map, WatcherObservableType.MAP_GET, store.map.get(0))]
    expect(WatcherObservable.match(observables, WriteType.MAP_CLEAR, store.map)).toBeTruthy()

    store.map.clear()
    expect(WatcherObservable.match(observables, WriteType.MAP_CLEAR, store.map)).toBeFalsy()
  })
})
