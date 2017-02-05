
// eslint-disable-next-line
import Inferno, { linkEvent } from 'inferno'

import flyd from 'flyd'

import { Maybe } from '../../types'
import { Action } from './types'


export { default as View, click$ } from './views'

let stF = flyd.stream()


// stF.map(s =>{
//   console.log('FF', s)
// })
//
// click$.map((s, i) => {
//   console.log('0 ---', s)
//   return 'LLL ' +i
// })
//
// .map(s => {
//   console.log('oooo', s)
//   return 'ooooo'
// })
// .map(stF)
//
// click$.map(s => {
//   console.log('1 ---', s)
//   return '1---'
// })
// .map(stF)
