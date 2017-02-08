import Type from './union-type'
import flyd from './stream'

import curryN from 'ramda/src/curryN'

export const any = () => true
export const none = () => false

export const Maybe =
  Type({
    Nothing: [],
    Just: [any],
  })

Maybe.extends = type => {
  let t = Type(type)
  t._ctor = Maybe
  return t
}


Maybe.prototype.map =
  function (fn) {
    return Maybe.case({
      Nothing: () => Maybe.Nothing(),
      Just: v => Maybe.Just(fn(v))
    }, this)
  }

export let maybeToValue =
  curryN(3,
    (Just, Nothing, maybe) => maybe.case({ Nothing, Just })
  )


export const Result =
  Type({
    Err: [any],
    Ok: [any],
  })

Result.prototype.map =
  function (fn) {
    return Result.case({
      Err: () => Result.Nothing(),
      Ok: v => Result.Just(fn(v))
    }, this)
  }

let _resultToValue =
  (Ok, Err, result) =>
    result.case({ Err, Ok })

export let resultToValue =
  curryN(3, _resultToValue)
