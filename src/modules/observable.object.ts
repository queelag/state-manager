import { IS_PROXY_KEY } from '../definitions/constants'
import { Administration } from './administration'
import { ObservableMap } from './observable.map'
import { ObservableSet } from './observable.set'

export class ObservableObject {
  static make<T extends object, U extends object, K extends keyof U = keyof U>(
    root: T,
    handler: ProxyHandler<U>,
    target: U,
    key: K,
    property: any,
    receiver: any
  ): boolean {
    if (property === null) {
      return Reflect.set(target, key, property, receiver)
    }

    if (ObservableObject.isPropertyNotProxiable(property)) {
      return Reflect.set(target, key, property, receiver)
    }

    switch (true) {
      case property instanceof Map:
      case property instanceof Set:
        break
      default:
        ObservableObject.makeProperties(root, handler, property, Object.keys(property))
        break
    }

    switch (true) {
      case property instanceof Map:
        return ObservableMap.make(root, target, key, property, receiver)
      case property instanceof Set:
        return ObservableSet.make(root, target, key, property, receiver)
      default:
        let proxy: U

        if (ObservableObject.isPropertyProxy(property)) {
          property = { ...property }
          Administration.delete(property)
        }

        proxy = new Proxy(property, handler)
        Administration.define(property, Object.keys(property), proxy, target, root)

        return Reflect.set(target, key, proxy, receiver)
    }
  }

  static makeProperties<T extends object, U extends object, K extends keyof U = keyof U>(root: T, handler: ProxyHandler<U>, target: U, keys: K[]): boolean {
    return keys
      .map((k: K) => {
        let value: any

        value = Reflect.get(target, k)
        if (typeof value !== 'object') return true

        return ObservableObject.make(root, handler, target, k, Reflect.get(target, k), target)
      })
      .every(Boolean)
  }

  static isPropertyProxiable(property: object): boolean {
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

  static isPropertyNotProxiable(property: object): boolean {
    return this.isPropertyProxiable(property) === false
  }

  static isPropertyProxy(property: object): boolean {
    return Reflect.get(property, IS_PROXY_KEY) === true
  }

  static isPropertyNotProxy(property: object): boolean {
    return ObservableObject.isPropertyProxy(property) === false
  }
}
