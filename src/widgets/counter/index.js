
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import flyd from 'flyd'

import { Maybe } from '../../types'
import { Action } from './types'


export let click$ =
  flyd.stream(Action.Increment(Maybe.Nothing()))


let handleClick =
  (msg, evt) => {
    console.log('view', msg, evt)
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
