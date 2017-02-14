
import dispatcher$ from 'fw/dispatcher'


// TODO: test this middleware
// appears not working

let catcher =
  cfg =>
    function * _catcher (iterRetVal) {

      try {
        while (true) {
          // pre update reducers
          iterRetVal = yield iterRetVal

          // pos update reducers
          iterRetVal = yield iterRetVal
        }
      }
      catch (e) {
        console.error(e)
      }

    }

dispatcher$.middleware(catcher({}))
