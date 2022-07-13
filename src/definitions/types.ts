export type WatcherAutorunEffect = () => any
export type WatcherDispatchEffect = () => void
export type WatcherDisposer = () => void
export type WatcherReactionEffect<T> = (value: T) => any
export type WatcherReactionExpression<T> = () => T
export type WatcherWhenEffect = () => any
export type WatcherWhenPredicate = () => boolean
