import { Observable } from '../modules/observable.js'

export function observe<T extends object, K extends keyof T>(target: T, keys?: K[]): T {
  return Observable.make(target, keys)
}