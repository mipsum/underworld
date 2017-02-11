/**
 * Check if `obj` is a function.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

export function isFunction (obj) {
  return 'function' ===  typeof obj
}

/**
 * Check if `obj` is a promise.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api public
 */

export function isPromise(obj) {
  return obj && isFunction(obj.then)
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api public
 */

export function isGenerator(obj) {
  return obj && isFunction(obj.next) && isFunction(obj.throw)
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api public
 */

let GeneratorFunction = (function*(){}).constructor
export function isGeneratorFunction(obj) {
  return obj && obj.constructor && obj instanceof GeneratorFunction
}

/**
 * Check for plain object.
 *
 * @param {Mixed} val
 * @return {Boolean}
 * @api public
 */

export function isObject(val) {
  return val && Object === val.constructor
}
