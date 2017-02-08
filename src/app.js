
import Inferno from 'inferno'


import dispatcher$ from 'fw'
import stream from 'fw/stream'

import View from './view'

import { init } from './widgets/counter/update'


let model$ =
  stream.scan(dispatcher$.reducer, init(), dispatcher$)

let render = model => {
  // model.test = 'test'
  console.log('render:', model)
  Inferno.render(<View model={ model }/>, document.getElementById('app'))
}

export default () => {
  stream.on(render, model$)

}


let list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

let ans1 = list
  .map(v => v + 1) // 2nd array
  .filter(v => !(v % 2)) // 3rn array
  .map(v => v * 2) // 4th array
  .reduce((acc, v) => acc + v, 0)
  // .map(v => console.log(v))


let st =
  stream()


// st.filter = function filter (fn) {
//   console.log('----222', fn, this)
// }

let batched = st
  .map(v => v + 1)
  .filter(v => !(v % 2))
  .map(v => v * 2)
  .batch((acc, v) => acc + v, 0)

batched.map(v => console.log('02:', v))
  // .map()

list.forEach(st)


// let ans2 = batched.flush()

console.log('01:', ans1)
batched.flush()

// batched.map(v => console.log('02:', v))


// let ans2 = list.map(v => st(v))
//
// st(4)
// st(10)
// console.log('02:', ans2)

// list.reduce((acc, v) => {
//
// }, 0)
