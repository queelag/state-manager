import { tc } from '@aracna/core'
import { Watcher } from '../classes/watcher'
import { WatcherObservable } from '../classes/watcher.observable'
import { WatcherObservableType, WatcherType, WriteType } from '../definitions/enums'
import { ModuleLogger } from '../loggers/module.logger'

export class WatcherManager {
  static watchers: Watcher[] = []

  static dispose<T extends object, U>(watcher: Watcher<T, U>): void {
    WatcherManager.watchers = WatcherManager.watchers.filter((v: Watcher) => v !== watcher)
    ModuleLogger.verbose('WatcherManager', 'dispose', `The watcher has been disposed of.`, watcher)
  }

  static onRead(type: WatcherObservableType, target: object, key: PropertyKey, value: any, receiver: any = target): void {
    WatcherManager.watchers
      .filter((v: Watcher) => v.type === WatcherType.READ)
      .forEach((v: Watcher) => {
        v.read.effect(new WatcherObservable(key, receiver, target, type, value))
        ModuleLogger.verbose('Administration', 'onRead', `The read effect has been executed.`, v)
      })
  }

  static onWrite(type: WriteType, target: object, key: PropertyKey, value: any): void {
    WatcherManager.watchers.forEach((v: Watcher) => {
      switch (v.type) {
        case WatcherType.REACTION:
          let rv: any

          rv = v.reaction.expression()
          if (rv === v.reaction.value) return

          v.reaction.value = rv
          break
        case WatcherType.WHEN:
          let wv: boolean

          wv = v.when.predicate()
          if (wv === v.when.value) return

          v.when.value = wv
          break
      }

      switch (v.type) {
        case WatcherType.AUTORUN:
        case WatcherType.REACTION:
        case WatcherType.WHEN:
          if (WatcherObservable.match(v.observables, type, target)) {
            return
          }

          break
      }

      switch (v.type) {
        case WatcherType.AUTORUN:
        case WatcherType.REACTION:
        case WatcherType.WHEN:
          let read: Watcher

          read = new Watcher(WatcherType.READ, (observable: WatcherObservable) => {
            v.observables.push(observable)
          })

          v.observables = []
          WatcherManager.watchers.push(read)

          tc(() => v.autorun.effect())
          tc(() => v.reaction.expression())
          tc(() => v.when.predicate())

          WatcherManager.dispose(read)
      }

      switch (v.type) {
        case WatcherType.REACTION:
          v.reaction.effect(v.reaction.value)
          break
        case WatcherType.WHEN:
          v.when.value && v.when.effect()
          break
      }
    })
  }

  static find(type: WatcherType, effect?: Function, expression?: Function, predicate?: Function): Watcher | undefined {
    switch (type) {
      case WatcherType.AUTORUN:
        return WatcherManager.watchers.find((v: Watcher) => v.autorun.effect === effect && v.type === type)
      case WatcherType.REACTION:
        return WatcherManager.watchers.find((v: Watcher) => v.reaction.effect === effect && v.reaction.expression === expression && v.type === type)
      case WatcherType.READ:
        return WatcherManager.watchers.find((v: Watcher) => v.read.effect === effect && v.type === type)
      case WatcherType.WHEN:
        return WatcherManager.watchers.find((v: Watcher) => v.when.effect === effect && v.when.predicate === predicate && v.type === type)
    }
  }

  static getDisposer<T extends object, U>(watcher: Watcher<T, U>): () => void {
    return () => WatcherManager.dispose(watcher)
  }
}
