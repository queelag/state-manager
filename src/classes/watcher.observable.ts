import { WatcherObservableType, WriteType } from '../definitions/enums'

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
      case WatcherObservableType.MAP_ENTRIES:
      case WatcherObservableType.MAP_KEYS:
      case WatcherObservableType.MAP_VALUES:
      case WatcherObservableType.SET_ENTRIES:
      case WatcherObservableType.SET_KEYS:
      case WatcherObservableType.SET_VALUES:
        let ekv: any

        ekv = Reflect.get(this.target, this.key)
        if (typeof ekv !== 'function') return

        return ekv()
      case WatcherObservableType.MAP_GET:
        let get

        get = Reflect.get(this.target, 'get')
        if (typeof get !== 'function') return

        return get(this.key)
      case WatcherObservableType.PROXY_HANDLER_GET:
        return Reflect.get(this.target, this.key, this.receiver)
    }
  }

  static match(observables: WatcherObservable[], type: WriteType, target: object): boolean {
    let observable: WatcherObservable, kvm1: [any, any][], kvm2: [any, any][], kova1: any[], kova2: any[], a1: any, a2: any

    for (let i = 0; i < observables.length; i++) {
      observable = observables[i]

      switch (observable.type) {
        case WatcherObservableType.MAP_ENTRIES:
        case WatcherObservableType.SET_ENTRIES:
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
        case WatcherObservableType.MAP_KEYS:
        case WatcherObservableType.MAP_VALUES:
        case WatcherObservableType.SET_KEYS:
        case WatcherObservableType.SET_VALUES:
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
        case WatcherObservableType.MAP_GET:
        case WatcherObservableType.PROXY_HANDLER_GET:
          a1 = observable.value
          a2 = observable.get()

          if (a1 !== a2) {
            return false
          }

          if (typeof a2 !== 'object') {
            continue
          }

          switch (type) {
            case WriteType.PROXY_HANDLER_DELETE_PROPERTY:
            case WriteType.PROXY_HANDLER_SET:
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
