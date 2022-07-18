import { IS_PROXY_KEY } from '../definitions/constants'

/**
 * Checks if T is an observable.
 *
 * ```ts
 * import { isObservable, observe } from '@queelag/state-manager'
 *
 * const store = observe({ observed: {}, unobserved: {} }, ['observer'])
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
  return typeof target === 'object' && Reflect.get(target, IS_PROXY_KEY)
}
