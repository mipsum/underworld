import flyd from 'flyd'
import curryN from 'ramda/src/curryN'

import { isFunction } from './type-check'


export let stream =
  (...a) => wrapStream(flyd.stream(...a))


export let combine =
  curryN(2, (a, b) => wrapStream(flyd.combine(a, b)))


export let isStream =
  flyd.isStream


export let immediate =
  curryN(1, a => wrapStream(flyd.immediate(a)))


export let endsOn =
  curryN(2, (a, b) => wrapStream(flyd.endsOn(a, b)))


export let on =
  curryN(2, (a, b) => wrapStream(flyd.on(a, b)))


export let merge =
  curryN(2, (a, b) => wrapStream(flyd.merge(a, b)))


export let transduce =
  curryN(2, (a, b) => wrapStream(flyd.transduce(a, b)))


export default Object.assign(stream, {
  combine, immediate, endsOn, on, merge, transduce,
  // reset, thunk
  // map, filter, batch, scan
})


// TODO: if the function returns `f` returns another function
// assumes it is a thunk. attach a .then method into it to make it async
let boundMap = curryN(1, function _boundMap (f) {
  // return wrapStream(flyd.map(f, this))
  return wrapStream(flyd.map(wrapMapFn(f, this), this))
})


let boundBatch = curryN(2, function _boundBatch (f, acc) {

  let s = flyd.stream()

  s.flush = function flush (_acc) {
    let res = s(acc)

    if (arguments.length > 0) {
      acc = _acc
    }

    return res()
  }

  this.map(v => acc = f(acc, v))

  return wrapStream(s)
})


let boundFilter = curryN(1, function _boundFilter (f) {
  let s = flyd.stream()


  this.map(v => f(v) ? s(v) : void 0)

  return wrapStream(s)
})


let boundScan = curryN(2, function _boundScan (f, acc) {
  let s = flyd.stream()

  s.flush = function flush (_acc) {
    let res = s(acc)

    if (arguments.length > 0) {
      acc = _acc
    }

    return res()
  }

  this.map(v => s(acc = f(acc, v)))

  return wrapStream(s)
})


function wrapStream (s) {
  s.map = boundMap
  s.scan = boundScan
  s.batch = boundBatch
  s.filter = boundFilter

  return s
}


function wrapMapFn (f, s) {
  return v => {
    let n = f(v)
    if (flyd.isStream(n)) {
      return n
    }

    if (!isFunction(n)) {
      return n
    }

    n(s)
  }
}
