// eslint-disable-next-line
import flyd from 'flyd'

import { maybeToValue } from '../../types'
import { Action } from './types'



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
