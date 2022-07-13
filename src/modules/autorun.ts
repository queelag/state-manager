import { WatcherType } from '../definitions/enums'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types'
import { watch } from './watch'

export function autorun<T extends object>(effect: WatcherAutorunEffect, target: T): WatcherDisposer {
  return watch(WatcherType.AUTORUN, effect, target)
}
