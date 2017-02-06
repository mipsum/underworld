
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import flyd from 'flyd'

import { Maybe } from 'fw/types'
import { Action } from './types'

import { dispatcher$ } from 'fw'

import Type from 'union-type'

export const Maybe01 =
  Type({
    Nothing: [],
    Just: [n => 1 === n],
  })

export let click$ =
  flyd.stream(Action.Increment(Maybe.Nothing()))

click$.map(dispatcher$)

let handleClick =
  (msg, evt) => {
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
