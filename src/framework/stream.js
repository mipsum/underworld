import flyd from 'flyd'

export let stream =
  (...args) => {
    let st = flyd.stream(...args)

    return Object.assign(st, {
      batch: boundBatch,
      filter: boundFilter,
      map: boundMap,
    })

  }

export let combine = flyd.combine
export let isStream = flyd.isStream
export let immediate = flyd.immediate
export let endsOn = flyd.endsOn
export let map = flyd.map
export let on = flyd.on
export let scan = flyd.scan
export let merge = flyd.merge
export let transduce = flyd.transduce

export default Object.assign(stream, {
  combine, immediate, endsOn, map, on, scan, merge, transduce
  // add filter and batch version here
})


function boundMap (f) {
  return Object.assign(flyd.map(f, this), {
    batch: boundBatch,
    filter: boundFilter,
  })
}


function boundBatch (f, acc) {

  let s = flyd.stream()

  s.flush = function flush (_acc) {
    let res = s(acc)

    if (arguments.length > 0) {
      acc = _acc
    }

    return res
  }

  this.map(v => acc = f(acc, v))

  return Object.assign(s, {
    filter: boundFilter,
    map: boundMap,
  })
}


function boundFilter (f) {
  let s = flyd.stream()


  this.map(v => f(v) ? s(v) : void 0)

  return Object.assign(s, {
    batch: boundBatch,
    map: boundMap,
  })
}
