import { KeyOf } from '@aracna/core'
import { Observable } from '../classes/observable.js'

/**
 * Makes an object observable.
 * Optionally the keys to observe can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/observe)
 */
export function observe<T extends object>(target: T, keys?: KeyOf.Shallow<T>[]): T
/**
 * Makes an object observable.
 * Optionally the keys to observe can be specified.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/observe)
 */
export function observe<T extends object>(target: T, keys?: string[]): T
export function observe<T extends object>(target: T, keys?: KeyOf.Shallow<T>[]): T {
  return Observable.make(target, keys)
}
