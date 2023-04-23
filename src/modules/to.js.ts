import { isArray } from '@aracna/core'
import { ObservableMap } from './observable.map'
import { ObservableObject } from './observable.object'
import { ObservableSet } from './observable.set'

/**
 * Converts the target to a plain object.
 *
 * ```ts
 * import { observe, toJS } from '@aracna/state-manager'
 *
 * const store = observe({ number: 0 })
 * console.log(toJS(store))
 * ```
 *
 * @category Module
 */
export function toJS<T extends object>(target: T): T {
  let clone: T = {} as T

  if (isArray(target)) {
    clone = [] as T
  }

  for (let key in target) {
    let property: any

    property = Reflect.get(target, key)

    if (ObservableObject.isPropertyNotProxiable(property)) {
      Reflect.set(clone, key, property)
      continue
    }

    switch (true) {
      case property instanceof Map:
        let map: Map<any, any>

        map = ObservableMap.toJS(property)
        Reflect.set(clone, key, map)

        break
      case property instanceof Set:
        let set: Set<any>

        set = ObservableSet.toJS(property)
        Reflect.set(clone, key, set)

        break
      default:
        Reflect.set(clone, key, toJS(property))
        break
    }
  }

  return clone
}
