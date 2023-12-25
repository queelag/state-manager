import { ADMINISTRATION_SYMBOL, IS_PROXY_KEY } from '../definitions/constants.js'

export function isObservable<T extends object>(target: T): boolean {
  if (typeof target !== 'object' || target === null) {
    return false
  }

  if (Reflect.has(target, ADMINISTRATION_SYMBOL)) {
    return true
  }

  if (Reflect.get(target, IS_PROXY_KEY) === true) {
    return true
  }

  return false
}
