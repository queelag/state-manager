import type { WatcherDisposer, WatcherReactionEffect, WatcherReactionExpression } from '../definitions/types.js'
import { watch } from './watch.js'

/**
 * Runs an effect whenever any of the values it references from an observable change inside the expression.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/reaction)
 */
export function reaction<T>(expression: WatcherReactionExpression<T>, effect: WatcherReactionEffect<T>): WatcherDisposer {
  return watch('reaction', expression, effect)
}
