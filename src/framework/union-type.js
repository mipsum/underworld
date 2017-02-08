// NOTE:
// code witho minor changes from copied from:
// https://github.com/paldepind/union-type/blob/v0.3.3/union-type.js
// eef0da2

import curryN from 'ramda/src/curryN'
import compose from 'ramda/src/compose'

var isString = s => typeof s === 'string'
var isNumber = n => typeof n === 'number'
var isBoolean = b =>  typeof b === 'boolean'
var isFunction = f => typeof f === 'function'
var isArray = Array.isArray || (a => 'length' in a)

var isObject = value => {
  var type = typeof value
  return !!value && (type === 'object' || type === 'function')
}

var mapConstrToFn = (group, constr) =>
   constr === String    ? isString
     : constr === Number    ? isNumber
     : constr === Boolean   ? isBoolean
     : constr === Object    ? isObject
     : constr === Array     ? isArray
     : constr === Function  ? isFunction
     : constr === undefined ? group
    //  : group._ctor
                            : constr;

var numToStr = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function isPrototypeOf (o, v) {
  return o.prototype.isPrototypeOf(v)
    ? true
    : o._ctor
      ? o._ctor.prototype.isPrototypeOf(v) ? true : false
      : false
}

function validate (group, validators, name, args) {
  var validator, v, i;
  if(!__DEV__) {
    return
  }

  if (args.length > validators.length) {
    throw new TypeError('too many arguments supplied to constructor ' + name
      + ' (expected ' + validators.length + ' but got ' + args.length + ')');
  }

  for (i = 0; i < args.length; ++i) {
    v = args[i];
    validator = mapConstrToFn(group, validators[i]);

    if (!validator.prototype.isPrototypeOf(v) && validator._ctor && v._name) {
      // console.log(['nested validation:', group, validators[i], validators, name, v ])

      // nested validation being done here
      validators[i][v._name](...valueToArray(v))
    }

    if ((validator.prototype === undefined || !isPrototypeOf(validator, v)) &&
        (typeof validator !== 'function' || !validator(v))) {
      var strVal = typeof v === 'string' ? "'" + v + "'" : v; // put the value in quotes if it's a string
      throw new TypeError('wrong value ' + strVal + ' passed as ' + numToStr[i] + ' argument to constructor ' + name);
    }
  }
};

function valueToArray(value) {
  var i, arr = [];
  for (i = 0; i < value._keys.length; ++i) {
    arr.push(value[value._keys[i]]);
  }
  return arr;
}

function extractValues(keys, obj) {
  var arr = [], i;
  for (i = 0; i < keys.length; ++i) arr[i] = obj[keys[i]];
  return arr;
}

function constructor(group, name, fields) {
  var validators, keys = Object.keys(fields);
  if (isArray(fields)) {
    validators = fields;
  }
  else {
    validators = extractValues(keys, fields);
  }

  function construct() {
    var val = Object.create(group.prototype), i;
    val._keys = keys;
    val._name = name;
    if (__DEV__) {
      validate(group, validators, name, arguments);
    }
    for (i = 0; i < arguments.length; ++i) {
      val[keys[i]] = arguments[i];
    }
    return val;
  }
  group[name] = curryN(keys.length, construct);
  if (keys !== undefined) {
    group[name+'Of'] = function(obj) {
      return construct.apply(undefined, extractValues(keys, obj));
    };
  }
}

function rawCase(type, cases, value, arg) {
  var wildcard = false;
  var handler = cases[value._name];
  if (handler === undefined) {
    handler = cases['_'];
    wildcard = true;
  }

  if (__DEV__) {

    if (!isPrototypeOf(type, value)) {
      throw new TypeError('wrong type passed to case');
    } else if (handler === undefined) {
      throw new Error('non-exhaustive patterns in a function');
    }
  }

  if (handler !== undefined) {
    var args = wildcard === true ? [arg]
             : arg !== undefined ? valueToArray(value).concat([arg])
             : valueToArray(value);
    return handler.apply(undefined, args);
  }
}

var typeCase = curryN(3, rawCase);
var caseOn = curryN(4, rawCase);

function createIterator() {
  return {
    idx: 0,
    val: this,
    next: function() {
      var keys = this.val._keys;
      return this.idx === keys.length
        ? {done: true}
        : {value: this.val[keys[this.idx++]]};
    }
  };
}

export default function Type(desc) {
  var key, obj = {};

  obj.case = curryN(1, function (...args) {
    let o = typeCase(obj)(...args)

    if (2 === args.length) {
      return o
    }

    o._ctx = obj
    return o
  })

  obj.caseOn = curryN(1, function (...args) {
    let o = caseOn(obj)(...args)

    if (3 === args.length) {
      return o
    }

    o._ctx = obj
    return o
  })


  obj.prototype = {};
  obj.prototype[Symbol ? Symbol.iterator : '@@iterator'] = createIterator;

  obj.prototype.case = function (cases) {
    let o = obj.case(cases, this)
    return o
  };

  obj.prototype.caseOn = function (cases) {
    let o = obj.caseOn(cases, this)
    return o
  };

  // eslint-disable-next-line guard-for-in
  for (key in desc) {
    constructor(obj, key, desc[key]);
  }
  return obj;
}

Type.check = true;

Type.ListOf = function (T) {
  var List = Type({List:[Array]});
  var innerType = Type({T: [T]}).T;
  var validate = List.case({
    List: function (array) {
      var n;

      // the goa here is avoiding try-catch in prod.

      if (!__DEV__) {
        for(n = 0; n < array.length; n++) {
          innerType(array[n]);
        }

        return true
      }

      try {
        for(n = 0; n < array.length; n++) {
          innerType(array[n]);
        }
      } catch (e) {
        throw new TypeError('wrong value '+ array[n] + ' passed to location ' + numToStr[n] + ' in List');
      }
      return true;
    }
  });
  return compose(validate, List.List);
};
