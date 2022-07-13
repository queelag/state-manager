import { Watcher } from '../classes/watcher'
import { ADMINISTRATION_SYMBOL } from '../definitions/constants'
import { WatcherType } from '../definitions/enums'
import { ModuleLogger } from '../loggers/module.logger'

export class Administration<T extends object, K extends keyof T = keyof T> {
  keys: K[]
  proxy: T
  watchers: Watcher[]

  constructor(keys: K[], proxy: T) {
    this.keys = keys
    this.proxy = proxy
    this.watchers = []
  }

  onChange(): void {
    let autoruns: Watcher[], dispatchers: Watcher[], reactions: Watcher[], when: Watcher[]

    autoruns = this.watchers.filter((v: Watcher) => v.type === WatcherType.AUTORUN)
    autoruns.forEach((v: Watcher) => {
      v.autorun.effect()
      ModuleLogger.verbose('Administration', 'onChange', `The autorun effect has been executed.`, v)
    })

    dispatchers = this.watchers.filter((v: Watcher) => v.type === WatcherType.DISPATCH)
    dispatchers.forEach((v: Watcher) => {
      v.dispatch.effect()
      ModuleLogger.verbose('Administration', 'onChange', `The dispatch effect has been executed.`, v)
    })

    reactions = this.watchers.filter((v: Watcher) => v.reaction.value !== v.reaction.expression() && v.type === WatcherType.REACTION)
    reactions.forEach((v: Watcher) => {
      v.reaction.value = v.reaction.expression()
      v.reaction.effect(v.reaction.value)

      ModuleLogger.verbose('Administration', 'onChange', `The reaction effect has been executed.`, v)
    })

    when = this.watchers.filter((v: Watcher) => v.when.value !== v.when.predicate() && v.type === WatcherType.WHEN)
    when.forEach((v: Watcher) => {
      v.when.value = v.when.predicate()
      if (!v.when.value) return

      v.when.effect()
      ModuleLogger.verbose('Administration', 'onChange', `The when effect has been executed.`, v)
    })
  }

  static set<T extends object, K extends keyof T>(target: T, keys: K[], proxy: T): boolean {
    return Reflect.set(target, ADMINISTRATION_SYMBOL, new Administration(keys, proxy))
  }

  static delete<T extends object>(target: T): boolean {
    return Reflect.deleteProperty(target, ADMINISTRATION_SYMBOL)
  }

  static get<T extends object>(target: T): Administration<T> | undefined {
    return Reflect.get(target, ADMINISTRATION_SYMBOL)
  }

  static isDefined<T extends object>(target: T): boolean {
    return Reflect.has(target, ADMINISTRATION_SYMBOL)
  }

  static isNotDefined<T extends object>(target: T): boolean {
    return !this.isDefined(target)
  }

  static with<T extends object>(target: T, fn: (administration: Administration<T>) => any, fallback: any = undefined) {
    let administration: Administration<T> | undefined

    administration = Administration.get(target)
    if (!administration) return fallback

    return fn(administration)
  }
}
