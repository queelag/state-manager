import type { WatcherObservable } from '../classes/watcher-observable.js'

export type WatcherAutorunEffect = () => unknown
export type WatcherDisposer = () => void

export type WatcherObservableType = 'map-entries' | 'map-get' | 'map-keys' | 'map-values' | 'proxy-handler-get' | 'set-entries' | 'set-keys' | 'set-values'

export type WatcherReactionEffect<T> = (value: T) => unknown
export type WatcherReactionExpression<T> = () => T
export type WatcherReadEffect<T extends object> = (observable: WatcherObservable<T>) => unknown

export type WatcherType = 'autorun' | 'reaction' | 'read' | 'when'

export type WatcherWhenEffect = () => unknown
export type WatcherWhenPredicate = () => boolean

export type WatcherWriteType =
  | 'map-clear'
  | 'map-delete'
  | 'map-set'
  | 'proxy-handler-delete-property'
  | 'proxy-handler-set'
  | 'set-add'
  | 'set-clear'
  | 'set-delete'
