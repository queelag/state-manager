import { tc } from '@aracna/core'
import { WatcherManager } from '../classes/watcher-manager.js'
import { WatcherObservable } from '../classes/watcher-observable.js'
import { Watcher } from '../classes/watcher.js'
import type {
  WatcherAutorunEffect,
  WatcherDisposer,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherReadEffect,
  WatcherType,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'

export function watch(type: 'autorun', effect: WatcherAutorunEffect): WatcherDisposer
export function watch<U>(type: 'reaction', expression: WatcherReactionExpression<U>, effect: WatcherReactionEffect<U>): WatcherDisposer
export function watch<T extends object>(type: 'read', effect: WatcherReadEffect<T>): WatcherDisposer
export function watch(type: 'when', predicate: WatcherWhenPredicate, effect: WatcherWhenEffect): WatcherDisposer
export function watch<T extends object, U>(type: WatcherType, ...args: any): WatcherDisposer {
  let watcher: Watcher<T, U> | undefined

  switch (type) {
    case 'autorun':
    case 'read':
      watcher = WatcherManager.find(type, args[0])
      break
    case 'reaction':
      watcher = WatcherManager.find(type, args[1], args[0])
      break
    case 'when':
      watcher = WatcherManager.find(type, args[1], undefined, args[0])
      break
  }

  if (watcher) {
    ModuleLogger.warn('watch', `This watcher already exists.`, watcher)
    return WatcherManager.getDisposer(watcher)
  }

  switch (type) {
    case 'autorun':
    case 'read':
      watcher = new Watcher(type as any, args[0])
      break
    case 'reaction':
    case 'when':
      watcher = new Watcher(type as any, args[1], args[0])
      break
  }

  switch (type) {
    case 'autorun':
    case 'reaction':
    case 'when': {
      let rd: WatcherDisposer

      rd = watch('read', (observable: WatcherObservable<T>) => {
        watcher?.observables.push(observable)
      })

      tc(() => watcher?.autorun.effect())
      tc(() => watcher?.reaction.expression())
      tc(() => watcher?.when.predicate())

      rd()

      break
    }
  }

  WatcherManager.watchers.push(watcher)
  ModuleLogger.verbose('watch', `The watcher has been pushed.`, watcher)

  return WatcherManager.getDisposer(watcher)
}
