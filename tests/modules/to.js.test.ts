import { toJS } from '../../src'
import { Observable } from '../../src/modules/observable'
import { getTestStore, Store } from '../get.test.store'

describe('toJS', () => {
  it('works', () => {
    let store: Store, js: Store

    store = getTestStore()
    js = toJS(store)

    expect(Observable.isPropertyProxy(js.object)).toBeFalsy()
    expect(Observable.isPropertyProxy(js.array)).toBeFalsy()
    expect(Observable.isPropertyProxy(js.date)).toBeFalsy()
    expect(Observable.isPropertyProxy(js.map)).toBeFalsy()
    expect(Observable.isPropertyProxy(js.set)).toBeFalsy()
    expect(Observable.isPropertyProxy(js.dayjs)).toBeFalsy()
  })
})
