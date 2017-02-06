// eslint-disable-next-line
import flyd from 'flyd'

import { maybeToValue } from 'fw/types'
import { Action } from './types'

import { dispatcher$ } from 'fw'


// dispatcher$.store(res => {
//   console.log('!!!!1', res)
//
//   return res
// })


let inc =
  maybeToValue(() => 1, () => 0)

export let init =
  () => ({ value: 0 })

// export let update =
//   Action.caseOn({
//     Increment: (maybe, { value }) =>
//       log('inc', ({ value: value + inc(maybe) })),
//
//     Decrement: (maybe, { value }) =>
//       log('dec', ({ value: value - inc(maybe) })),
//   })


export let update =
  ({ value }) => {
    return Action.case({
        Increment: maybe =>
          log('inc', ({ value: value + inc(maybe) })),

        Decrement: maybe =>
          log('dec', ({ value: value - inc(maybe) })),
      })
  }



// NOTE: The Best
dispatcher$.store(update)

// NOTE: OK
dispatcher$.store(flyd.curryN(2, (model, msg) => {

  console.log('curryed store', model, msg)
  // model.jj = 'jj'
  return {...model, ...{ yes: 'Yes' }}

}))

// NOTE: not good
dispatcher$.store((model, msg) => {
  console.log('not curryed store', model, msg)
  return { ...model, ...{ no: 'NO' }}
})
