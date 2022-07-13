import { ModuleLogger } from '../loggers/module.logger'
import { Administration } from './administration'
import { Observable } from './observable'

/**
 * Converts the target to a plain object.
 *
 * ```ts
 * import { observe, toJS } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 * console.log(toJS(store))
 * ```
 *
 * @category Module
 */
export function toJS<T extends object>(target: T): T {
  let clone: T

  clone = Array.isArray(target) ? ([...target] as T) : { ...target }
  ModuleLogger.verbose('toJS', `The target has been cloned.`, target, clone)

  Object.keys(clone).forEach((k: string) => {
    let property: any

    property = Reflect.get(clone, k)
    if (typeof property !== 'object' || property === null) return

    if (Observable.isObjectPropertyNotProxiable(property)) {
      return
    }

    switch (true) {
      case property instanceof Map:
        let map: Map<any, any>

        map = new Map(property.entries())
        Reflect.set(clone, k, map)

        ModuleLogger.verbose('toJS', `The map has been cloned`, property, map)

        break
      case property instanceof Set:
        let set: Set<any>

        set = new Set(property.entries())
        Reflect.set(clone, k, set)

        ModuleLogger.verbose('toJS', `The set has been cloned`, property, set)

        break
      default:
        Reflect.set(clone, k, toJS(property))
        break
    }
  })

  Administration.delete(clone)

  return clone
}
