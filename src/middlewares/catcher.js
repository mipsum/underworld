
import { dispatcher$ } from 'fw'


// TODO: test this middleware
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
