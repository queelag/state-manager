import { IS_PROXY_KEY } from '../definitions/constants.js'

export function isObservable<T extends object>(target: T): boolean {
  return typeof target === 'object' && Reflect.get(target, IS_PROXY_KEY) === true
}
