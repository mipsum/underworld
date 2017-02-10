
import { dispatcher$ } from 'fw'


// TODO: test this middleware
let catcher =
  cfg =>
    function * _catcher (model, msg) {

      try {
        while (true) {
          // pre update reducers
          ;[model, msg] = yield [model, msg]

          // pos update reducers
          ;[model, msg] = yield [model, msg]
        }
      }
      catch (e) {
        console.error(e)
      }

    }

dispatcher$.middleware(catcher({}))
