import { observe as _observe } from '../../src'
import { Administration } from '../../src/modules/administration'
import { Store } from '../get.test.store'

let onChange: jest.Mock

function observe<T extends object, K extends keyof T>(target: T, keys: K[]) {
  _observe(target, keys)
  Reflect.set(Administration.get(target) || {}, 'onChange', onChange)

  return target
}

describe('observe', () => {
  let store: Store

  beforeEach(() => {
    store = new Store()
    onChange = jest.fn()
  })

  it('works with bigint', () => {
    observe(store, ['bigint'])

    store.bigint++
    expect(store.bigint).toBe(1n)
    expect(onChange).toBeCalledTimes(1)
  })

  it('works with boolean', () => {
    observe(store, ['boolean'])

    store.boolean = true
    expect(store.boolean).toBeTruthy()
    expect(onChange).toBeCalledTimes(1)

    store.boolean = false
    expect(store.boolean).toBeFalsy()
    expect(onChange).toBeCalledTimes(2)
  })

  it('works with function', () => {
    observe(store, ['function'])

    store.function = () => true
    expect(store.function()).toBeTruthy()
    expect(onChange).toBeCalledTimes(1)
  })

  it('works with null', () => {
    observe(store, ['null'])

    store.null = 0
    expect(store.null).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    store.null = null
    expect(store.null).toBeNull()
    expect(onChange).toBeCalledTimes(2)
  })

  it('works with number', () => {
    observe(store, ['number'])

    store.number++
    expect(store.number).toBe(1)
    expect(onChange).toBeCalledTimes(1)
  })

  it('works with object', () => {
    observe(store, ['object'])

    store.object.a = 0
    expect(store.object).toStrictEqual({ a: 0 })
    expect(store.object.a).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    store.object.a++
    expect(store.object).toStrictEqual({ a: 1 })
    expect(store.object.a).toBe(1)
    expect(onChange).toBeCalledTimes(2)

    store.object.b = { c: 0 }
    expect(store.object).toStrictEqual({ a: 1, b: { c: 0 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 0 })
    expect(store.object.b.c).toBe(0)
    expect(onChange).toBeCalledTimes(3)

    store.object.b.c++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 1 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 1 })
    expect(store.object.b.c).toBe(1)
    expect(onChange).toBeCalledTimes(4)

    store = new Store()
    onChange = jest.fn()

    store.object = { a: 0, b: { c: 0 } }
    observe(store, ['object'])

    store.object.a++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 0 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 0 })
    expect(store.object.b.c).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    store.object.b.c++
    expect(store.object).toStrictEqual({ a: 1, b: { c: 1 } })
    expect(store.object.a).toBe(1)
    expect(store.object.b).toStrictEqual({ c: 1 })
    expect(store.object.b.c).toBe(1)
    expect(onChange).toBeCalledTimes(2)
  })

  it('works with string', () => {
    observe(store, ['string'])

    store.string = 'a'
    expect(store.string).toBe('a')
    expect(onChange).toBeCalledTimes(1)
  })

  it('works with symbol', () => {
    let symbol: symbol

    observe(store, ['symbol'])

    symbol = Symbol()
    store.symbol = symbol

    expect(store.symbol).toBe(symbol)
    expect(onChange).toBeCalledTimes(1)
  })

  it('works with undefined', () => {
    observe(store, ['undefined'])

    store.undefined = 0
    expect(store.undefined).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    store.undefined = undefined
    expect(store.undefined).toBeUndefined()
    expect(onChange).toBeCalledTimes(2)
  })

  it('works with array', () => {
    observe(store, ['array'])

    store.array.push(0)
    expect(store.array[0]).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    store.array.pop()
    expect(store.array).toHaveLength(0)
    expect(onChange).toBeCalledTimes(2)

    store.array[0] = [0]
    expect(store.array).toStrictEqual([[0]])
    expect(store.array[0]).toStrictEqual([0])
    expect(store.array[0][0]).toBe(0)
    expect(onChange).toBeCalledTimes(3)

    store.array[0][0] = 1
    expect(store.array).toStrictEqual([[1]])
    expect(store.array[0]).toStrictEqual([1])
    expect(store.array[0][0]).toBe(1)
    expect(onChange).toBeCalledTimes(4)

    store = new Store()
    onChange = jest.fn()

    store.array = [0, [0]]
    observe(store, ['array'])

    store.array[0] = 1
    expect(store.array).toStrictEqual([1, [0]])
    expect(store.array[0]).toBe(1)
    expect(store.array[1]).toStrictEqual([0])
    expect(store.array[1][0]).toStrictEqual(0)
    expect(onChange).toBeCalledTimes(1)

    store.array[1][0] = 1
    expect(store.array).toStrictEqual([1, [1]])
    expect(store.array[0]).toBe(1)
    expect(store.array[1]).toStrictEqual([1])
    expect(store.array[1][0]).toStrictEqual(1)
    expect(onChange).toBeCalledTimes(2)
  })

  it('works with date', () => {
    let date: Date

    observe(store, ['date'])

    date = new Date()
    store.date = date

    expect(store.date).toBe(date)
    expect(onChange).toBeCalledTimes(1)
  })

  it('does not observe an already observed target', () => {
    let administration: Administration<Store> | undefined

    observe(store, [])
    administration = Administration.get(store)

    observe(store, [])
    expect(Administration.get(store)).toBe(administration)

    store = new Store()
    store.object.a = { b: {} }
    observe(store, ['object'])

    store.object.b = store.object.a
  })

  it('exposes the isProxy property for observed values', () => {
    observe(store, ['object'])

    expect(store.object.isProxy).toBeTruthy()
    expect(() => {
      store.object.isProxy = 0
    }).toThrow()
  })

  it('does not throw when an object does not have the toString method', () => {
    Reflect.set(store.object, 'toString', undefined)
    expect(() => observe(store, ['object'])).not.toThrow()
  })

  it('fails when trying to set protected properties', () => {
    observe(store, ['object'])

    Object.defineProperty(store.object, 'a', {})

    expect(() => {
      store.object.a = 0
    }).toThrow()

    expect(() => {
      store.object.a = {}
    }).toThrow()
  })
})
