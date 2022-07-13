import { WatcherType } from '../definitions/enums'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types'
import { watch } from './watch'

/**
 * Runs an effect on any target properties change.
 *
 * ```ts
 * import { autorun, observe } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * autorun(() => {
 *   console.log(store.number)
 * }, store)
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function autorun<T extends object>(effect: WatcherAutorunEffect, target: T): WatcherDisposer {
  return watch(WatcherType.AUTORUN, effect, target)
}
