import flyd from './flyd'

import deepFreeze from './deep-freeze'

export let dispatcher$ =
  flyd.stream()

let reducerCreator =
  (reducerPipeline, newReducer) =>
    (model, msg) =>
      deepFreeze(newReducer(deepFreeze(reducerPipeline(deepFreeze(model), msg)), msg))

let noopReducer =
  (model, msg) => log('first noop reducer:', model)


let reducerSink$ =
  flyd.stream()


let reducer$ =
  flyd.scan(reducerCreator, noopReducer, reducerSink$)


export let appReducer =
  (model, msg) => reducer$()(model, msg)


let reducerWrap =
  fn => flyd.curryN(2, (model, msg) => {
    if (fn._ctx) {
      if (fn._ctx.prototype.isPrototypeOf(msg)) {
        // the order of args is a bit different this case
        return fn(msg, model)
      }
      return model
    }

    let f = fn(model)

    if (!f._ctx) {
      if ('function' === typeof f) {
        return f(msg)
      }

      return f
    }

    if (f._ctx && f._ctx.prototype.isPrototypeOf(msg)) {
      return f(msg)
    }

    return model
  })


dispatcher$.store =
  fn => { reducerSink$(reducerWrap(fn)) }
