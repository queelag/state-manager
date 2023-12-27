import { DeferredPromise } from '@aracna/core'
import { WatcherType } from '../definitions/enums.js'
import { WatcherDisposer, WatcherWhenEffect, WatcherWhenPredicate } from '../definitions/types.js'
import { watch } from './watch.js'

/**
 * Runs an effect whenever the predicate becomes true.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/when)
 */
export function when(predicate: WatcherWhenPredicate, effect: WatcherWhenEffect): WatcherDisposer
/**
 * Returns a promise that resolves when the predicate becomes true.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/when)
 */
export function when(predicate: WatcherWhenPredicate): Promise<void>
export function when(predicate: WatcherWhenPredicate, ...args: any): any {
  let effect: WatcherWhenEffect

  switch (args.length) {
    case 0: {
      let promise: DeferredPromise<void>, disposer: WatcherDisposer

      effect = () => {
        disposer()
        promise.resolve()
      }

      promise = new DeferredPromise()
      disposer = watch(WatcherType.WHEN, predicate, effect)

      return promise.instance
    }
    case 1:
      return watch(WatcherType.WHEN, predicate, args[0])
  }
}
