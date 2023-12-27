import { WatcherType } from '../definitions/enums.js'
import { WatcherAutorunEffect, WatcherDisposer } from '../definitions/types.js'
import { watch } from './watch.js'

/**
 * Runs an effect immediately and re-runs it whenever any of the values it references from an observable change.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/state-manager/functions/autorun)
 */
export function autorun(effect: WatcherAutorunEffect): WatcherDisposer {
  return watch(WatcherType.AUTORUN, effect)
}
