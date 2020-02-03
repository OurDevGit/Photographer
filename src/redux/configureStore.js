/* eslint no-underscore-dangle: "off" */

import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'
import config from '../config'

export const history = createBrowserHistory()
const sagaMiddleware = createSagaMiddleware()

export default function configureStore(preloadedState) {
  const composeEnhancer = config.REACT_APP_STAGE === 'dev'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware
      )
    )
  )
  // Extensions
  store.runSaga = sagaMiddleware.run

  // Hot reloading
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      store.replaceReducer(createRootReducer(history))
    })
  }

  return store
}
