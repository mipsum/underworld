import dispatcher$ from 'fw/dispatcher'

// TODO: test this middleware
let logger =
  cfg =>
    function * _logger (model, msg) {

      while (true) {
        loggerPrint('in', model, msg)

        ;[model, msg] = yield [model, msg]

        loggerPrint('out', model, msg)

        ;[model, msg] = yield [model, msg]
      }

    }

dispatcher$.middleware(logger({ verbose: true }))


function loggerPrint (str, model, msg) {
  if (__DEV__) {
    console.log('\n')
    console.log([currentDate()])
    console.log([str, msg._name, msg], model)
    console.log('\n')
    return
  }

  // some fance loggin in prod goes here

}




// http://www.w3schools.com/jsref/jsref_getmilliseconds.asp
function addZero(x, n) {
  while (x.toString().length < n) {
      x = "0" + x;
  }
  return x;
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
