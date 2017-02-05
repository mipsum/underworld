import flyd from './flyd'

export let dispatcher$ = flyd.stream()

dispatcher$.update = createUpdate(dispatcher$)


function createUpdate (st) {
  let _map = st.map

  return function update (fn) {
    console.log('----- wrapping', fn)

    return _map.call(this, wrapFn(fn))
  }

}

//TODO: write a test before calling the update fn
let wrapFn = f => {
  return o => {
    if (!f.ctx) {
      return f(o)
    }

    console.log(['----- map fn wrapped', o, f.ctx.prototype.isPrototypeOf(o), f])
    return f(o)
  }
}
