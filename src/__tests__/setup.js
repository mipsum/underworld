import '../setup'

import { jsdom } from 'jsdom'

it('', () => {}); // stop jest complain

const doc = jsdom(`
  <!doctype html>
  <html>
    <body>
      <div id="app"></div>
    </body>
  </html>
`)

const win = doc.defaultView

global.document = doc
global.window = win


global.navigator = global.window.navigator

Object.keys(window).forEach(key => {
  if (!(key in global)) {
    global[key] = window[key]
  }
})

global.navigator = {
  userAgent: 'node.js'
}
