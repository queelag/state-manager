import { isArray } from '@aracna/core'
import { ObservableMap } from '../modules/observable-map.js'
import { ObservableObject } from '../modules/observable-object.js'
import { ObservableSet } from '../modules/observable-set.js'

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
