import { ObservableObject } from '../../src/modules/observable.object'
import { observe } from '../../src/modules/observe'

describe('ObservableObject', () => {
  it('detects if a property is a proxy', () => {
    expect(ObservableObject.isPropertyProxy({})).toBeFalsy()
    expect(ObservableObject.isPropertyNotProxy({})).toBeTruthy()
    expect(ObservableObject.isPropertyProxy(observe({ object: {} }, ['object']).object)).toBeTruthy()
    expect(ObservableObject.isPropertyNotProxy(observe({ object: {} }, ['object']).object)).toBeFalsy()
  })
})
