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
 * const store = observe({ number: 0 }, ['number'])
 * ```
 *
 * @category Module
 */
export function observe<T extends object, K extends keyof T>(target: T, keys: K[]): T {
  return Observable.make(target, keys)
}
