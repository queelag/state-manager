import { describe, expect, it } from 'vitest'
import { ObservableObject } from '../../src/classes/observable-object'
import { observe } from '../../src/functions/observe'

describe('ObservableObject', () => {
  it('detects if a property is a proxy', () => {
    expect(ObservableObject.isPropertyProxy({})).toBeFalsy()
    expect(ObservableObject.isPropertyNotProxy({})).toBeTruthy()
    expect(ObservableObject.isPropertyProxy(observe({ object: {} }, ['object']).object)).toBeTruthy()
    expect(ObservableObject.isPropertyNotProxy(observe({ object: {} }, ['object']).object)).toBeFalsy()
  })
})
