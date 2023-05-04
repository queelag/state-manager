import { WatcherType } from '../definitions/enums.js'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types.js'
import { watch } from './watch.js'

/**
 * Runs an effect when any of the properties used inside of the effect change.
 *
 * ```ts
 * import { autorun, observe } from '@aracna/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * autorun(() => {
 *   console.log(store.number)
 * })
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function autorun(effect: WatcherAutorunEffect): WatcherDisposer {
  return watch(WatcherType.AUTORUN, effect)
}
