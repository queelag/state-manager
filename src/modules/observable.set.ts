import { IS_PROXY_KEY } from '../definitions/constants'
import { WatcherObservableType, WriteType } from '../definitions/enums'
import { Administration } from './administration'
import { WatcherManager } from './watcher.manager'

type SetAdd<T> = (value: T) => Set<T>
type SetClear = () => void
type SetDelete<T> = (value: T) => boolean
type SetEntries<T> = () => IterableIterator<[T, T]>
type SetKeys<T> = () => IterableIterator<T>
type SetValues<T> = () => IterableIterator<T>

export class ObservableSet {
  static make<T extends object, U extends object, V>(root: T, target: U, key: PropertyKey, set: Set<V>, receiver: any): boolean {
    let _add: SetAdd<V>, _clear: SetClear, _delete: SetDelete<V>, _entries: SetEntries<V>, _keys: SetKeys<V>, _values: SetValues<V>

    if (ObservableSet.isProxy(set)) {
      return true
    }

    _add = set.add.bind(set)
    _clear = set.clear.bind(set)
    _delete = set.delete.bind(set)
    _entries = set.entries.bind(set)
    _keys = set.keys.bind(set)
    _values = set.values.bind(set)

    set.add = (value: V) => {
      let set: Set<V>

      set = _add(value)
      WatcherManager.onWrite(WriteType.SET_ADD, set, 'add', value)

      return set
    }
    set.clear = () => {
      _clear()
      WatcherManager.onWrite(WriteType.SET_CLEAR, set, 'clear', set)
    }
    set.delete = (value: V) => {
      let deleted: boolean

      deleted = _delete(value)
      if (!deleted) return false

      WatcherManager.onWrite(WriteType.SET_DELETE, set, value as any, undefined)

      return true
    }
    set.entries = () => {
      WatcherManager.onRead(WatcherObservableType.SET_ENTRIES, set, 'entries', [..._entries()])
      return _entries()
    }
    set.keys = () => {
      WatcherManager.onRead(WatcherObservableType.SET_KEYS, set, 'keys', [..._keys()])
      return _keys()
    }
    set.values = () => {
      WatcherManager.onRead(WatcherObservableType.SET_VALUES, set, 'values', [..._values()])
      return _values()
    }

    Object.defineProperty(set, IS_PROXY_KEY, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    Administration.define(set, [], set, target, root)

    return Reflect.set(target, key, set, receiver)
  }

  static toJS<T>(set: Set<T>): Set<T> {
    return new Set(set.values())
  }

  static isProxy<T>(set: Set<T>): boolean {
    return Reflect.get(set, IS_PROXY_KEY) === true
  }
}
