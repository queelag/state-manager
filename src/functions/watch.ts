import { tc } from '@aracna/core'
import { WatcherManager } from '../classes/watcher-manager.js'
import { WatcherObservable } from '../classes/watcher-observable.js'
import { Watcher } from '../classes/watcher.js'
import { WatcherType } from '../definitions/enums.js'
import {
  WatcherAutorunEffect,
  WatcherDisposer,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherReadEffect,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'

export function watch(type: WatcherType.AUTORUN, effect: WatcherAutorunEffect): WatcherDisposer
export function watch<U>(type: WatcherType.REACTION, expression: WatcherReactionExpression<U>, effect: WatcherReactionEffect<U>): WatcherDisposer
export function watch<T extends object>(type: WatcherType.READ, effect: WatcherReadEffect<T>): WatcherDisposer
export function watch(type: WatcherType.WHEN, predicate: WatcherWhenPredicate, effect: WatcherWhenEffect): WatcherDisposer
export function watch<T extends object, U>(type: WatcherType, ...args: any): WatcherDisposer {
  let watcher: Watcher<T, U> | undefined

  switch (type) {
    case WatcherType.AUTORUN:
    case WatcherType.READ:
      watcher = WatcherManager.find(type, args[0])
      break
    case WatcherType.REACTION:
      watcher = WatcherManager.find(type, args[1], args[0])
      break
    case WatcherType.WHEN:
      watcher = WatcherManager.find(type, args[1], undefined, args[0])
      break
  }

  if (watcher) {
    ModuleLogger.warn('watch', `This watcher already exists.`, watcher)
    return WatcherManager.getDisposer(watcher)
  }

  switch (type) {
    case WatcherType.AUTORUN:
    case WatcherType.READ:
      watcher = new Watcher(type as any, args[0])
      break
    case WatcherType.REACTION:
    case WatcherType.WHEN:
      watcher = new Watcher(type as any, args[1], args[0])
      break
  }

  switch (type) {
    case WatcherType.AUTORUN:
    case WatcherType.REACTION:
    case WatcherType.WHEN: {
      let rd: WatcherDisposer

      rd = watch(WatcherType.READ, (observable: WatcherObservable<T>) => {
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
