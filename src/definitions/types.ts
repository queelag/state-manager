import { WatcherObservable } from '../classes/watcher-observable.js'

export type WatcherAutorunEffect = () => unknown
export type WatcherDisposer = () => void
export type WatcherReactionEffect<T> = (value: T) => unknown
export type WatcherReactionExpression<T> = () => T
export type WatcherReadEffect<T extends object> = (observable: WatcherObservable<T>) => unknown
export type WatcherWhenEffect = () => unknown
export type WatcherWhenPredicate = () => boolean
