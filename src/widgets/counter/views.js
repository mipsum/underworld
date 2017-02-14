
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import stream from 'fw/stream'

import { Maybe } from 'fw/types'
import { Action } from './types'

import { dispatcher$ } from 'fw'

export let click$ =
  stream(Action.Increment(Maybe.Nothing()))

click$.map(dispatcher$)


let counter = 0
let counter2 = 0
function loop (ms) {

  setTimeout(() => {
    if (counter2 > 3) {
      return
    }

    click$(Action.Increment(Maybe.Just(1)))
    counter++
    if (counter > 100) {
      counter2++
      counter = 0
      loop(20)
      return
    }

    loop(20)
  }, ms)
}

if (!__DEV__) {
  setTimeout(() => {
    console.log('begining')
    loop(2000)
  }, 2000)
}



let handleClick =
  (msg, evt) => {
    click$(msg(Maybe.Just(1)))
  }

export default
  ({ model }) =>
    <div>
      <div onClick={ linkEvent(Action.Increment, handleClick) } >
        { `click here +` }
      </div>
      <div onClick={ linkEvent(Action.Decrement, handleClick) } >
        { `click here -` }
      </div>
      <div>
        {model}
      </div>
    </div>
