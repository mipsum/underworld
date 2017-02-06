import flyd from './flyd'

import deepFreeze from './deep-freeze'

export let dispatcher$ =
  flyd.stream()

export default dispatcher$

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


let reducerWrap =
  fn => flyd.curryN(2, (model, msg) => {
    if (fn._ctx) {
      return fn._ctx.prototype.isPrototypeOf(msg)
        // the order of args is a bit different this case
        ? fn(msg, model)
        : model
    }

    let f = fn(model)

    if (!f._ctx) {
      return 'function' === typeof f
        ? f(msg)
        : f
    }

    return f._ctx && f._ctx.prototype.isPrototypeOf(msg)
      ? f(msg)
      : model

  })


dispatcher$.reducer =
  (model, msg) => reducer$()(model, msg)

dispatcher$.store =
  fn => { reducerSink$(reducerWrap(fn)) }
