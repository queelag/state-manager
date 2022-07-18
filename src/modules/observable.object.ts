import { IS_PROXY_KEY } from '../definitions/constants'
import { Administration } from './administration'
import { ObservableMap } from './observable.map'
import { ObservableSet } from './observable.set'

export class ObservableObject {
  static make<T extends object, K extends keyof T = keyof T>(handler: ProxyHandler<T>, target: T, key: K, property: any, receiver: any): boolean {
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
        ObservableObject.makeProperties(handler, property, Object.keys(property))
        break
    }

    if (ObservableObject.isPropertyProxy(property)) {
      return Reflect.set(target, key, property, receiver)
    }

    switch (true) {
      case property instanceof Map:
        ObservableMap.make(handler, property)
        break
      case property instanceof Set:
        ObservableSet.make(handler, property)
        break
      default:
        let proxy: T

        proxy = new Proxy(property, handler)
        Administration.set(property, Object.keys(property), proxy)

        return Reflect.set(target, key, proxy, receiver)
    }

    return true
  }

  static makeProperties<T extends object, K extends keyof T = keyof T>(handler: ProxyHandler<T>, target: T, keys: K[]): boolean {
    return keys
      .map((k: K) => {
        let value: any

        value = Reflect.get(target, k)
        if (typeof value !== 'object') return true

        return ObservableObject.make(handler, target, k, Reflect.get(target, k), target)
      })
      .every(Boolean)
  }

  static isPropertyProxiable(property: any): boolean {
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

  static isPropertyNotProxiable(property: any): boolean {
    return this.isPropertyProxiable(property) === false
  }

  static isPropertyProxy(property: any): boolean {
    return typeof property === 'object' && Reflect.get(property, IS_PROXY_KEY) === true
  }
}
