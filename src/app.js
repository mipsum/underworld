import './app.css'
import Inferno from 'inferno'

import __ from 'ramda/src/__'

import flyd from 'flyd'

import View from './view'

import { update, init } from './widgets/counter/update'
import { click$ } from './widgets/counter'


let _update =
  (model, act) =>
    update(act, model)

let model$ =
  flyd.scan(_update, init(), click$)

let render = model => {
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
