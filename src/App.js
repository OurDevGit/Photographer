import React from 'react'
import PropTypes from 'prop-types'
import { ConnectedRouter } from 'connected-react-router'
import Core from './pages/Core'

const App = ({ history }) => (
  <ConnectedRouter history={history}>
    <Core />
  </ConnectedRouter>
)

App.propTypes = {
  history: PropTypes.object,
}
process.title = App;
export default App
