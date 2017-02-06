import Type from 'union-type'
import flyd from 'flyd'

export const any = () => true
export const none = () => false

export const Maybe =
  Type({
    Nothing: [],
    Just: [any],
  })

Maybe.prototype.map =
  function (fn) {
    return Maybe.case({
      Nothing: () => Maybe.Nothing(),
      Just: v => Maybe.Just(fn(v))
    }, this)
  }

let _maybeToValue =
  (Just, Nothing, maybe) =>
    maybe.case({ Nothing, Just })

export let maybeToValue =
  flyd.curryN(3, _maybeToValue)





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
  flyd.curryN(3, _resultToValue)
