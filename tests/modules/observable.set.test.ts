import { ObservableSet } from '../../src/modules/observable.set'
import { WatcherManager } from '../../src/modules/watcher.manager'

describe('ObservableSet', () => {
  it('makes a set observable', () => {
    let set: Set<any>

    WatcherManager.onWrite = jest.fn()

    set = new Set()
    ObservableSet.make({}, {}, '', set, {})

    expect(set.add(0)).toBe(set)
    expect(set.has(0)).toBeTruthy()
    expect(WatcherManager.onWrite).toBeCalledTimes(1)

    expect(set.add(1)).toBe(set)
    expect(set.has(1)).toBeTruthy()
    expect(WatcherManager.onWrite).toBeCalledTimes(2)

    expect(set.delete(0)).toBeTruthy()
    expect(set.has(0)).toBeFalsy()
    expect(WatcherManager.onWrite).toBeCalledTimes(3)
    expect(set.delete(0)).toBeFalsy()
    expect(WatcherManager.onWrite).toBeCalledTimes(3)

    set.clear()
    expect([...set.entries()]).toHaveLength(0)
    expect([...set.keys()]).toHaveLength(0)
    expect([...set.values()]).toHaveLength(0)
    expect(set.size).toBe(0)
    expect(WatcherManager.onWrite).toBeCalledTimes(4)
  })
})
