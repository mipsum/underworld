
import Inferno from 'inferno'


import dispatcher$ from 'fw'
import flyd from 'fw/flyd'

import View from './view'

import { init } from './widgets/counter/update'


let model$ =
  flyd.scan(dispatcher$.reducer, init(), dispatcher$)

let render = model => {
  // model.test = 'test'
  console.log('render:', model)
  Inferno.render(<View model={ model }/>, document.getElementById('app'))
}

export default () => {
  flyd.on(render, model$)

}
