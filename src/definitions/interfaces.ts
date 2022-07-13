import { WatcherAutorunEffect, WatcherDispatchEffect, WatcherReactionEffect, WatcherReactionExpression, WatcherWhenEffect, WatcherWhenPredicate } from './types'

export interface WatcherAutorun {
  effect: WatcherAutorunEffect
}

export interface WatcherDispatch {
  effect: WatcherDispatchEffect
}

export interface WatcherReaction<T> {
  effect: WatcherReactionEffect<T>
  expression: WatcherReactionExpression<T>
  value: T
}

export interface WatcherWhen {
  effect: WatcherWhenEffect
  predicate: WatcherWhenPredicate
  value: boolean
}
