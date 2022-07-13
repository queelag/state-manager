import { ModuleLogger } from '../loggers/module.logger'
import { Administration } from './administration'
import { Observable } from './observable'

/**
 * Observes the target and lets you watch its properties changes.
 *
 * Supports all primitives, Date, Map and Set objects.
 * Any other non plain object will be observed shallowly.
 *
 * ```ts
 * import { observe } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 * ```
 *
 * @category Module
 */
export function observe<T extends object, K extends keyof T>(target: T, keys: K[]): T {
  let clone: T, proxy: T

  if (Administration.isDefined(target)) {
    ModuleLogger.warn('observe', `The target is already an observable.`, target)
    return target
  }

  clone = { ...target }
  ModuleLogger.verbose('observe', `The target has been cloned.`, clone)

  Observable.makeProperties(target, clone, keys)

  proxy = new Proxy(clone, Observable.getProxyHandler(target))
  ModuleLogger.verbose('observe', `The clone has been proxied.`, proxy)

  Administration.set(target, keys, proxy)
  ModuleLogger.verbose('observe', `The administration class has been set.`, Administration.get(target))

  keys.forEach((k: keyof T) => {
    Object.defineProperty(target, k, Observable.getPropertyDescriptor(target, k))
    ModuleLogger.verbose('observe', `The property "${String(k)}" is now bound to the proxy.`, [target[k]])
  })

  return target
}
