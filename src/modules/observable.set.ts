import { IS_PROXY_KEY } from '../definitions/constants'
import { Administration } from './administration'
import { GLOBAL_OBSERVABLE } from './global.observable'

type SetAdd<T> = (value: T) => Set<T>
type SetClear = () => void
type SetDelete<T> = (value: T) => boolean

export class ObservableSet {
  static make<T extends object, U extends object, V>(root: T, target: U, key: PropertyKey, set: Set<V>, receiver: any): boolean {
    let _add: SetAdd<V>, _clear: SetClear, _delete: SetDelete<V>

    if (ObservableSet.isProxy(set)) {
      set = ObservableSet.toJS(set)
    }

    _add = set.add.bind(set)
    _clear = set.clear.bind(set)
    _delete = set.delete.bind(set)

    set.add = (value: V) => {
      let set: Set<V>

      set = _add(value)

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()
      Administration.get(GLOBAL_OBSERVABLE)?.onChange()

      return set
    }
    set.clear = () => {
      _clear()

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()
      Administration.get(GLOBAL_OBSERVABLE)?.onChange()
    }
    set.delete = (value: V) => {
      let deleted: boolean

      deleted = _delete(value)
      if (!deleted) return false

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()
      Administration.get(GLOBAL_OBSERVABLE)?.onChange()

      return true
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
