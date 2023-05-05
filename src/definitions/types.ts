import { WatcherObservable } from '../classes/watcher-observable.js'

export type WatcherAutorunEffect = () => any
export type WatcherDisposer = () => void
export type WatcherReactionEffect<T> = (value: T) => any
export type WatcherReactionExpression<T> = () => T
export type WatcherReadEffect<T extends object> = (observable: WatcherObservable<T>) => any
export type WatcherWhenEffect = () => any
export type WatcherWhenPredicate = () => boolean
