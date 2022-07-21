import { IS_PROXY_KEY } from '../../src/definitions/constants'
import { Administration } from '../../src/modules/administration'
import { Observable } from '../../src/modules/observable'
import { WatcherManager } from '../../src/modules/watcher.manager'
import { Store } from '../get.test.store'

describe('Observable', () => {
  let store: Store

  beforeEach(() => {
    WatcherManager.onWrite = jest.fn()
    store = new Store()
  })

  it('works with bigint', () => {
    Observable.make(store, ['bigint'])

    store.bigint++
    expect(store.bigint).toBe(1n)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('works with boolean', () => {
    Observable.make(store, ['boolean'])

    store.boolean = true
    expect(store.boolean).toBeTruthy()
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.boolean = false
    expect(store.boolean).toBeFalsy()
    expect(WatcherManager.onWrite).toBeCalledTimes(2)
  })

  it('works with function', () => {
    Observable.make(store, ['function'])

    store.function = () => true
    expect(store.function()).toBeTruthy()
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('works with null', () => {
    Observable.make(store, ['null'])

    store.null = 0
    expect(store.null).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.null = null
    expect(store.null).toBeNull()
    expect(WatcherManager.onWrite).toBeCalledTimes(2)
  })

  it('works with number', () => {
    Observable.make(store, ['number'])

    store.number++
    expect(store.number).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('works with object', () => {
    Observable.make(store, ['object'])

    store.object.a = 0
    expect(store.object).toStrictEqual({ a: 0 })
    expect(store.object.a).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.object.a++
    expect(store.object).toStrictEqual({ a: 1 })
    expect(store.object.a).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(2)

    store.object.b = { c: 0 }
    expect(store.object).toStrictEqual({ a: 1, b: { c: 0 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 0 })
    expect(store.object.b.c).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(3)

    store.object.b.c++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 1 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 1 })
    expect(store.object.b.c).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(4)

    store = new Store()
    WatcherManager.onWrite = jest.fn()

    store.object = { a: 0, b: { c: 0 } }
    Observable.make(store, ['object'])

    store.object.a++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 0 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 0 })
    expect(store.object.b.c).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.object.b.c++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 1 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 1 })
    expect(store.object.b.c).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(2)
  })

  it('works with string', () => {
    Observable.make(store, ['string'])

    store.string = 'a'
    expect(store.string).toBe('a')
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('works with symbol', () => {
    let symbol: symbol

    Observable.make(store, ['symbol'])

    symbol = Symbol()
    store.symbol = symbol

    expect(store.symbol).toBe(symbol)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('works with undefined', () => {
    Observable.make(store, ['undefined'])

    store.undefined = 0
    expect(store.undefined).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.undefined = undefined
    expect(store.undefined).toBeUndefined()
    expect(WatcherManager.onWrite).toBeCalledTimes(2)
  })

  it('works with array', () => {
    Observable.make(store, ['array'])

    store.array.push(0)
    expect(store.array[0]).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.array.pop()
    expect(store.array).toHaveLength(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(3)

    store.array[0] = [0]
    expect(store.array).toStrictEqual([[0]])
    expect(store.array[0]).toStrictEqual([0])
    expect(store.array[0][0]).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(4)

    store.array[0][0] = 1
    expect(store.array).toStrictEqual([[1]])
    expect(store.array[0]).toStrictEqual([1])
    expect(store.array[0][0]).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(5)

    store = new Store()
    WatcherManager.onWrite = jest.fn()

    store.array = [0, [0]]
    Observable.make(store, ['array'])

    store.array[0] = 1
    expect(store.array).toStrictEqual([1, [0]])
    expect(store.array[0]).toBe(1)
    expect(store.array[1]).toStrictEqual([0])
    expect(store.array[1][0]).toStrictEqual(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    store.array[1][0] = 1
    expect(store.array).toStrictEqual([1, [1]])
    expect(store.array[0]).toBe(1)
    expect(store.array[1]).toStrictEqual([1])
    expect(store.array[1][0]).toStrictEqual(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(2)
  })

  it('works with date', () => {
    let date: Date

    Observable.make(store, ['date'])

    date = new Date()
    store.date = date

    expect(store.date).toBe(date)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)
  })

  it('does not observe an already observed target', () => {
    let administration: Administration<Store> | undefined

    Observable.make(store, [])
    administration = Administration.get(store)

    Observable.make(store, [])
    expect(Administration.get(store)).toBe(administration)

    store = new Store()
    store.object.a = { b: {}, m: new Map(), s: new Set() }
    Observable.make(store, ['object'])

    store.object.b = store.object.a
  })

  it('exposes the isProxy property for observed values', () => {
    Observable.make(store, ['object'])

    expect(store.object.isProxy).toBeTruthy()
    expect(() => {
      store.object.isProxy = 0
    }).toThrow()
  })

  it('does not throw when an object does not have the toString method', () => {
    Reflect.set(store.object, 'toString', undefined)
    expect(() => Observable.make(store, ['object'])).not.toThrow()
  })

  it('fails when trying to set protected properties', () => {
    Observable.make(store, ['object'])

    Object.defineProperty(store.object, 'a', {})

    expect(() => {
      store.object.a = 0
    }).toThrow()

    expect(() => {
      store.object.a = {}
    }).toThrow()
  })

  it('throws when trying to define or delete isProxy property', () => {
    Observable.make(store, ['object'])

    expect(() => Object.defineProperty(store.object, IS_PROXY_KEY, {})).toThrow()
    expect(() => delete store.object[IS_PROXY_KEY]).toThrow()
  })

  it('fails when trying to delete non configurable properties', () => {
    Observable.make(store, ['object'])

    Object.defineProperty(store.object, 'a', { configurable: false })
    expect(() => delete store.object.a).toThrow()
  })
})
