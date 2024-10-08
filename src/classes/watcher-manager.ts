import { tc } from '@aracna/core'
import type { WatcherObservableType, WatcherType, WatcherWriteType } from '../definitions/types.js'
import { ModuleLogger } from '../loggers/module-logger.js'
import { WatcherObservable } from './watcher-observable.js'
import { Watcher } from './watcher.js'

export class WatcherManager {
  static watchers: Watcher[] = []

  static dispose<T extends object, U>(watcher: Watcher<T, U>): void {
    WatcherManager.watchers = WatcherManager.watchers.filter((v: Watcher) => v !== watcher)
    ModuleLogger.verbose('WatcherManager', 'dispose', `The watcher has been disposed of.`, watcher)
  }

  static onRead(type: WatcherObservableType, target: object, key: PropertyKey, value: any, receiver: any = target): void {
    WatcherManager.watchers
      .filter((v: Watcher) => v.type === 'read')
      .forEach((v: Watcher) => {
        v.read.effect(new WatcherObservable(key, receiver, target, type, value))
        ModuleLogger.verbose('Administration', 'onRead', `The read effect has been executed.`, v)
      })
  }

  static onWrite(type: WatcherWriteType, target: object, key: PropertyKey, value: any): void {
    WatcherManager.watchers.forEach((v: Watcher) => {
      switch (v.type) {
        case 'reaction': {
          let rv: any

          rv = v.reaction.expression()
          if (rv === v.reaction.value) return

          v.reaction.value = rv
          break
        }
        case 'when': {
          let wv: boolean

          wv = v.when.predicate()
          if (wv === v.when.value) return

          v.when.value = wv
          break
        }
      }

      switch (v.type) {
        case 'autorun':
        case 'reaction':
        case 'when':
          if (WatcherObservable.match(v.observables, type, target)) {
            return
          }

          break
      }

      switch (v.type) {
        case 'autorun':
        case 'reaction':
        case 'when': {
          let read: Watcher

          read = new Watcher('read', (observable: WatcherObservable) => {
            v.observables.push(observable)
          })

          v.observables = []
          WatcherManager.watchers.push(read)

          tc(() => v.autorun.effect())
          tc(() => v.reaction.expression())
          tc(() => v.when.predicate())

          WatcherManager.dispose(read)
        }
      }

      switch (v.type) {
        case 'reaction':
          v.reaction.effect(v.reaction.value)
          break
        case 'when':
          v.when.value && v.when.effect()
          break
      }
    })
  }

  static find(type: WatcherType, effect?: Function, expression?: Function, predicate?: Function): Watcher | undefined {
    switch (type) {
      case 'autorun':
        return WatcherManager.watchers.find((v: Watcher) => v.autorun.effect === effect && v.type === type)
      case 'reaction':
        return WatcherManager.watchers.find((v: Watcher) => v.reaction.effect === effect && v.reaction.expression === expression && v.type === type)
      case 'read':
        return WatcherManager.watchers.find((v: Watcher) => v.read.effect === effect && v.type === type)
      case 'when':
        return WatcherManager.watchers.find((v: Watcher) => v.when.effect === effect && v.when.predicate === predicate && v.type === type)
    }
  }

  static getDisposer<T extends object, U>(watcher: Watcher<T, U>): () => void {
    return () => WatcherManager.dispose(watcher)
  }
}
