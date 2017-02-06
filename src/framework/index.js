import flyd from './flyd'

export let dispatcher$ =
  flyd.stream()

let reducerSink$ =
  flyd.stream()


let firstReducer =
  (msg, model) => {
    console.log('first red', model, msg)

    return model
  }

let reducerCreator =
  (reducerPipeline, newReducer) => {

    console.log('up', reducerPipeline, newReducer)

    // let reducer = reducer$()
    return (model, msg) =>
      newReducer(msg, reducerPipeline(msg, model))

  }



let reducer$ =
  flyd.scan(reducerCreator, firstReducer, reducerSink$)

let wrapper =
  fn => flyd.curryN(2, (msg, model) => {

    console.log(['wraped up', msg, model])

    if (fn._ctx && fn._ctx.prototype.isPrototypeOf(msg)) {
      return fn(msg, model)
    }

    return model



    // if (!fn._ctx) {
    //   return fn(o)
    // }
    //
    // console.log(['----- map fn wrapped', o, fn._ctx.prototype.isPrototypeOf(o), fn])
    // return fn(o)
  })



export let appReducer =
  (model, msg) => reducer$()(model, msg)

dispatcher$.update =
  function update (fn) {
    // console.log('++++++++', wrapper(fn))


    // dispatcher$.map(wrapper(fn))

    // reducerSink$(fn)
    reducerSink$(wrapper(fn))
  }


//
// function createUpdate (st) {
//   let _map = st.map
//
//   return function update (fn) {
//     // console.log('----- wrapping', fn)
//
//     return _map.call(this, wrapper(fn))
//   }
//
// }
//
// //TODO: write a test before calling the update fn
// let wrapper =
//   f => {
//     return o => {
//       if (!f.ctx) {
//         return f(o)
//       }
//
//
//
//       console.log(['----- map fn wrapped', o, f.ctx.prototype.isPrototypeOf(o), f])
//       return f(o)
//     }
//   }
