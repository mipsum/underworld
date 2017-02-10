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


let payload = []
let isFirstRun = true
export let update =
  curryN(2, (model, msg) => {
    console.log('up', model.value, msg._name)

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

    // console.log('444444', msg._name)

    inbound$([model, msg])
    // console.log('!!!!!!!!33344455')


    // return model

    // return reducer$()(model, msg)
  })


let genList = []
dispatcher$.middleware =
  genFn => genList.push(genFn)



dispatcher$.middleware(function * logger (model, msg) {

  while (true) {
    console.warn(['in', model.value, msg._name])

    model = yield model

    console.warn(['out', model.value, msg._name])

    model = yield model
  }



})

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
  let payload


  // console.log('mid', len, genList)
  // the return model from 1st iter its passed into the second iter
  // the 1st special prep runs
  while (i--) {
    n = len - (i + 1)

    // just init the iter
    list[n] = genList[n](model, msg)

    model = list[n].next().value


    if ('function' === typeof model) {
      model = yield model
    }

    if (model && 'function' === typeof model.then) {
      model = yield model
    }
  }


  model = outbound$(reducer$()(model, msg))()

  // console.log('$$$$$', model, msg)

  // app loop
  while (true) {

    i = len

    //after update
    while (i--) {

      n = len - (i + 1)

      model = list[n].next(model).value

      if ('function' === typeof model) {
        model = yield model
      }

      if (model && 'function' === typeof model.then) {
        model = yield model
      }


    }

    // after update loop

    // send model to view here
    // outbound stream send here

    let payload = yield next => {
      console.log('sleeping')
      inbound$.map(v => next(null, v))

      // inbound stream here
      // it returns the [model, msg]


      // reducer$()(model, msg)
    }
    console.log('out', payload[1]._name)

    i = len

    console.log('8678867', len)
    //
    // pre update
    while (i--) {

      n = len - (i + 1)

      model = list[n].next(model).value

      if ('function' === typeof model) {
        model = yield model
      }

      if (model && 'function' === typeof model.then) {
        model = yield model
      }

    }


    // pre update loop
    model = outbound$(reducer$()(payload[0], payload[1]))()
    // dispatcher$(payload[1])

    // call update here

  }

}






//
