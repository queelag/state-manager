import { DeferredPromise } from '@queelag/core'
import { WatcherType } from '../definitions/enums'
import { WatcherDisposer, WatcherWhenEffect, WatcherWhenPredicate } from '../definitions/types'
import { watch } from './watch'

/**
 * Runs an effect when the predicate is truthy.
 *
 * ```ts
 * import { observe, when } from '@queelag/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * when(
 *   () => store.boolean,
 *   () => {
 *     console.log(store.boolean)
 *   },
 *   store
 * )
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
export function when<T extends object>(predicate: WatcherWhenPredicate, effect: WatcherWhenEffect, target: T): WatcherDisposer
/**
 * Returns a Promise which will be resolved when the predicate is truthy.
 *
 * ```ts
 * import { observe, when } from '@queelag/state-manager'
 *
 * const store = observe({ boolean: false })
 *
 * when(() => store.boolean, store).then(() => console.log(store.boolean))
 *
 * store.boolean = true
 * store.boolean = false
 * ```
 *
 * @category Module
 */
export function when<T extends object>(predicate: WatcherWhenPredicate, target: T): Promise<void>
export function when<T extends object>(predicate: WatcherWhenPredicate, ...args: any): any {
  let effect: WatcherWhenEffect, target: T

  switch (args.length) {
    case 1:
      let promise: DeferredPromise<void>, disposer: WatcherDisposer

      effect = () => {
        disposer()
        promise.resolve()
      }
      target = args[0]

      promise = new DeferredPromise()
      disposer = watch(WatcherType.WHEN, predicate, effect, target)

      return promise.instance
    case 2:
      effect = args[0]
      target = args[1]

      return watch(WatcherType.WHEN, predicate, effect, target)
  }
}
