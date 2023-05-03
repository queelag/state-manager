import { ADMINISTRATION_SYMBOL } from '../definitions/constants'

export class Administration<T extends object, K extends keyof T = keyof T> {
  keys: K[]
  parent: object
  proxy: T
  root: object

  constructor(keys: K[], proxy: T, parent: object = {}, root: object = {}) {
    this.keys = keys
    this.parent = parent
    this.proxy = proxy
    this.root = root
  }

  static define<T extends object, K extends keyof T>(target: T, keys: K[], proxy: T, parent?: object, root?: object): T {
    if (Reflect.has(target, ADMINISTRATION_SYMBOL)) {
      return target
    }

    return Object.defineProperty(target, ADMINISTRATION_SYMBOL, {
      configurable: false,
      enumerable: false,
      value: new Administration(keys, proxy, parent, root),
      writable: false
    })
  }

  static update<T extends object>(target: T, parent: object = {}, root: object = {}): T {
    let administration: Administration<T> | undefined

    administration = Administration.get(target)
    if (!administration) return target

    administration.parent = parent
    administration.root = root

    return target
  }

  static delete<T extends object>(target: T): boolean {
    return Reflect.deleteProperty(target, ADMINISTRATION_SYMBOL)
  }

  static get<T extends object>(target: T): Administration<T> | undefined {
    return Reflect.get(target, ADMINISTRATION_SYMBOL) as Administration<T>
  }

  static isDefined<T extends object>(target: T): boolean {
    return Reflect.has(target, ADMINISTRATION_SYMBOL)
  }

  static isNotDefined<T extends object>(target: T): boolean {
    return this.isDefined(target) === false
  }

  static with<T extends object>(target: T, fn: (administration: Administration<T>) => any, fallback: any = undefined) {
    let administration: Administration<T> | undefined

    administration = Administration.get(target)
    if (!administration) return fallback

    return fn(administration)
  }
}
