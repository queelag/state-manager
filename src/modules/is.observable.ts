import { ObservableObject } from './observable.object'

/**
 * Checks if T is an observable.
 *
 * ```ts
 * import { isObservable, observe } from '@queelag/state-manager'
 *
 * const store = observe({ observed: {}, unobserved: {} }, ['observed'])
 *
 * // will be true
 * console.log(isObservable(store.observed))
 *
 * // will be false
 * console.log(isObservable(store.unobserved))
 * ```
 *
 * @category Module
 */
export function isObservable<T extends object>(target: T): boolean {
  return ObservableObject.isPropertyProxy(target)
}
