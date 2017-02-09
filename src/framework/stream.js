import flyd from 'flyd'
import curryN from 'ramda/src/curryN'

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
  // map, filter, batch, scan
})


let boundMap = curryN(1, function _boundMap (f) {
  return wrapStream(flyd.map(f, this))
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





// // TODO: test this new maps
//
//
// export let scan =
//     curryN(3, (a, b, c) => wrapStream(flyd.scan(a, b, c)))
//
//
// export let map =
//   curryN(2, function map (fn, s) {
//     let st = stream()
//
//     s.map(st)
//
//     return st
//   })
//
// export let filter =
//   curryN(2, function filter (fn, s) {
//     let st = stream()
//
//     s.map(v => fn(v) ? st(v) : void 0)
//
//     return st
//   })
//
// export let batch =
//   curryN(3, function batch (fn, acc, s) {
//     let st = stream()
//
//     st.flush = function flush (_acc) {
//       let res = st(acc)
//
//       if (arguments.length > 0) {
//         acc = _acc
//       }
//
//       return res()
//     }
//
//     s.map(v => acc = fn(acc, v))
//
//     return st
//   })
