import { IS_PROXY_KEY } from '../definitions/constants'
import { WatcherObservableType, WriteType } from '../definitions/enums'
import { Administration } from './administration'
import { WatcherManager } from './watcher.manager'

type MapClear = () => void
type MapDelete<K> = (key: K) => boolean
type MapEntries<K, V> = () => IterableIterator<[K, V]>
type MapGet<K, V> = (key: K) => V | undefined
type MapKeys<K> = () => IterableIterator<K>
type MapSet<K, V> = (key: K, value: V) => Map<K, V>
type MapValues<V> = () => IterableIterator<V>

export class ObservableMap {
  static make<T extends object, U extends object, K, V>(root: T, target: U, p: PropertyKey, map: Map<K, V>, receiver: any): boolean {
    let _clear: MapClear, _delete: MapDelete<K>, _entries: MapEntries<K, V>, _get: MapGet<K, V>, _keys: MapKeys<K>, _set: MapSet<K, V>, _values: MapValues<V>

    if (ObservableMap.isProxy(map)) {
      return true
    }

    _clear = map.clear.bind(map)
    _delete = map.delete.bind(map)
    _entries = map.entries.bind(map)
    _get = map.get.bind(map)
    _keys = map.keys.bind(map)
    _set = map.set.bind(map)
    _values = map.values.bind(map)

    map.clear = () => {
      _clear()
      WatcherManager.onWrite(WriteType.MAP_CLEAR, map, 'clear', map)
    }
    map.delete = (key: K) => {
      let deleted: boolean

      deleted = _delete(key)
      if (!deleted) return false

      WatcherManager.onWrite(WriteType.MAP_DELETE, map, key as any, undefined)

      return true
    }
    map.entries = () => {
      WatcherManager.onRead(WatcherObservableType.MAP_ENTRIES, map, 'entries', [..._entries()])
      return _entries()
    }
    map.get = (key: K) => {
      let value: V | undefined

      value = _get(key)
      WatcherManager.onRead(WatcherObservableType.MAP_GET, map, key as any, value)

      return value
    }
    map.keys = () => {
      WatcherManager.onRead(WatcherObservableType.MAP_KEYS, map, 'keys', [..._keys()])
      return _keys()
    }
    map.set = (key: K, value: V) => {
      let map: Map<K, V>

      map = _set(key, value)
      WatcherManager.onWrite(WriteType.MAP_SET, map, key as any, value)

      return map
    }
    map.values = () => {
      WatcherManager.onRead(WatcherObservableType.MAP_VALUES, map, 'values', [..._values()])
      return _values()
    }

    Object.defineProperty(map, IS_PROXY_KEY, {
      configurable: false,
      enumerable: false,
      value: true,
      writable: false
    })

    Administration.define(map, [], map, target, root)

    return Reflect.set(target, p, map, receiver)
  }

  static toJS<K, V>(map: Map<K, V>): Map<K, V> {
    return new Map(map.entries())
  }

  static isProxy<K, V>(map: Map<K, V>): boolean {
    return Reflect.get(map, IS_PROXY_KEY) === true
  }
}
