import { IS_PROXY_KEY } from '../definitions/constants'
import { ModuleLogger } from '../loggers/module.logger'
import { Administration } from './administration'
import { ObservableObject } from './observable.object'

export class Observable {
  static make<T extends object, K extends keyof T>(target: T, keys: K[]): T {
    let clone: T, proxy: T

    if (Administration.isDefined(target)) {
      ModuleLogger.warn('observe', `The target is already an observable.`, target)
      return target
    }

    clone = { ...target }
    ModuleLogger.verbose('observe', `The target has been cloned.`, clone)

    keys.forEach((k: keyof T) => {
      Object.defineProperty(target, k, Observable.getPropertyDescriptor(target, k))
      ModuleLogger.verbose('observe', `The property "${String(k)}" is now bound to the proxy.`, [target[k]])
    })

    ObservableObject.makeProperties<T, any>(clone, Observable.getProxyHandler(target), clone, keys)

    proxy = new Proxy(clone, Observable.getProxyHandler(target))
    ModuleLogger.verbose('observe', `The clone has been proxied.`, proxy)

    Administration.define(target, keys, proxy)
    ModuleLogger.verbose('observe', `The administration class has been set.`, Administration.get(target))

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

        Administration.get(root)?.onChange()
        Administration.get(target)?.onChange()

        ModuleLogger.verbose('Observable', 'getProxyHandler', 'deleteProperty', `The property has been deleted.`, [target, p])

        return true
      },
      get: (target: U, p: PropertyKey, receiver: any) => {
        if (p === IS_PROXY_KEY) {
          return true
        }

        return Reflect.get(target, p, receiver)
      },
      set: (target: U, p: PropertyKey, value: any, receiver: any) => {
        let set: boolean

        if (p === IS_PROXY_KEY) {
          return false
        }

        if (value === Reflect.get(target, p)) {
          return true
        }

        switch (typeof value) {
          case 'object':
            set = ObservableObject.make<T, U>(root, Observable.getProxyHandler(root), target, p as keyof U, value, receiver)
            if (!set) return false

            break
          default:
            set = Reflect.set(target, p, value, receiver)
            if (!set) return false

            break
        }

        Administration.get(root)?.onChange()
        Administration.get(target)?.onChange()

        ModuleLogger.verbose('ProxyObservable', 'getHandler', 'set', `The value has been set.`, [target, p, value])

        return true
      }
    }
  }
}
