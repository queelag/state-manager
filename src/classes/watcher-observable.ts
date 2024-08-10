import type { WatcherObservableType, WatcherWriteType } from '../definitions/types.js'

export class WatcherObservable<T extends object = object> {
  key: PropertyKey
  receiver: any
  target: T
  type: WatcherObservableType
  value: any

  constructor(key: PropertyKey, receiver: any, target: T, type: WatcherObservableType, value: any) {
    this.key = key
    this.receiver = receiver
    this.target = target
    this.type = type
    this.value = value
  }

  get(): any {
    switch (this.type) {
      case 'map-entries':
      case 'map-keys':
      case 'map-values':
      case 'set-entries':
      case 'set-keys':
      case 'set-values': {
        let ekv: any

        ekv = Reflect.get(this.target, this.key)
        if (typeof ekv !== 'function') return

        return ekv()
      }
      case 'map-get': {
        let get: any

        get = Reflect.get(this.target, 'get')
        if (typeof get !== 'function') return

        return get(this.key)
      }
      case 'proxy-handler-get':
        return Reflect.get(this.target, this.key, this.receiver)
    }
  }

  static match(observables: WatcherObservable[], type: WatcherWriteType, target: object): boolean {
    let kvm1: [any, any][], kvm2: [any, any][], kova1: any[], kova2: any[], a1: any, a2: any

    for (let observable of observables) {
      switch (observable.type) {
        case 'map-entries':
        case 'set-entries':
          kvm1 = [...observable.value]
          kvm2 = [...observable.get()]

          if (kvm1.length !== kvm2.length) {
            return false
          }

          for (let j = 0; j < kvm1.length; j++) {
            if (kvm1[j][0] !== kvm2[j][0]) {
              return false
            }

            if (kvm1[j][1] !== kvm2[j][1]) {
              return false
            }
          }

          continue
        case 'map-keys':
        case 'map-values':
        case 'set-keys':
        case 'set-values':
          kova1 = [...observable.value]
          kova2 = [...observable.get()]

          if (kova1.length !== kova2.length) {
            return false
          }

          for (let j = 0; j < kova1.length; j++) {
            if (kova1[j] !== kova2[j]) {
              return false
            }
          }

          continue
        case 'map-get':
        case 'proxy-handler-get':
          a1 = observable.value
          a2 = observable.get()

          if (a1 !== a2) {
            return false
          }

          if (typeof a2 !== 'object') {
            continue
          }

          switch (type) {
            case 'proxy-handler-delete-property':
            case 'proxy-handler-set':
              if (observable.target === target) {
                return false
              }

              continue
          }

          continue
      }
    }

    return true
  }
}
