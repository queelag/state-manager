import { WatcherType } from '../definitions/enums'
import { WatcherAutorun, WatcherDispatch, WatcherReaction, WatcherWhen } from '../definitions/interfaces'
import {
  WatcherAutorunEffect,
  WatcherDispatchEffect,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../definitions/types'
import { Dummy } from '../modules/dummy'

export class Watcher<T = any> {
  autorun: WatcherAutorun
  dispatch: WatcherDispatch
  reaction: WatcherReaction<T>
  type: WatcherType
  when: WatcherWhen

  constructor(type: WatcherType.AUTORUN, effect: WatcherAutorunEffect)
  constructor(type: WatcherType.DISPATCH, effect: WatcherDispatchEffect)
  constructor(type: WatcherType.REACTION, effect: WatcherReactionEffect<T>, expression: WatcherReactionExpression<T>)
  constructor(type: WatcherType.WHEN, effect: WatcherWhenEffect, predicate: WatcherWhenPredicate)
  constructor(type: WatcherType, ...args: any) {
    this.autorun = Dummy.WatcherAutorun
    this.dispatch = Dummy.WatcherDispatch
    this.reaction = Dummy.WatcherReaction
    this.type = type
    this.when = Dummy.WatcherWhen

    switch (type) {
      case WatcherType.AUTORUN:
        this.autorun.effect = args[0]
        break
      case WatcherType.DISPATCH:
        this.dispatch.effect = args[0]
        break
      case WatcherType.REACTION:
        this.reaction.effect = args[0]
        this.reaction.expression = args[1]
        this.reaction.value = args[1]()

        break
      case WatcherType.WHEN:
        this.when.effect = args[0]
        this.when.predicate = args[1]
        this.when.value = args[1]()

        break
    }
  }
}
