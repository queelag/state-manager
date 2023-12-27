import { ADMINISTRATION_SYMBOL, IS_PROXY_KEY } from '../definitions/constants.js'

/**
 * Checks if an object is an observable.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/is-observable)
 */
export function isObservable<T extends object>(object: T): boolean {
  if (typeof object !== 'object' || object === null) {
    return false
  }

  if (Reflect.has(object, ADMINISTRATION_SYMBOL)) {
    return true
  }

  if (Reflect.get(object, IS_PROXY_KEY) === true) {
    return true
  }

  return false
}
