import { WatcherType } from '../definitions/enums.js'
import { WatcherDisposer, WatcherReactionEffect, WatcherReactionExpression } from '../definitions/types.js'
import { watch } from './watch.js'

export function reaction<T>(expression: WatcherReactionExpression<T>, effect: WatcherReactionEffect<T>): WatcherDisposer {
  return watch(WatcherType.REACTION, expression, effect)
}
