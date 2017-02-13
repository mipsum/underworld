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
 * @api private
 */

export function isPromise(obj) {
  return obj && 'function' === typeof obj.then;
}

/**
 * Check if `obj` is a generator.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */

export function isGenerator(obj) {
  return obj && 'function' === typeof obj.next && 'function' === typeof obj.throw;
}

/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
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
 * @api private
 */

export function isObject(val) {
  return val && Object === val.constructor;
}
