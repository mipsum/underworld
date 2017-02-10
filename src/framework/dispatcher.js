import deepFreeze from './deep-freeze'

import stream from './stream'
import curryN from 'ramda/src/curryN'

import co from './co'


let dispatcher$ =
  stream()

export default dispatcher$

let reducerCreator =
  (reducerPipeline, newReducer) =>
    (model, msg) =>
      deepFreeze(newReducer(deepFreeze(reducerPipeline(deepFreeze(model), msg)), msg))


let noopReducer =
  m => m


let reducerSink$ =
  stream()


let reducer$ =
  reducerSink$.scan(reducerCreator, noopReducer)(noopReducer) // initializing



let reducerWrap =
  fn => curryN(2, (model, msg) => {
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


dispatcher$.store =
  curryN(1, fn => { reducerSink$(reducerWrap(fn)) })


let inbound$ =
  stream()

let outbound$ =
  stream()

export let update =
  curryN(2, (model, msg) => {
    return reducer$()(model, msg)
  })


let genList = []
dispatcher$.middleware =
  genFn => genList.push(genFn)


let applyMiddleware =
  curryN(2, co(_applyMiddleware))

// 1st [model, msg]
//    inbound to middleware, must call using co
//    outbound to update must be with stream

// 2nd ... [model, msg]
//    inbound to middleware, must use stream
//    outbound to update must be with stream

// must re-use the same array to send data in and out
// to avoid allocations

function * _applyMiddleware (model, msg) {
  let len = genList.length
  let i = len
  let n = 0
  let list = []


  // the return model from 1st iter its passed into the second iter
  // the 1st special prep runs
  while (i--) {
    n = len - (i + 1)

    // just init the iter
    list[n] = list[n](model, msg)

    model = list[n].next().value


    if ('function' === typeof model) {
      model = yield model
    }

    if (model && 'function' === typeof model.then) {
      model = yield model
    }
  }

  // app loop
  while (true) {
    // after update loop

    // send model to view here
    // outbound stream send here

    yield next => {
      // inbound stream here
      // it returns the [model, msg]


      // reducer$()(model, msg)
    }

    // pre update loop

    // call update here

  }

}






//
