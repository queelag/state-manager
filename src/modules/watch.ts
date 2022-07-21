import { tc } from '@queelag/core'
import { Watcher } from '../classes/watcher'
import { WatcherObservable } from '../classes/watcher.observable'
import { WatcherType } from '../definitions/enums'
import {
  WatcherAutorunEffect,
  WatcherDisposer,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherReadEffect,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types'
import { ModuleLogger } from '../loggers/module.logger'
import { WatcherManager } from './watcher.manager'

/**
 * Registers an AUTORUN watcher.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * watch(
 *   WatcherType.AUTORUN,
 *   () => console.log(store.number)
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function watch(type: WatcherType.AUTORUN, effect: WatcherAutorunEffect): WatcherDisposer
/**
 * Registers a REACTION watcher.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * watch(
 *   WatcherType.REACTION,
 *   () => store.number,
 *   () => console.log(store.number)
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function watch<U>(type: WatcherType.REACTION, expression: WatcherReactionExpression<U>, effect: WatcherReactionEffect<U>): WatcherDisposer
/**
 * Registers a READ watcher.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * watch(
 *   WatcherType.READ,
 *   (target: object, key: PropertyKey, value: any) => console.log(target, key, value)
 * )
 *
 * console.log(store.boolean)
 * ```
 *
 * @category Module
 */
export function watch<T extends object>(type: WatcherType.READ, effect: WatcherReadEffect<T>): WatcherDisposer
/**
 * Registers a WHEN watcher.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * watch(
 *   WatcherType.WHEN,
 *   () => console.log(store.boolean)
 * )
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
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
    case WatcherType.WHEN:
      let rd: WatcherDisposer

      rd = watch(WatcherType.READ, (observable: WatcherObservable<T>) => {
        watcher?.observables.push(observable)
      })

      tc(() => watcher?.autorun.effect())
      tc(() => watcher?.reaction.expression())
      tc(() => watcher?.when.predicate())

      rd()
  }

  WatcherManager.watchers.push(watcher)
  ModuleLogger.verbose('watch', `The watcher has been pushed.`, watcher)

  return WatcherManager.getDisposer(watcher)
}
