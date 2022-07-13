import { WatcherType } from '../definitions/enums'
import { WatcherDisposer, WatcherReactionEffect, WatcherReactionExpression } from '../definitions/types'
import { watch } from './watch'

export function reaction<T extends object, U>(expression: WatcherReactionExpression<U>, effect: WatcherReactionEffect<U>, target: T): WatcherDisposer {
  return watch(WatcherType.REACTION, expression, effect, target)
}
