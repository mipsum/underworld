/* eslint-disable */

import dispatcher$ from 'fw/dispatcher'

import './catcher'
import './logger'


// lame async test
let i = 1000
let shouldSleep = false
let shouldLog = false
let shouldPromise = false
let shouldThunk = true

while (i--) {

  if (shouldThunk) {
    dispatcher$.middleware(function * thunkStyle (iterRetVal) {

      while (true) {
        if (shouldLog) {
          console.log('pre thunk')
        }

        iterRetVal = yield next => {
          if (shouldSleep) {
            setTimeout(() => {
              if (shouldLog) {
                console.log('00')
              }
              next(null, iterRetVal)
            }, 200)
          }
          else {
            if (shouldLog) {
              console.log('00')
            }
            // setImmediate(() => {
              next(null, iterRetVal)
            // })
          }

        }

        if (shouldLog) {
          console.log('pos thunk')
        }


        ;iterRetVal = yield next => {
          if (shouldSleep) {
            setTimeout(() => {
              if (shouldLog) {
                console.log('01')
              }
              next(null, iterRetVal)
            }, 200)
          }
          else {
            if (shouldLog) {
              console.log('01')
            }
            next(null, iterRetVal)
          }
        }

      }
    })

  }


  if (shouldPromise) {
    dispatcher$.middleware(function * promiseStyle (iterRetVal) {

      while (true) {

        if (shouldLog) {
          console.log('pre promise')
        }

        if (shouldSleep) {
          ;iterRetVal = yield new Promise((res, rej) => {
            setTimeout(() => {
              if (shouldLog) {
                console.log('02')
              }
              res(iterRetVal)
            }, 200)
          })

        }
        else {
          if (shouldLog) {
            console.log('02')
          }

          iterRetVal = yield Promise.resolve(iterRetVal)
        }



        if (shouldLog) {
          console.log('pos promise')
        }



        if (shouldSleep) {
          ;iterRetVal = yield new Promise((res, rej) => {
            setTimeout(() => {
              if (shouldLog) {
                console.log('03')
              }
              res(iterRetVal)
            }, 200)
          })

        }
        else {
          if (shouldLog) {
            console.log('03')
          }

          iterRetVal = yield Promise.resolve(iterRetVal)
        }

      }
    })

  }


}
