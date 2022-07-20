import { ADMINISTRATION_SYMBOL } from '../../src/definitions/constants'
import { ObservableMap } from '../../src/modules/observable.map'

describe('ObservableMap', () => {
  it('makes a map observable', () => {
    let onChange: jest.Mock, root: object, map: Map<any, any>

    onChange = jest.fn()
    root = { [ADMINISTRATION_SYMBOL]: { onChange } }
    map = new Map()

    ObservableMap.make(root, {}, '', map, {})

    expect(map.set(0, 0)).toBe(map)
    expect(map.get(0)).toBe(0)
    expect(onChange).toBeCalledTimes(1)

    expect(map.set(1, 1)).toBe(map)
    expect(map.get(1)).toBe(1)
    expect(onChange).toBeCalledTimes(2)

    expect(map.delete(0)).toBeTruthy()
    expect(map.has(0)).toBeFalsy()
    expect(onChange).toBeCalledTimes(3)
    expect(map.delete(0)).toBeFalsy()
    expect(onChange).toHaveReturnedTimes(3)

    map.clear()
    expect(map.size).toBe(0)
    expect(onChange).toBeCalledTimes(4)
  })
})
