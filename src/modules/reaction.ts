import { WatcherType } from '../definitions/enums'
import { WatcherDisposer, WatcherReactionEffect, WatcherReactionExpression } from '../definitions/types'
import { watch } from './watch'

/**
 * Runs an effect when the value returned from the expression changes.
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
 *   },
 *   store
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function reaction<T extends object, U>(expression: WatcherReactionExpression<U>, effect: WatcherReactionEffect<U>, target: T): WatcherDisposer {
  return watch(WatcherType.REACTION, expression, effect, target)
}
