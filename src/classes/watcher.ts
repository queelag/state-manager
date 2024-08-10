import { noop } from '@aracna/core'
import type { WatcherAutorun, WatcherReaction, WatcherRead, WatcherWhen } from '../definitions/interfaces.js'
import type {
  WatcherAutorunEffect,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherReadEffect,
  WatcherType,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types.js'
import type { WatcherObservable } from './watcher-observable.js'

export class Watcher<T extends object = any, U = any> {
  autorun: WatcherAutorun
  observables: WatcherObservable[]
  reaction: WatcherReaction<U>
  read: WatcherRead<T>
  type: WatcherType
  when: WatcherWhen

  constructor(type: 'autorun', effect: WatcherAutorunEffect)
  constructor(type: 'reaction', effect: WatcherReactionEffect<U>, expression: WatcherReactionExpression<U>)
  constructor(type: 'read', effect: WatcherReadEffect<T>)
  constructor(type: 'when', effect: WatcherWhenEffect, predicate: WatcherWhenPredicate)
  constructor(type: WatcherType, ...args: any) {
    this.autorun = { effect: noop }
    this.observables = []
    this.reaction = { effect: noop, expression: noop, value: undefined as U }
    this.read = { effect: noop }
    this.type = type
    this.when = { effect: noop, predicate: noop, value: false }

    switch (type) {
      case 'autorun':
        this.autorun.effect = args[0]
        break
      case 'reaction':
        this.reaction.effect = args[0]
        this.reaction.expression = args[1]

        break
      case 'read':
        this.read.effect = args[0]
        break
      case 'when':
        this.when.effect = args[0]
        this.when.predicate = args[1]

        break
    }
  }
}
