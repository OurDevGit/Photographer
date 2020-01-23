/**
 * Root Reducer
 */
import { combineReducers } from 'redux'

// Import Reducers
import { connectRouter } from 'connected-react-router'

import global from './global'

export default history => combineReducers({
  router: connectRouter(history),
  global,
})
