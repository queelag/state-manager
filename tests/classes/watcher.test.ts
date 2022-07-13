import { Watcher } from '../../src/classes/watcher'
import { WatcherType } from '../../src/definitions/enums'
import {
  WatcherAutorunEffect,
  WatcherDispatchEffect,
  WatcherReactionEffect,
  WatcherReactionExpression,
  WatcherWhenEffect,
  WatcherWhenPredicate
} from '../../src/definitions/types'

describe('Watcher', () => {
  it('constructs an autorun', () => {
    let effect: WatcherAutorunEffect, watcher: Watcher

    effect = () => undefined
    watcher = new Watcher(WatcherType.AUTORUN, effect)

    expect(watcher.autorun.effect).toBe(effect)
    expect(watcher.type).toBe(WatcherType.AUTORUN)
  })

  it('constructs a dispatch', () => {
    let effect: WatcherDispatchEffect, watcher: Watcher

    effect = () => undefined
    watcher = new Watcher(WatcherType.DISPATCH, effect)

    expect(watcher.dispatch.effect).toBe(effect)
    expect(watcher.type).toBe(WatcherType.DISPATCH)
  })

  it('constructs a reaction', () => {
    let effect: WatcherReactionEffect<number>, expression: WatcherReactionExpression<number>, watcher: Watcher

    effect = () => undefined
    expression = () => 0
    watcher = new Watcher(WatcherType.REACTION, effect, expression)

    expect(watcher.reaction.effect).toBe(effect)
    expect(watcher.reaction.expression).toBe(expression)
    expect(watcher.reaction.value).toBe(0)
    expect(watcher.type).toBe(WatcherType.REACTION)
  })

  it('constructs a when', () => {
    let effect: WatcherWhenEffect, predicate: WatcherWhenPredicate, watcher: Watcher

    effect = () => undefined
    predicate = () => true
    watcher = new Watcher(WatcherType.WHEN, effect, predicate)

    expect(watcher.when.effect).toBe(effect)
    expect(watcher.when.predicate).toBe(predicate)
    expect(watcher.when.value).toBe(true)
    expect(watcher.type).toBe(WatcherType.WHEN)
  })
})
