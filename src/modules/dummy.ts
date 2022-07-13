import { noop } from '@queelag/core'
import { WatcherAutorun, WatcherDispatch, WatcherReaction, WatcherWhen } from '../definitions/interfaces'

export class Dummy {
  static get WatcherAutorun(): WatcherAutorun {
    return {
      effect: noop
    }
  }

  static get WatcherDispatch(): WatcherDispatch {
    return {
      effect: noop
    }
  }

  static get WatcherReaction(): WatcherReaction<any> {
    return {
      effect: noop,
      expression: noop,
      value: undefined
    }
  }

  static get WatcherWhen(): WatcherWhen {
    return {
      effect: noop,
      predicate: noop,
      value: false
    }
  }
}
