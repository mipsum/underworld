let log = (msg, o) => {
  if (__DEV__) {
    console.log(msg, o)
  }
  return o
}

global.log = log


if (!global.requestAnimationFrame) {
  if (process.nextTick) {
    global.requestAnimationFrame = process.nextTick
  }
  else {
    global.requestAnimationFrame =
      f => setTimeout(f, 0)
  }
}
