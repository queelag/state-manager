import { reaction } from '../../src'
import { WatcherReactionEffect, WatcherReactionExpression } from '../../src/definitions/types'
import { getTestStore, Store } from '../get.test.store'

describe('reaction', () => {
  it('runs only on expression value change', async () => {
    let store: Store, expression: WatcherReactionExpression<number>, effect: WatcherReactionEffect<number>

    store = getTestStore()
    expression = () => store.number
    effect = jest.fn()

    reaction(expression, effect)

    expect(effect).not.toBeCalled()

    store.boolean = true
    expect(effect).not.toBeCalled()

    store.number++
    expect(effect).toBeCalled()
    expect(effect).toBeCalledTimes(1)
  })
})
