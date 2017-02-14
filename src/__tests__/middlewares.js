/* eslint-disable */

import dispatcher$ from 'fw/dispatcher'


// it('', () => {})


// lame async test
let i = 1000
let shouldSleep = false
let shouldLog = false
let shouldPromise = false
let shouldThunk = true
let shouldGenFun = false // something really weird with this


if (shouldPromise) {
  console.log('Promise')
}

if (shouldThunk) {
  console.log('Thunk')
}

let preThunk =
  iterRetVal => next => {
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


let postThunk =
  iterRetVal => next => {
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

while (i--) {

  if (shouldGenFun) {
    dispatcher$.middleware(function * genFunStyle (iterRetVal) {
      // console.log('^^^^^^^')

      while (true) {
        if (shouldLog) {
          console.log('pre gen')
        }

        iterRetVal = yield function * preGet () {
          // with a thunk, it blows up the stack

          return new Promise((resolve, reject) => {
            if (shouldSleep) {
              setTimeout(() => {
                if (shouldLog) {
                  console.log('00')
                }
                resolve(iterRetVal)
              }, 200)


            }
            else {
              if (shouldLog) {
                console.log('00')
              }

              // console.log('IIIIIIII', iterRetVal)
              // setImmediate(() => {
                resolve(iterRetVal)
              // })
            }
          })

        }


        if (shouldLog) {
          console.log('pos gen')
        }


        iterRetVal = yield function * postGen () {
          return new Promise((resolve, reject) => {
            if (shouldSleep) {
              setTimeout(() => {
                if (shouldLog) {
                  console.log('00')
                }
                resolve(iterRetVal)
              }, 200)


            }
            else {
              if (shouldLog) {
                console.log('00')
              }

              // console.log('IIIIIIII', iterRetVal)
              // setImmediate(() => {
                resolve(iterRetVal)
              // })
            }
          })
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

        iterRetVal = yield preThunk(iterRetVal)

        if (shouldLog) {
          console.log('pos thunk')
        }


        ;iterRetVal = yield postThunk(iterRetVal)

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

          // iterRetVal = yield Promise.resolve(iterRetVal)
          iterRetVal = yield new Promise((resolve, reject) => {
            resolve(iterRetVal)
          })
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

          iterRetVal = yield new Promise((resolve, reject) => {
            resolve(iterRetVal)
          })
          // iterRetVal = yield Promise.resolve(iterRetVal)
        }

      }
    })

  }


}
