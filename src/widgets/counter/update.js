// eslint-disable-next-line
import flyd from 'flyd'

import { maybeToValue } from '../../types'
import { Action } from './types'

import { dispatcher$ } from 'fw'


dispatcher$.update(res => {
  console.log('!!!!1', res)

  return res
})


let inc =
  maybeToValue(() => 1, () => 0)

export let init =
  () => ({ value: 0 })

export let update =
  Action.caseOn({
    Increment: (maybe, { value }) =>
      log('inc', ({ value: value + inc(maybe) })),

    Decrement: (maybe, { value }) =>
      log('dec', ({ value: value - inc(maybe) })),
  })


dispatcher$.update(update)
