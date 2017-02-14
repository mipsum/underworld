
import curryN from 'ramda/src/curryN'

import dispatcher$, { update, outbound$ } from './dispatcher'
import stream from './stream'



let location = {}
let storage = {}

export default curryN(2, function run (init, render) {
  //
  // big play with the model here:
  //
  //    1st) it is create by the init function
  //    2nd) whenever a msg is sent to the dispatcher
  //         it call the update function
  //    3rd) the update function leverages co and passes the
  //         [model, msg] into generators middlewares
  //    4th) at the end of the update function cycle, it sends
  //         the model outbound to the render function
  //    5th) the render function passes the new model into the
  //         views
  //

  let model = init(storage, location)

  stream.on(msg => update(model, msg), dispatcher$)

  outbound$.map(m => model = m)
  return stream.on(render, outbound$)
})
