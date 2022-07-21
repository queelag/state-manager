import { noop } from '@queelag/core'
import { WatcherAutorun, WatcherReaction, WatcherRead, WatcherWhen } from '../definitions/interfaces'

export class Dummy {
  static get WatcherAutorun(): WatcherAutorun {
    return {
      effect: noop
    }
  }

  static get WatcherReaction(): WatcherReaction<any> {
    return {
      effect: noop,
      expression: noop
    }
  }

  static get WatcherRead(): WatcherRead<any> {
    return {
      effect: noop
    }
  }

  static get WatcherWhen(): WatcherWhen {
    return {
      effect: noop,
      predicate: noop
    }
  }
}
