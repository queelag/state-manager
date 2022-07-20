import { ADMINISTRATION_SYMBOL } from '../../src/definitions/constants'
import { ObservableSet } from '../../src/modules/observable.set'

describe('ObservableSet', () => {
  it('makes a set observable', () => {
    let onChange: jest.Mock, root: object, set: Set<any>

    onChange = jest.fn()
    root = { [ADMINISTRATION_SYMBOL]: { onChange } }
    set = new Set()

    ObservableSet.make(root, {}, '', set, {})

    expect(set.add(0)).toBe(set)
    expect(set.has(0)).toBeTruthy()
    expect(onChange).toBeCalledTimes(1)

    expect(set.add(1)).toBe(set)
    expect(set.has(1)).toBeTruthy()
    expect(onChange).toBeCalledTimes(2)

    expect(set.delete(0)).toBeTruthy()
    expect(set.has(0)).toBeFalsy()
    expect(onChange).toBeCalledTimes(3)
    expect(set.delete(0)).toBeFalsy()
    expect(onChange).toBeCalledTimes(3)

    set.clear()
    expect(set.size).toBe(0)
    expect(onChange).toBeCalledTimes(4)
  })
})
