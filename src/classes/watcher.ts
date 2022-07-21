import { WatcherType } from '../definitions/enums'
import { WatcherAutorun, WatcherReaction, WatcherRead, WatcherWhen } from '../definitions/interfaces'
import {
  WatcherAutorunEffect,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherReadEffect,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types'
import { Dummy } from '../modules/dummy'
import { WatcherObservable } from './watcher.observable'

export class Watcher<T extends object = any, U = any> {
  autorun: WatcherAutorun
  observables: WatcherObservable[]
  reaction: WatcherReaction<U>
  read: WatcherRead<T>
  type: WatcherType
  when: WatcherWhen

  constructor(type: WatcherType.AUTORUN, effect: WatcherAutorunEffect)
  constructor(type: WatcherType.REACTION, effect: WatcherReactionEffect<U>, expression: WatcherReactionExpression<U>)
  constructor(type: WatcherType.READ, effect: WatcherReadEffect<T>)
  constructor(type: WatcherType.WHEN, effect: WatcherWhenEffect, predicate: WatcherWhenPredicate)
  constructor(type: WatcherType, ...args: any) {
    this.autorun = Dummy.WatcherAutorun
    this.observables = []
    this.reaction = Dummy.WatcherReaction
    this.read = Dummy.WatcherRead
    this.type = type
    this.when = Dummy.WatcherWhen

    switch (type) {
      case WatcherType.AUTORUN:
        this.autorun.effect = args[0]
        break
      case WatcherType.REACTION:
        this.reaction.effect = args[0]
        this.reaction.expression = args[1]

        break
      case WatcherType.READ:
        this.read.effect = args[0]
        break
      case WatcherType.WHEN:
        this.when.effect = args[0]
        this.when.predicate = args[1]

        break
    }
  }
}
