
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import stream from 'fw/stream'

import { Maybe } from 'fw/types'
import { Action } from './types'

import { dispatcher$ } from 'fw'



export let click$ =
  stream(Action.Increment(Maybe.Nothing()))

click$.map(dispatcher$)


let counter = 0
let counter2 = 0
function loop (ms) {

  setTimeout(() => {
    if (counter2 > 6) {
      console.log(currentDate())
      return
    }

    click$(Action.Increment(Maybe.Just(1)))
    counter++
    if (counter > 100) {
      counter2++
      counter = 0
      loop(20)
      return
    }

    loop(20)
  }, ms)
}



let start = () => {
  setTimeout(() => {
    console.log('waiting 2s')
    console.log(currentDate())
    loop(2000)
  }, 2000)
}

global.start = start

if (!__DEV__) {
  start()
}


let handleClick =
  (msg, evt) => {
    click$(msg(Maybe.Just(1)))
  }


function currentDate() {
    var D = new Date();
    var year = D.getFullYear()
    var month = addZero(D.getMonth() + 1, 2)
    var day = addZero(D.getDate(), 2)
    var hour = addZero(D.getHours(), 2);
    var min = addZero(D.getMinutes(), 2);
    var sec = addZero(D.getSeconds(), 2);
    var ms = addZero(D.getMilliseconds(), 3);

    return year +'/'+ month + '/' + day + ' ' + hour + ":" + min + ":" + sec + ":" + ms;
}

function addZero(x, n) {
  while (x.toString().length < n) {
      x = "0" + x;
  }
  return x;
}


export default
  ({ model }) =>
    <div>
      <div onClick={ linkEvent(Action.Increment, handleClick) } >
        { `click here +` }
      </div>
      <div onClick={ linkEvent(Action.Decrement, handleClick) } >
        { `click here -` }
      </div>
      <div>
        {model}
      </div>
    </div>
