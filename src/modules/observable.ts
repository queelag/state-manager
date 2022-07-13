import { ModuleLogger } from '../loggers/module.logger'
import { Administration } from './administration'
import { ObservableMap } from './observable.map'
import { ObservableSet } from './observable.set'

export class Observable {
  static makeProperty<T extends object, U extends object, K extends keyof U>(root: T, target: U, key: K, property: any, receiver: any): boolean {
    if (typeof property !== 'object') {
      return true
    }

    if (property === null) {
      return Reflect.set(target, key, property, receiver)
    }

    if (Observable.isObjectPropertyNotProxiable(property)) {
      return Reflect.set(target, key, property, receiver)
    }

    switch (true) {
      case property instanceof Map:
      case property instanceof Set:
        break
      default:
        Observable.makeProperties(root, property, Object.keys(property))
        break
    }

    if (Observable.isPropertyProxy(property)) {
      return Reflect.set(target, key, property, receiver)
    }

    switch (true) {
      case property instanceof Map:
        ObservableMap.make(root, property)
        break
      case property instanceof Set:
        ObservableSet.make(root, property)
        break
      default:
        return Reflect.set(target, key, new Proxy(property, Observable.getProxyHandler(root)), receiver)
    }

    return true
  }

  static makeProperties<T extends object, U extends object, K extends keyof U>(root: T, target: U, keys: K[]): boolean {
    return keys.map((k: K) => Observable.makeProperty(root, target, k, Reflect.get(target, k), target)).every(Boolean)
  }

  static getPropertyDescriptor<T extends object>(target: T, key: keyof T): PropertyDescriptor {
    return {
      get: () => Administration.with(target, (administration: Administration<T>) => Reflect.get(administration.proxy, key)),
      set: (value: any) =>
        Administration.with(target, (administration: Administration<T>) => {
          Reflect.set(administration.proxy, key, value)
        })
    }
  }

  static getProxyHandler<T extends object, U extends object>(root: T): ProxyHandler<U> {
    return {
      get: (target: U, p: string | symbol, receiver: any) => {
        if (p === 'isProxy') {
          return true
        }

        return Reflect.get(target, p, receiver)
      },
      set: (target: U, p: string, value: any, receiver: any) => {
        let set: boolean

        if (p === 'isProxy') {
          return false
        }

        if (value === Reflect.get(target, p)) {
          return true
        }

        switch (typeof value) {
          case 'object':
            set = Observable.makeProperty(root, target, p as keyof U, value, receiver)
            if (!set) return false

            break
          default:
            set = Reflect.set(target, p, value, receiver)
            if (!set) return false

            break
        }

        ModuleLogger.verbose('ProxyObservable', 'getHandler', 'set', `The value has been set.`, [target, p, value])
        Administration.get(root)?.onChange()

        return true
      }
    }
  }

  static isObjectPropertyProxiable(property: any): boolean {
    if (!property?.toString) {
      return false
    }

    switch (true) {
      case property instanceof Array:
        return true
      default:
        break
    }

    switch (property.toString()) {
      case '[object Object]':
      case '[object Map]':
      case '[object Set]':
        return true
      default:
        return false
    }
  }

  static isObjectPropertyNotProxiable(property: any): boolean {
    return this.isObjectPropertyProxiable(property) === false
  }

  static isPropertyProxy(property: any): boolean {
    return property?.isProxy
  }
}
