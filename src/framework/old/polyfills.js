
// Rejection tracking prevents a common issue where React gets into an
// inconsistent state due to an error, but it gets swallowed by a Promise,
// and the user has no idea what causes React's erratic future behavior.
import rejectionTracking from 'promise/lib/rejection-tracking'
import Promise from 'promise/lib/es6-extensions'

if (typeof Promise === 'undefined') {
  rejectionTracking.enable()
  global.Promise = Promise
}

// fetch() polyfill for making API calls.
import 'whatwg-fetch'

import objectAssign from 'object-assign'

if (!Object.assign) {
  Object.assign = objectAssign
}


// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = require('object-assign');
