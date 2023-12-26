import { KeyOf } from '@aracna/core'
import { Observable } from '../classes/observable.js'

export function observe<T extends object>(target: T, keys?: KeyOf.Shallow<T>[]): T
export function observe<T extends object>(target: T, keys?: string[]): T
export function observe<T extends object>(target: T, keys?: KeyOf.Shallow<T>[]): T {
  return Observable.make(target, keys)
}
