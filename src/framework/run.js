
import curryN from 'ramda/src/curryN'

import dispatcher$, { update, outbound$ } from './dispatcher'
import stream from './stream'



let location = {}
let storage = {}

export default curryN(2, function run (init, render) {
  let model = init(storage, location)

  stream.on(msg => update(model, msg), dispatcher$)

  outbound$.map(m => model = m)

  return stream.on(render, outbound$)

})

let st = stream()

// st.map(v => new Promise((res, rej) => {
//   setTimeout(() => {
//     res(v)
//   }, 1000)
// }))


st.map(v => {
  let st = stream()

  stream.thunk(() => {})

  setTimeout(() => {st(v)}, 1000)

  return st
})

.map(v => {
  return console.log('^^^^^^', v)
})

st('LLLLL')
