let log = (msg, o) => {
  if (__DEV__) {
    console.log(msg, o)
  }
  return o
}

global.log = log
