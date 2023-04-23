import { WatcherType } from '../definitions/enums'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types'
import { watch } from './watch'

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
