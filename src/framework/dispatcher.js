import deepFreeze from './deep-freeze'

import stream from './stream'
import curryN from 'ramda/src/curryN'

import co from './co'

import { isFunction } from './type-check'


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
      return isFunction(f)
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


export let outbound$ =
  stream()


let applyMiddleware =
  co(_applyMiddleware)


let isFirstRun = true
let inboundPayload = []
export let update =
  curryN(2, (model, msg) => {

    if (!isFirstRun) {
      inboundPayload[0] = model
      inboundPayload[1] = msg
      inbound$(inboundPayload)
      return

    }

    isFirstRun = false

    // first run
    applyMiddleware(model, msg)

    return

  })


let genList = []
dispatcher$.middleware =
  genFn => {
    if (__DEV__) {
      if (!isFirstRun) {
        throw new Error('can\'t add midleware at run time')
      }
    }

    genList.unshift(genFn)
  }


// 1st [model, msg]
//    inbound to middleware, must call using co
//    outbound to update must be with stream

// 2nd ... [model, msg]
//    inbound to middleware, must use stream
//    outbound to update must be with stream

// TODO: too many arrays created.
// needs to be smart about overusing them

function * _applyMiddleware (model, msg) {
  let len = genList.length
  let i = len
  let list = []
  let iterRetVal = [model, msg]

  // the return model from 1st iter its passed into the second iter
  // the 1st special prep runs
  while (i--) {

    // just init the iter. looping backwards
    list[i] = genList[i](iterRetVal)

    iterRetVal = list[i].next().value

    // thunk
    if (isFunction(iterRetVal)) {
      iterRetVal = yield iterRetVal
    }

    // promise
    if (iterRetVal && isFunction(iterRetVal.then)) {
      iterRetVal = yield iterRetVal
    }
  }

  // calling update reducers here
  iterRetVal[0] = reducer$()(iterRetVal[0], iterRetVal[1])

  // main loop
  while (true) {
    i = len

    //after update reducing fn is done. finish middlewares
    while (i--) {
      // looping foward
      iterRetVal = list[len - (i + 1)].next(iterRetVal).value

      if (isFunction(iterRetVal)) {
        iterRetVal = yield iterRetVal
      }

      if (iterRetVal && isFunction(iterRetVal.then)) {
        iterRetVal = yield iterRetVal
      }

    }

    // send model outbound to the render function
    outbound$(iterRetVal[0])

    iterRetVal = yield inboundThunk
    i = len

    // pre update loop
    while (i--) {
      iterRetVal = list[i].next(iterRetVal).value

      if (isFunction(iterRetVal)) {
        iterRetVal = yield iterRetVal
      }

      if (iterRetVal && isFunction(iterRetVal.then)) {
        iterRetVal = yield iterRetVal
      }
    }

    // call update reducing fn here
    iterRetVal[0] = reducer$()(iterRetVal[0], iterRetVal[1])
  }
}


function inboundThunk (next) {
  inbound$.map(v => {
    // NOTE: that calling map on every inbound data
    // will cause memory leak.
    // Therefore, reseting the inboud$ stream and let
    // the GC do its thing

    inbound$ = stream()
    return next(null, v)
  })
}
