import { WatcherType } from '../definitions/enums'
import { WatcherDisposer, WatcherReactionEffect, WatcherReactionExpression } from '../definitions/types'
import { watch } from './watch'

/**
 * Runs an effect when any of the properties used inside the expression change.
 *
 * ```ts
 * import { observe, reaction } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * reaction(
 *   () => store.number,
 *   () => {
 *     console.log(store.number)
 *   }
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function reaction<T>(expression: WatcherReactionExpression<T>, effect: WatcherReactionEffect<T>): WatcherDisposer {
  return watch(WatcherType.REACTION, expression, effect)
}
