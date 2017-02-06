import './app.css'
import Inferno from 'inferno'

// import flip from 'ramda/src/flip'

import flyd from 'flyd'

import View from './view'

import { init } from './widgets/counter/update'

import { dispatcher$, appReducer } from 'fw'

let model$ =
  flyd.scan(appReducer, init(), dispatcher$)

let render = model => {
  // model.test = 'test'
  console.log('render:', model)
  Inferno.render(<View model={ model }/>, document.getElementById('app'))
}

export default () => {
  flyd.on(render, model$)

}



//
// let run =
//   ({init, update, view}) => {
//     console.log(init, update, view)
//   }
//
//
// // run({init, update, view: ClickView})
//
//
//
// let add =
//   x => y => x + y
//
// // console.log('==', Maybe)
//
//
// let just = Maybe.Just(1)
// let nothing = Maybe.Nothing()
// // console.log('$$$$', nothing.map(add(1))) // => Nothing
//
// let two =  just.map(add(1))

// console.log('####', just.map(add(1) ))
// console.log('####', two.map(add(10)))


// let Model =
//   Type({
//     Increment: Boolean,
//     Decrement: Boolean,
//   })
