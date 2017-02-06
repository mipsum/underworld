// NOTE:
// code witho minor changes from copied from:
// https://github.com/substack/deep-freeze/blob/master/index.js
// commit: 566d4e7

let isFrozen = Object.isFrozen

export default function deepFreeze (o) {
  if ('production' === process.env.NODE_ENV) {
    return o
  }

  if (!isFrozen(o)) {
    Object.freeze(o)
  }

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !isFrozen(o[prop])) {
      deepFreeze(o[prop])
    }
  })

  return o
}
