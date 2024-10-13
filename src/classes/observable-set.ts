import { IS_PROXY_KEY } from '../definitions/constants.js'
import { Administration } from './administration.js'
import { WatcherManager } from './watcher-manager.js'

type SetAdd<T> = (value: T) => Set<T>
type SetClear = () => void
type SetDelete<T> = (value: T) => boolean
type SetEntries<T> = () => SetIterator<[T, T]>
type SetKeys<T> = () => SetIterator<T>
type SetValues<T> = () => SetIterator<T>

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
      WatcherManager.onWrite('set-add', set, 'add', value)

      return set
    }
    set.clear = () => {
      _clear()
      WatcherManager.onWrite('set-clear', set, 'clear', set)
    }
    set.delete = (value: V) => {
      let deleted: boolean

      deleted = _delete(value)
      if (!deleted) return false

      WatcherManager.onWrite('set-delete', set, value as any, undefined)

      return true
    }
    set.entries = () => {
      WatcherManager.onRead('set-entries', set, 'entries', [..._entries()])
      return _entries()
    }
    set.keys = () => {
      WatcherManager.onRead('set-keys', set, 'keys', [..._keys()])
      return _keys()
    }
    set.values = () => {
      WatcherManager.onRead('set-values', set, 'values', [..._values()])
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
