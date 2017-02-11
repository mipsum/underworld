import './setup'

import Inferno from 'inferno'
// import stream from 'fw/stream'
import run from 'fw/run'

import './middlewares'

import View from '../view'

import { init } from '../widgets/counter/update'


it('renders without crashing', () => {
  const elem = document.getElementById("app")

  run(init, model => {
    Inferno.render(<View model={ model }/>, elem)
    setTimeout(() => {
      console.log(elem.innerHTML)
    }, 100)

  })

});
