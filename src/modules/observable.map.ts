import { IS_PROXY_KEY } from '../definitions/constants'
import { Administration } from './administration'

type MapClear = () => void
type MapDelete<K> = (key: K) => boolean
type MapSet<K, V> = (key: K, value: V) => Map<K, V>

export class ObservableMap {
  static make<T extends object, U extends object, K, V>(root: T, target: U, p: PropertyKey, map: Map<K, V>, receiver: any): boolean {
    let _clear: MapClear, _delete: MapDelete<K>, _set: MapSet<K, V>

    if (ObservableMap.isProxy(map)) {
      map = ObservableMap.toJS(map)
    }

    _clear = map.clear.bind(map)
    _delete = map.delete.bind(map)
    _set = map.set.bind(map)

    map.clear = () => {
      _clear()

      Administration.get(root)?.onChange()
      Administration.get(map)?.onChange()
    }
    map.delete = (key: K) => {
      let deleted: boolean

      deleted = _delete(key)
      if (!deleted) return false

      Administration.get(root)?.onChange()
      Administration.get(map)?.onChange()

      return true
    }
    map.set = (key: K, value: V) => {
      let map: Map<K, V>

      map = _set(key, value)

      Administration.get(root)?.onChange()
      Administration.get(map)?.onChange()

      return map
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
