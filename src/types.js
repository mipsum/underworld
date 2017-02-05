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


console.log('*****', Maybe)
