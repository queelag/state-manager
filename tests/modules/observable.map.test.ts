import { beforeAll, describe, expect, it, vi } from 'vitest'
import { ObservableMap } from '../../src/modules/observable.map'
import { WatcherManager } from '../../src/modules/watcher.manager'

describe('ObservableMap', () => {
  beforeAll(() => {
    WatcherManager.onWrite = vi.fn()
  })

  it('makes a map observable', () => {
    let map: Map<any, any>

    map = new Map()
    ObservableMap.make({}, {}, '', map, {})

    expect(map.set(0, 0)).toBe(map)
    expect(map.get(0)).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    expect(map.set(1, 1)).toBe(map)
    expect(map.get(1)).toBe(1)
    expect(WatcherManager.onWrite).toBeCalledTimes(2)

    expect(map.delete(0)).toBeTruthy()
    expect(map.has(0)).toBeFalsy()
    expect(WatcherManager.onWrite).toBeCalledTimes(3)
    expect(map.delete(0)).toBeFalsy()
    expect(WatcherManager.onWrite).toHaveReturnedTimes(3)

    map.clear()
    expect([...map.entries()]).toHaveLength(0)
    expect([...map.keys()]).toHaveLength(0)
    expect([...map.values()]).toHaveLength(0)
    expect(map.size).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(4)
  })
})
