import { AppContainer } from 'react-hot-loader'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import 'semantic-ui-less/semantic.less'

import App from './App'
import configureStore, { history, getStoreConfiguration } from './redux/configureStore'
import sagas from './redux/sagas'
import './main.scss'
import './old-styles/PasswordDialog.styles.scss'
import './old-styles/Header.header.less'

// Initialize store
const store = configureStore()
sagas.forEach(saga => store.runSaga(saga))

const render = () => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider store={store}>
        <App history={history} />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render()

// Hot reloading
if (module.hot) {
  // Reload components
  module.hot.accept('./App', () => {
    render()
  })
}
