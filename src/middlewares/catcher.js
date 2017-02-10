
import { dispatcher$ } from 'fw'


// TODO: test this middleware
let catcher =
  cfg =>
    function * _catcher (model, msg) {

      console.log('7567756576')

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
