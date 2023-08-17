import { WatcherType } from '../definitions/enums.js'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types.js'
import { watch } from './watch.js'

export function autorun(effect: WatcherAutorunEffect): WatcherDisposer {
  return watch(WatcherType.AUTORUN, effect)
}
