import { ArrayUtils, noop } from '@queelag/core'
import { Watcher } from '../classes/watcher'
import { WatcherType } from '../definitions/enums'
import {
  WatcherAutorunEffect,
  WatcherDispatchEffect,
  WatcherDisposer,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types'
import { ModuleLogger } from '../loggers/module.logger'
import { Administration } from './administration'
import { GLOBAL_OBSERVABLE } from './global.observable'

/**
 * Registers an AUTORUN watcher on target.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * watch(
 *   WatcherType.AUTORUN,
 *   () => console.log(store.number),
 *   store
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function watch<T extends object, U>(type: WatcherType.AUTORUN, effect: WatcherAutorunEffect, target?: T): WatcherDisposer
/**
 * Registers a DISPATCH watcher on target.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * watch(
 *   WatcherType.DISPATCH,
 *   // function that triggers a re-render
 *   () => undefined,
 *   store
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function watch<T extends object, U>(type: WatcherType.DISPATCH, effect: WatcherDispatchEffect, target?: T): WatcherDisposer
/**
 * Registers a REACTION watcher on target.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ number: 0 })
 *
 * watch(
 *   WatcherType.REACTION,
 *   () => store.number,
 *   () => console.log(store.number),
 *   store
 * )
 *
 * store.number++
 * ```
 *
 * @category Module
 */
export function watch<T extends object, U>(
  type: WatcherType.REACTION,
  expression: WatcherReactionExpression<U>,
  effect: WatcherReactionEffect<U>,
  target?: T
): WatcherDisposer
/**
 * Registers a WHEN watcher on target.
 *
 * ```ts
 * import { observe, watch, WatcherType } from '@queelag/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * watch(
 *   WatcherType.WHEN,
 *   () => console.log(store.boolean),
 *   store
 * )
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
export function watch<T extends object, U>(type: WatcherType.WHEN, predicate: WatcherWhenPredicate, effect: WatcherWhenEffect, target?: T): WatcherDisposer
export function watch<T extends object, U>(type: WatcherType, ...args: any): WatcherDisposer {
  let target: T | undefined,
    administration: Administration<any> | undefined,
    disposer: (watcher: Watcher<U>) => WatcherDisposer,
    watcher: Watcher<U> | undefined

  switch (type) {
    case WatcherType.AUTORUN:
    case WatcherType.DISPATCH:
      target = args[1]
      break
    case WatcherType.REACTION:
    case WatcherType.WHEN:
      target = args[2]
      break
  }

  administration = Administration.get(target || GLOBAL_OBSERVABLE)
  if (!administration) return noop

  disposer = (watcher: Watcher<U>) => () => {
    administration = administration as Administration<any>

    administration.watchers = ArrayUtils.remove(administration.watchers, (v: Watcher) => v === watcher)
    ModuleLogger.verbose('watch', 'disposer', `The watcher has been disposed of.`, watcher)
  }

  switch (type) {
    case WatcherType.AUTORUN:
      watcher = administration.watchers.find((v: Watcher) => v.autorun.effect === args[0] && v.type === type)
      break
    case WatcherType.DISPATCH:
      watcher = administration.watchers.find((v: Watcher) => v.dispatch.effect === args[0] && v.type === type)
      break
    case WatcherType.REACTION:
      watcher = administration.watchers.find((v: Watcher) => v.reaction.effect === args[1] && v.reaction.expression === args[0] && v.type === type)
      break
    case WatcherType.WHEN:
      watcher = administration.watchers.find((v: Watcher) => v.when.effect === args[1] && v.when.predicate === args[0] && v.type === type)
      break
  }

  if (watcher) {
    ModuleLogger.warn('watch', `This watcher already exists.`, watcher)
    return disposer(watcher)
  }

  switch (type) {
    case WatcherType.AUTORUN:
    case WatcherType.DISPATCH:
      watcher = new Watcher(type as any, args[0])
      break
    case WatcherType.REACTION:
    case WatcherType.WHEN:
      watcher = new Watcher(type as any, args[1], args[0])
      break
  }

  administration.watchers.push(watcher)
  ModuleLogger.verbose('watch', `The watcher has been pushed.`, watcher)

  return disposer(watcher)
}
