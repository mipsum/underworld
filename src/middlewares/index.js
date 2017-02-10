
// import dispatcher$ from 'fw/dispatcher'

import './catcher'
import './logger'


// lame async test
// dispatcher$.middleware(function * (model, msg) {
//
//   while (true) {
//     console.log('pre thunk')
//     ;[model, msg] = yield next => {
//       setTimeout(() => {
//         console.log('SS')
//         next(null, [model, msg])
//       }, 200)
//     }
//
//     console.log('pos thunk')
//
//     ;[model, msg] = yield next => {
//       setTimeout(() => {
//         console.log('XX')
//         next(null, [model, msg])
//       }, 200)
//     }
//
//   }
// })
//
//
//
// dispatcher$.middleware(function * (model, msg) {
//
//   while (true) {
//     console.log('pre promise')
//     ;[model, msg] = yield new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log('WW')
//         res([model, msg])
//       }, 200)
//     })
//
//     console.log('pos promise')
//
//     ;[model, msg] = yield new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log('QQ')
//         res([model, msg])
//       }, 200)
//     })
//
//   }
// })
