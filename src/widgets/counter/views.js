
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import flyd from 'flyd'

import { Maybe } from '../../types'
import { Action } from './types'

import { dispatcher$ } from 'fw'

console.log('244243', Maybe)

export let click$ =
  flyd.stream(Action.Increment(Maybe.Nothing()))
  // flyd.stream()

click$.map(dispatcher$)

let handleClick =
  (msg, evt) => {
    // console.log('view', msg, evt)
    click$(msg(Maybe.Just(20)))
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
