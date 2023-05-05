import { DeferredPromise } from '@aracna/core'
import { WatcherType } from '../definitions/enums.js'
import { WatcherDisposer, WatcherWhenEffect, WatcherWhenPredicate } from '../definitions/types.js'
import { watch } from './watch.js'

/**
 * Runs an effect when the predicate is truthy.
 *
 * ```ts
 * import { observe, when } from '@aracna/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * when(
 *   () => store.boolean,
 *   () => {
 *     console.log(store.boolean)
 *   }
 * )
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
export function when(predicate: WatcherWhenPredicate, effect: WatcherWhenEffect): WatcherDisposer
/**
 * Returns a Promise which will be resolved when the predicate is truthy.
 *
 * ```ts
 * import { observe, when } from '@aracna/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * when(() => store.boolean).then(() => console.log(store.boolean))
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
export function when(predicate: WatcherWhenPredicate): Promise<void>
export function when(predicate: WatcherWhenPredicate, ...args: any): any {
  let effect: WatcherWhenEffect

  switch (args.length) {
    case 0:
      let promise: DeferredPromise<void>, disposer: WatcherDisposer

      effect = () => {
        disposer()
        promise.resolve()
      }

      promise = new DeferredPromise()
      disposer = watch(WatcherType.WHEN, predicate, effect)

      return promise.instance
    case 1:
      return watch(WatcherType.WHEN, predicate, args[0])
  }
}
