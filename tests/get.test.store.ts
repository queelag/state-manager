import { Environment } from '@queelag/core'
import dayjs, { Dayjs } from 'dayjs'
import { observe } from '../src'

export class Store {
  /**
   * PRIMITIVES
   */
  bigint: bigint = BigInt(0)
  boolean: boolean = false
  function: Function = () => undefined
  null: null | any = null
  number: number = 0
  object: Record<any, any> = {}
  string: string = ''
  symbol: symbol = Symbol()
  undefined: undefined | any = undefined
  /**
   * OBJECTS
   */
  array: any[] = []
  date: Date = new Date()
  map: Map<any, any> = new Map()
  set: Set<any> = new Set()
  /**
   * LIBRARIES
   */
  dayjs: Dayjs = dayjs()

  constructor() {
    if (Environment.isWindowNotDefined) {
      return
    }

    // @ts-ignore
    window.store = this
  }
}

export function getTestStore(): Store {
  let store: Store

  store = new Store()
  observe(store, Object.keys(store) as any)

  return store
}
