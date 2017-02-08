
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import stream from 'fw/stream'

import { Maybe } from 'fw/types'
import { Action } from './types'

import dispatcher$ from 'fw'

export let click$ =
  stream(Action.Increment(Maybe.Nothing()))

click$.map(dispatcher$)

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
