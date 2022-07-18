import { Administration } from './administration'

type MapClear = () => void
type MapDelete<K> = (key: K) => boolean
type MapSet<K, V> = (key: K, value: V) => Map<K, V>

export class ObservableMap {
  static make<T extends object, K, V>(root: T, map: Map<K, V>): Map<K, V> {
    let _clear: MapClear, _delete: MapDelete<K>, _set: MapSet<K, V>

    _clear = map.clear.bind(map)
    _delete = map.delete.bind(map)
    _set = map.set.bind(map)

    map.clear = () => {
      _clear()
      Administration.get(map)?.onChange()
    }
    map.delete = (key: K) => {
      let deleted: boolean

      deleted = _delete(key)
      if (!deleted) return false

      Administration.get(map)?.onChange()

      return true
    }
    map.set = (key: K, value: V) => {
      let map: Map<K, V>

      map = _set(key, value)
      Administration.get(map)?.onChange()

      return map
    }

    Administration.set(map, [], new Proxy({}, {}))

    return map
  }
}
