import { Administration } from './administration'

export const GLOBAL_OBSERVABLE: object = {}
Administration.define(GLOBAL_OBSERVABLE, [], new Proxy(GLOBAL_OBSERVABLE, {}))
