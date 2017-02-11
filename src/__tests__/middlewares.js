/* eslint-disable */

import dispatcher$ from 'fw/dispatcher'


it('', () => {})


// lame async test
let i = 1
let shouldSleep = true
let shouldLog = true
let shouldPromise = true
let shouldThunk = true
let shouldGen = true

while (i--) {

  if (shouldGen) {
    dispatcher$.middleware(function * thunkStyle (iterRetVal) {

      while (true) {
        if (shouldLog) {
          console.log('pre gen')
        }

        iterRetVal = yield function * preGet () {
          return yield next => {
            // throw new Error('test gen')
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
        }


        if (shouldLog) {
          console.log('pos gen')
        }


        iterRetVal = yield function * postGen () {
          return yield next => {
            // throw new Error('test gen')
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
              // setImmediate(() => {
                next(null, iterRetVal)
              // })
            }

          }
        }

      }
    })

  }


  if (shouldThunk) {
    dispatcher$.middleware(function * thunkStyle (iterRetVal) {

      while (true) {
        if (shouldLog) {
          console.log('pre thunk')
        }

        iterRetVal = yield next => {
          // throw new Error('test thunk')
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
                console.log('00')
              }
              res(iterRetVal)
            }, 200)
          })

        }
        else {
          if (shouldLog) {
            console.log('00')
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
                console.log('01')
              }
              res(iterRetVal)
            }, 200)
          })

        }
        else {
          if (shouldLog) {
            console.log('01')
          }

          iterRetVal = yield Promise.resolve(iterRetVal)
        }

      }
    })

  }


}