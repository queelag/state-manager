import { OBSERVABLE_COLLECTOR } from '../collectors/observable-collector.js'
import { IS_PROXY_KEY } from '../definitions/constants.js'
import { WatcherObservableType, WriteType } from '../definitions/enums.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { Administration } from './administration.js'
import { ObservableObject } from './observable-object.js'
import { WatcherManager } from './watcher-manager.js'

export class Observable {
  static make<T extends object, K extends keyof T>(target: T, keys: K[] = Object.keys(target) as K[]): T {
    let clone: T, proxy: T

    if (Administration.isDefined(target)) {
      ModuleLogger.warn('Observable', 'make', `The target is already an observable.`, target)
      return target
    }

    clone = { ...target }
    ModuleLogger.verbose('Observable', 'make', `The target has been cloned.`, clone)

    ObservableObject.makeProperties<T, any>(target, Observable.getProxyHandler(target), clone, keys)

    proxy = new Proxy(clone, Observable.getProxyHandler(target))
    ModuleLogger.verbose('Observable', 'make', `The clone has been proxied.`, proxy)

    keys.forEach((k: keyof T) => {
      Object.defineProperty(target, k, Observable.getPropertyDescriptor(target, k))
      ModuleLogger.verbose('Observable', 'make', `The property "${String(k)}" is now bound to the proxy.`, [target[k]])
    })

    Administration.define(target, keys, proxy)
    ModuleLogger.verbose('Observable', 'make', `The administration class has been set.`, Administration.get(target))

    OBSERVABLE_COLLECTOR.push(target)
    ModuleLogger.verbose('Observable', 'make', `The target has been pushed to the observable collector.`)

    return target
  }

  static getPropertyDescriptor<T extends object>(target: T, key: keyof T): PropertyDescriptor {
    return {
      configurable: false,
      get: () => Administration.with(target, (administration: Administration<T>) => Reflect.get(administration.proxy, key)),
      set: (value: any) =>
        Administration.with(target, (administration: Administration<T>) => {
          Reflect.set(administration.proxy, key, value)
        })
    }
  }

  static getProxyHandler<T extends object, U extends object>(root: T): ProxyHandler<U> {
    return {
      defineProperty: (target: U, p: PropertyKey, attributes: PropertyDescriptor) => {
        if (p === IS_PROXY_KEY) {
          return false
        }

        return Reflect.defineProperty(target, p, attributes)
      },
      deleteProperty: (target: U, p: PropertyKey) => {
        let deleted: boolean

        if (p === IS_PROXY_KEY) {
          return false
        }

        deleted = Reflect.deleteProperty(target, p)
        if (!deleted) return false

        ModuleLogger.verbose('Observable', 'getProxyHandler', 'deleteProperty', `The property has been deleted.`, [target, p])
        WatcherManager.onWrite(WriteType.PROXY_HANDLER_DELETE_PROPERTY, target, p, undefined)

        return true
      },
      get: (target: U, p: PropertyKey, receiver: any) => {
        let property: any

        if (p === IS_PROXY_KEY) {
          return true
        }

        property = Reflect.get(target, p, receiver)
        ModuleLogger.verbose('Observable', 'getProxyHandler', 'get', `The property has been read.`, [target, p, property])

        WatcherManager.onRead(WatcherObservableType.PROXY_HANDLER_GET, target, p, property, receiver)

        return property
      },
      set: (target: U, p: PropertyKey, value: any, receiver: any) => {
        let set: boolean

        if (p === IS_PROXY_KEY) {
          return false
        }

        if (value === Reflect.get(target, p)) {
          return true
        }

        if (typeof value === 'object') {
          set = ObservableObject.make<T, U>(root, Observable.getProxyHandler(root), target, p as keyof U, value, receiver)
          if (!set) return false
        }

        if (typeof value !== 'object') {
          set = Reflect.set(target, p, value, receiver)
          if (!set) return false
        }

        ModuleLogger.verbose('ProxyObservable', 'getHandler', 'set', `The value has been set.`, [target, p, value])
        WatcherManager.onWrite(WriteType.PROXY_HANDLER_SET, target, p, value)

        return true
      }
    }
  }
}
