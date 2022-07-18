import { PARENT_OBJECT_SYMBOL } from '../definitions/constants'
import { ModuleLogger } from '../loggers/module.logger'

export class ParentObject {
  static define<T extends object, U extends object>(property: T, target: U): T {
    if (Reflect.has(property, PARENT_OBJECT_SYMBOL)) {
      ModuleLogger.warn('ParentObject', 'define', `The parent object is already defined.`, target, property)
      return property
    }

    return Object.defineProperty(property, PARENT_OBJECT_SYMBOL, {
      configurable: false,
      enumerable: false,
      value: target,
      writable: false
    })
  }

  static get<T extends object, U extends object>(property: T): U | undefined {
    return Reflect.get(property, PARENT_OBJECT_SYMBOL)
  }

  static has(property: any): boolean {
    return Reflect.has(property, PARENT_OBJECT_SYMBOL)
  }
}
