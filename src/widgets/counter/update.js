// eslint-disable-next-line
import stream from 'fw/stream'

import curryN from 'ramda/src/curryN'

import { maybeToValue } from 'fw/types'
import { Msg } from './msg'

import dispatcher$ from 'fw/dispatcher'

let inc : Function =
  maybeToValue(v => v, () => 0)


export let init =
  () => ({ value: 0 })


export let update =
  ({ value }) =>
    Msg.case({
      Increment: maybe =>
        // ({ value: value + inc(maybe) }),
        log('inc', ({ value: value + inc(maybe) })),

      Decrement: maybe =>
        // ({ value: value - inc(maybe) }),
        log('dec', ({ value: value - inc(maybe) })),
    })




// NOTE: The Best
dispatcher$.store(update)

// NOTE: OK
dispatcher$.store(curryN(2, (model, msg) => {

  // console.log('curryed store', model, msg)
  // model.jj = 'jj'
  return {...model, ...{ yes: 'Yes' }}

}))

export async function some () {
  console.log(await 'aaa')
  return 'ppp'
}


// NOTE: not good
dispatcher$.store((model, msg) => {
  // some().then(s => console.log('222222', s))

  // console.log('not curryed store', model, msg)
  return { ...model, ...{ no: 'NO' }}
})
