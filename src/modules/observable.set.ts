import { Administration } from './administration'
import { ParentObject } from './parent.object'

type SetAdd<T> = (value: T) => Set<T>
type SetClear = () => void
type SetDelete<T> = (value: T) => boolean

export class ObservableSet {
  static make<T extends object, U extends object, V>(root: T, target: U, set: Set<V>): Set<V> {
    let _add: SetAdd<V>, _clear: SetClear, _delete: SetDelete<V>

    _add = set.add.bind(set)
    _clear = set.clear.bind(set)
    _delete = set.delete.bind(set)

    set.add = (value: V) => {
      let set: Set<V>

      set = _add(value)

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()

      return set
    }
    set.clear = () => {
      _clear()

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()
    }
    set.delete = (value: V) => {
      let deleted: boolean

      deleted = _delete(value)
      if (!deleted) return false

      Administration.get(root)?.onChange()
      Administration.get(set)?.onChange()

      return true
    }

    Administration.define(set, [], set)
    ParentObject.define(set, target)

    return set
  }
}
