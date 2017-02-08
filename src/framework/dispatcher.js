import deepFreeze from './deep-freeze'

import stream from './stream'
import curryN from 'ramda/src/curryN'



let dispatcher$ =
  stream()

export default dispatcher$

let reducerCreator =
  (reducerPipeline, newReducer) =>
    (model, msg) =>
      deepFreeze(newReducer(deepFreeze(reducerPipeline(deepFreeze(model), msg)), msg))


let noopReducer =
  (model, msg) => log('first noop reducer:', model)


let reducerSink$ =
  stream()


let reducer$ =
  stream.scan(reducerCreator, noopReducer, reducerSink$)


let reducerWrap =
  fn => curryN(2, (model, msg) => {
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
