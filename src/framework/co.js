
// co v3.10
//
// changes:
// move try catch out from next function into its own function.


import {
  isGeneratorFunction, isFunction
} from './type-check'

import toThunk from './thunkify'

/**
 * slice() reference.
 */

var slice = Array.prototype.slice


/**
 * Wrap the given generator `fn` and
 * return a thunk.
 *
 * @param {Function} fn
 * @return {Function}
 * @api public
 */

export default function co (fn) {
  var isGenFun = isGeneratorFunction(fn)

  return function (done) {
    var ctx = this

    // in toThunk() below we invoke co()
    // with a generator, so optimize for
    // this case
    var gen = fn

    // we only need to parse the arguments
    // if gen is a generator function.
    if (isGenFun) {
      var args = slice.call(arguments), len = args.length
      var hasCallback = len && isFunction(args[len - 1])
      done = hasCallback ? args.pop() : error
      gen = fn.apply(this, args)
    }
    else {
      done = done || error
    }

    next()

    // #92
    // wrap the callback in a requestAnimationFrame
    // so that any of its errors aren't caught by `co`
    function exit(err, res) {
      requestAnimationFrame(function(){
        done.call(ctx, err, res)
      })
    }

    function next(err, res) {
      // multiple args
      if (arguments.length > 2) res = slice.call(arguments, 1)

      let ret = tryCatchGen(err, gen, res, exit)

      if (!ret) { return }

      // done
      if (ret.done) return exit(null, ret.value)

      // normalize
      ret.value = toThunk(ret.value, ctx, co)

      // run
      if (isFunction(ret.value)) {
        return tryCatchThunk(ctx, ret, next)
      }

      // invalid
      next(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following was passed: "' + String(ret.value) + '"'))
    }
  }
}


/**
 * Throw `err` in a new stack.
 *
 * This is used when co() is invoked
 * without supplying a callback, which
 * should only be for demonstrational
 * purposes.
 *
 * @param {Error} err
 * @api private
 */

function error(err) {
  if (!err) return
  requestAnimationFrame(function(){
    throw err
  })
}

/**
 * Try and catch if its a generator
 *
 * The purpose is that it help with browser
 * engine optimization
 *
 * @param {Error} err
 * @param {Generator} gen
 * @param {Mixed} res
 * @param {Function} exit
 * @api private
 */

function tryCatchGen (err, gen, res, exit) {
  let ret
  // error
  if (err) {
    try {
      ret = gen.throw(err)
    } catch (e) {
      return exit(e)
    }
  }

  // ok
  if (!err) {
    try {
      ret = gen.next(res)
    } catch (e) {
      return exit(e)
    }
  }

  return ret
}

/**
 * Try and catch if its a generator
 *
 * The purpose is that it help with browser
 * engine optimization
 *
 * @param {Object} ctx
 * @param {Object} ret
 * @param {Function} next
 * @api private
 */

function tryCatchThunk (ctx, ret, next) {
  var called = false



  try {
    ret.value.call(ctx, function () {
      if (called) return
      called = true
      next.apply(ctx, arguments)
    })
  } catch (e) {
    requestAnimationFrame(function () {
      if (called) return
      called = true
      next(e)
    })
  }
}
