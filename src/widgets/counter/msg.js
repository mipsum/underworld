import Type from 'fw/union-type'
import { Maybe } from 'fw/types'


let Maybe01 = Maybe.extends({
  Nothing: [],
  Just: [n => 1 === n],
})


export const Msg =
  Type({
    Increment: [ Maybe01 ],
    Decrement: [ Maybe01 ],
  })
