// eslint-disable-next-line
import Inferno from 'inferno'

import Logo from './widgets/logo'
import ClickView from './widgets/counter'

export default ({ model }) =>
  <div className="App">
    <div className="App-header">
      <Logo width="80" height="80"/>
      <h2>Welcome to Inferno</h2>
    </div>
    <p className="App-intro">
      To get started, edit <code>src/App.js</code> and save to reload.
    </p>

    <ClickView model={model.value}/>
  </div>
