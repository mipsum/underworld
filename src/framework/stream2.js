// import co from './co'

import { isGeneratorFunction } from './type-check'


export default function stream (_st = _stream, queue = [], listeners = [], hightWaterMark = 100, queueCounter = 0) {
  let st

  if (isGeneratorFunction(_st)) {
    st = Object.create(_st())
    st.next()
  }
  else {
    st = Object.create(Object.getPrototypeOf(_st))
  }

  let payload = []
  payload[0] = st

  if (_st.writer) {
    st.writer = _st.writer
  }
  else {
    st.write =
      v => {
        if (hightWaterMark < queueCounter) {
          return false
        }
        queueCounter++
        payload[1] = v


        // TODO: replace this with while loop
        payload[2] =
          listeners.map(fn => fn(v))

        let pp = st.next(payload)

        console.log('***@@@@@@@@@@*', pp)


        // console.log('write', st.next(payload))
        return true
      }
  }



  st.pipe = (() => {
    let _listeners = []
    let _queue = []

    return fnOrGen => {

      _listeners.push(v => next => {
        console.log('@@@@@@@')
        fnOrGen(v, next)
      })


      return stream(st, _queue, _listeners, hightWaterMark, queueCounter)
    }
  })()


  // console.log('------', st)
  // init generator
  // if (_st)

  return st

}




function * _stream () {
  let payload
  let payloadResult
  let val
  // let handler


  while (true) {
    payload = yield

    console.log('____', payload[2])

    payloadResult = yield payload[2] // sending array of listeners



    // 'AAA'
    ;console.log('****!!----!*', payloadResult)
  }
}


let st = stream()
  .pipe((v, next) => {
    console.log('pipe', v, next)
  })



// st.write()
console.log('0001', st.write('D##DD 1'))
console.log('0002', st.write('D##DD 2'))

console.log('****!!!###!*', st)



// function * _applyMiddleware (model, msg) {
//   let len = genList.length
//   let i = len
//   let list = []
//   let iterRetVal = [model, msg]
//
//   // the return model from 1st iter its passed into the second iter
//   // the 1st special prep runs
//   while (i--) {
//
//     // just init the iter. looping backwards
//     list[i] = genList[i](iterRetVal)
//
//     iterRetVal = list[i].next().value
//
//     // thunk
//     if ('function' === typeof iterRetVal) {
//       iterRetVal = yield iterRetVal
//     }
//
//     // promise
//     if (iterRetVal && 'function' === typeof iterRetVal.then) {
//       iterRetVal = yield iterRetVal
//     }
//   }
//
//   // calling update reducers here
//   iterRetVal[0] = reducer$()(iterRetVal[0], iterRetVal[1])
//
//   // main loop
//   while (true) {
//     i = len
//
//     //after update reducing fn is done. finish middlewares
//     while (i--) {
//       // looping foward
//       iterRetVal = list[len - (i + 1)].next(iterRetVal).value
//
//       if ('function' === typeof iterRetVal) {
//         iterRetVal = yield iterRetVal
//       }
//
//       if (iterRetVal && 'function' === typeof iterRetVal.then) {
//         iterRetVal = yield iterRetVal
//       }
//
//     }
//
//
//     // send model outbound to the view here
//     outbound$(iterRetVal[0])
//
//     iterRetVal = yield inboundThunk
//     i = len
//
//     // pre update loop
//     while (i--) {
//       iterRetVal = list[i].next(iterRetVal).value
//
//       if ('function' === typeof iterRetVal) {
//         iterRetVal = yield iterRetVal
//       }
//
//       if (iterRetVal && 'function' === typeof iterRetVal.then) {
//         iterRetVal = yield iterRetVal
//       }
//     }
//
//     // call update reducing fn here
//     iterRetVal[0] = reducer$()(iterRetVal[0], iterRetVal[1])
//   }
// }
