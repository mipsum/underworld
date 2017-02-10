
import curryN from 'ramda/src/curryN'

import dispatcher$, { update } from './dispatcher'
import stream from './stream'



let location = {}
let storage = {}

export default curryN(2, function run (init, render) {
  // let initState =
  //   init({ location, storage })
  //
  // let model$ =
  //   stream.scan(update, initState, dispatcher$)
  //
  // stream.on(render, model$)



  return stream.on(render, dispatcher$.scan(update, init(storage, location)))

})
