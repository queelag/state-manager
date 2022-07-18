import { ParentObject } from '../../src/modules/parent.object'

describe('ParentObject', () => {
  it('works', () => {
    let object: Record<string, object>

    object = { a: {} }
    ParentObject.define(object.a, object)

    expect(ParentObject.has(object.a))
    expect(ParentObject.get(object.a)).toBe(object)

    ParentObject.define(object.a, object)
  })
})
