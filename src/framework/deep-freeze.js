// NOTE:
// code witho minor changes from copied from:
// https://github.com/substack/deep-freeze/blob/master/index.js
// commit: 566d4e7

let isFrozen = Object.isFrozen
let isProd = 'production' === process.env.NODE_ENV



let shouldDeepFreeze =
  (o, prop) =>
    o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === "object" || typeof o[prop] === "function")
      && !isFrozen(o[prop])



export default function deepFreeze (o) {
  if (isProd) {
    console.log('is prod')
    return o
  }

  if (!isFrozen(o)) {
    Object.freeze(o)
  }

  Object.getOwnPropertyNames(o)
    .forEach(prop => shouldDeepFreeze(o, prop) ? deepFreeze(o[prop]) : o)

  return o
}
