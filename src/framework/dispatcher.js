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

export let outbound$ =
  stream()


let applyMiddleware =
  co(_applyMiddleware)


let isFirstRun = true
export let update =
  curryN(2, (model, msg) => {

    if (isFirstRun) {
      isFirstRun = false

      // first run
      applyMiddleware(model, msg, (err, ok) => {
        // better logic if err
        if (err) { throw err }
        console.log('shouldn\'t have finished', ok)
      })

      return
    }

    inbound$([model, msg])
  })


let genList = []
dispatcher$.middleware =
  genFn => genList.unshift(genFn)


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
  let ret

  // the return model from 1st iter its passed into the second iter
  // the 1st special prep runs
  while (i--) {

    // just init the iter
    list[i] = genList[i](model, msg)

    ret = list[i].next().value

    if ('function' === typeof ret) {
      [model, msg] = yield ret
    }

    else if (ret && 'function' === typeof ret.then) {
      [model, msg] = yield ret
    }
    else {
      [model, msg] = ret
    }
  }


  model = outbound$(reducer$()(model, msg))()

  // main loop
  while (true) {

    i = len

    //after update
    while (i--) {
      ret = list[i].next([model, msg]).value

      if ('function' === typeof ret) {
        [model, msg] = yield ret
      }

      else if (ret && 'function' === typeof ret.then) {
        [model, msg] = yield ret
      }
      else {
        [model, msg] = ret
      }


    }

    // after update loop

    // send model to view here
    // outbound stream send here
    // break here. only when there is an action is when the next cicle continues
    msg = yield next => {
      stream.on(msg => next(null, msg), dispatcher$)
    }

    ;[model, msg] = yield next => {
      inbound$.map(v => next(null, v))
    }

    i = len

    //
    // pre update loop
    while (i--) {
      ret = list[i].next([model, msg]).value

      if ('function' === typeof ret) {
        [model, msg] = yield ret
      }

      else if (ret && 'function' === typeof ret.then) {
        [model, msg] = yield ret
      }
      else {
        [model, msg] = ret
      }

    }


    // call update here
    model = outbound$(reducer$()(model, msg))()

  }

}






//
