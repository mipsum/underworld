import Type from 'union-type'
import { Maybe } from '../../types'


export const Action =
  Type({
    Increment: [ Maybe ],
    Decrement: [ Maybe ],
  })


  // import Inferno from 'inferno';
  // import { scan, map } from 'most';
  //
  // const model$ = scan(update, 0, actions$);
  // const vNodes$ = map(view(actions$), model$);
  // const renderer = Inferno.createRenderer();
  // const runApp = () => scan(renderer, container, vNodes$).drain();
  //
  // runApp();

  // (n) => {
  //   console.log('*****', n)
  //
  //   return n.caseOn({
  //     Nothing: () => Maybe01.Nothing(2),
  //     Just: v => Maybe01.Just(v)
  //   })
  //
  //   // console.log)
  //
  //   console.log('----', n[0], n._name)
  //
  //   switch (n._name) {
  //     case 'Nothing':
  //       return void 0 === n[0]
  //         ? Maybe01.Nothing()
  //         : Maybe01.Nothing(n[0])
  //
  //     case 'Just':
  //       return Maybe01.Just(...[n[0]])
  //
  //   }
  // }
