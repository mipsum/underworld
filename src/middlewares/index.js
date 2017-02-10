// eslint-disable-next-line

import dispatcher$ from 'fw/dispatcher'
import curryN from 'ramda/src/curryN'

import stream from 'fw/stream'

// import { logger } from './logger'


// dispatcher$.middleware(logger({ verbose: true }))

// function sleep (ms, next) {
//   setTimeout(() =>)
// }


import co from './co'


function * mid00 (model, msg) {

  let c = 0

  let model2
  let _model

  while (true) {
    console.log('pre mid00 A', model)

    _model = {...model}
    _model.mid00 = _model.mid00 || [c]

    model2 = yield next => {
      setTimeout(() => {
        console.log('^^^^^^^^6', _model)
        next(null, _model)
      }, 200)
    }

    c++

    model2.mid00.push(c)

    console.log('pos mid00 B', model2)

    model = yield new Promise((res, rej) => {
      setTimeout(() => {
        console.log('^^^^^^^^^1', model2)
        res(model2)
      }, 200)
    })


    // let ans = yield n => 'mid00 A'

    // console.log('pos mid00 B', ans)
  }

  console.log('mid00 F')

}


function * mid01 (model, msg) {
  let c = 0

  let model2
  let _model

  while (true) {
    console.log('pre mid01 A', model)

    _model = {...model}
    _model.mid01 = _model.mid01 || [c]

    model2 = yield next => {
      setTimeout(() => {
        console.log('^^^^^^^^6', _model)
        next(null, _model)
      }, 200)
    }

    c++

    model2.mid01.push(c)

    console.log('pos mid01 B', model2)

    model = yield new Promise((res, rej) => {
      setTimeout(() => {
        console.log('^^^^^^^^^1', model2)
        res(model2)
      }, 200)
    })


    // let ans = yield n => 'mid01 A'

    // console.log('pos mid01 B', ans)
  }

  console.log('pos mid01 F')

  // return 'mid01 B'
}


function * mid02 (model, msg) {
  let c = 0

  let model2
  let _model

  while (true) {

    // prep model for reducers
    console.log('pre mid02 A', model)

    _model = {...model}
    _model.mid02 = _model.mid02 || [c]

    model2 = yield next => {
      setTimeout(() => {
        console.log('^^^^^^^^6', _model)
        next(null, _model)
      }, 200)
    }

    // prep model for views
    // mostly do nothing

    c++

    model2.mid02.push(c)

    console.log('pos mid02 B',c, model2)

    model = yield new Promise((res, rej) => {
      setTimeout(() => {
        console.log('^^^^^^^^^1', model2)
        res(model2)
      }, 200)
    })
    // model = yield model2


    // let ans = yield n => 'mid02 A'

    // console.log('pos mid02 B', ans)
  }

  console.log('mid02 F')
}

let list =
  [ mid00
  , mid01
  , mid02
  ]

let genList = []
function middleware (gen) {
  genList.push(gen)
}

// function applyMiddleware (update, model, msg) {
//
// }

// st.map(v => log('$######@', v(null, 's')))

let applyMiddleware = curryN(3, co(function * (update, model, msg) {

  let len = genList.length
  let i = len
  let n = 0

  // console.log(i)

  let _list = []

  // the return model from 1st iter its passed into the second iter
  // the 1st special prep runs
  while (i--) {
    n = len - (i + 1)

    // just init the iter
    _list[n] = list[n](model, msg)

    model = _list[n].next().value


    if ('function' === typeof model) {
      model = yield model
    }

    if (model && 'function' === typeof model.then) {
      model = yield model
    }
  }


  // A outer loop needs to be set here
  // call first time update here

  // while (true) {
  //   // after update loop
  //
  //   // send model to view here
  //
  //   yield waitMsg
  //
  //   // pre update loop
  //
  //   // call update here
  //
  // }

              console.log('-----------------------------------')
              i = len



              //
              //after update
              while (i--) {
                n = len - (i + 1)

                model = _list[n].next(model).value

                if ('function' === typeof model) {
                  model = yield model
                }

                if ('function' === typeof model) {
                  model = yield model
                }

                if (model && 'function' === typeof model.then) {
                  model = yield model
                }


              }
              //
              // console.log('/---------------------------\\')
              //

              // action trigegrs here
              // a stream must be set here to receive a dispacher call

              console.log('-----------------------------------')
              i = len
              //
              // pre update
              while (i--) {
                n = len - (i + 1)

                model = _list[n].next(model).value

                if ('function' === typeof model) {
                  model = yield model
                }

                if (model && 'function' === typeof model.then) {
                  model = yield model
                }

              }


  // end outer loop here


  console.log(_list)

  // console.log('rewewr')
  // let ans = yield st
  //
  // console.log('ans', ans)
}))


// ({model: 'a'}, {msg: 'b'})


function test (model, msg) {
  return (fn) => {
    console.log([model, msg, fn])

    return 'test'
  }

}

// this is real middleware


export let midLogger = curryN(3, async function midLogger (model, msg, next) {

  console.log('01')
  let m = await next(model, msg)
  console.log('02')

  return m


})


export let midTry = curryN(3, async function midTry (model, msg, next) {

  let m
  try {
    m = await next(model, msg)
  }
  catch (e) {
    console.error('errr', e)
    m = model
  }

  return m


})


// let middlewareCache = []
// function middleware (fn) {
//   middlewareCache.push(fn)
// }
