import { WatcherWhenEffect, when } from '../../src'
import { getTestStore, Store } from '../get.test.store'

describe('when', () => {
  it('runs when the predicate is truthy', () => {
    let store: Store, effect: WatcherWhenEffect

    store = getTestStore()
    effect = jest.fn()

    when(() => store.boolean, effect, store)

    store.boolean = true
    expect(effect).toBeCalledTimes(1)
  })

  it('works as a promise if no effect is defined', async () => {
    let store: Store, oncatch: jest.Mock, onfinally: jest.Mock, onthen: jest.Mock, promise: Promise<void>

    store = getTestStore()
    oncatch = jest.fn()
    onfinally = jest.fn()
    onthen = jest.fn()

    promise = when(() => store.boolean, store)
      .catch(oncatch)
      .finally(onfinally)
      .then(onthen)

    expect(oncatch).not.toBeCalled()
    expect(onfinally).not.toBeCalled()
    expect(onthen).not.toBeCalled()

    store.boolean = true

    await promise

    expect(oncatch).not.toBeCalled()
    expect(onfinally).toBeCalledTimes(1)
    expect(onthen).toBeCalledTimes(1)
  })
})
