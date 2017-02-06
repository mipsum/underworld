// NOTE:
// code witho minor changes from copied from:
// https://github.com/substack/deep-freeze/blob/master/index.js

export default function deepFreeze (o) {
  if ('production' === process.env.NODE_ENV) {
    return
  }

  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
    && o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop])
    }
  })

  return o
}
