import { WatcherAutorunEffect, WatcherReactionEffect, WatcherReactionExpression, WatcherReadEffect, WatcherWhenEffect, WatcherWhenPredicate } from './types'

export interface WatcherAutorun {
  effect: WatcherAutorunEffect
}

export interface WatcherReaction<T> {
  effect: WatcherReactionEffect<T>
  expression: WatcherReactionExpression<T>
  value: T
}

export interface WatcherRead<T extends object> {
  effect: WatcherReadEffect<T>
}

export interface WatcherWhen {
  effect: WatcherWhenEffect
  predicate: WatcherWhenPredicate
  value: boolean
}
