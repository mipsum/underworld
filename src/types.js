import Type from 'union-type'

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


export let maybeToValue =
  Just => Nothing => maybe =>
    maybe.case({ Nothing, Just })
