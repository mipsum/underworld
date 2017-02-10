
import Inferno from 'inferno'
// import stream from 'fw/stream'
import run from 'fw/run'

// import './middlewares'

import View from './view'

import { init } from './widgets/counter/update'



export default () => {
  const elem = document.getElementById('app')

  run(init, model => Inferno.render(<View model={ model }/>, elem))
}


// done --- just tests from now on


// let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
//
// let ans1 = list
//   .map(v => v + 1) // 2nd array
//   .filter(v => !(v % 2)) // 3rn array
//   .map(v => v * 2) // 4th array
//   .reduce((acc, v) => acc + v, 0)
//   // .map(v => console.log(v))
//
//
// let st =
//   stream()
//
//
// // st.filter = function filter (fn) {
// //   console.log('----222', fn, this)
// // }
//
// let batched = st
//   .map(v => v + 1)
//   .filter(v => !(v % 2))
//   .map(v => v * 2)
//   .batch((acc, v) => acc + v, 0)
//
// batched.map(v => console.log('batched1:', v))
//
//
//
// let scanned = st
//   .map(v => v + 1)
//   .filter(v => !(v % 2))
//   .map(v => v * 2)
//   .scan((acc, v) => acc + v, 0)
//
//
// scanned.map(v => console.log('scanned1:', v))
//
//   // .map()
//
// list.forEach(st)
//
//
// // let ans2 = batched.flush()
//
// console.log('std:', ans1)
// console.log('batched2:', batched.flush(0))
// console.log('scanned2:', scanned.flush(0))
//
// list.forEach(st)
//
// console.log('batched3:', batched.flush())
// console.log('scanned3:', scanned.flush())

// batched.map(v => console.log('02:', v))


// let ans2 = list.map(v => st(v))
//
// st(4)
// st(10)
// console.log('02:', ans2)

// list.reduce((acc, v) => {
//
// }, 0)
