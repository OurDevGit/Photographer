import { put, select, takeEvery, all } from 'redux-saga/effects'
import { NotificationManager } from 'react-notifications'
import { Creators } from '../actions/global'
import { origin } from '../utils/action'

function* listenAction(action) {
  try {
    const { status } = yield select(state => state.global)
    if (action.type.endsWith('/request')) {
      const newStatus = {
        ...status,
        [origin(action.type)]: 'request',
      }
      yield put(Creators.updateState({ status: newStatus }))
    } else if (action.type.endsWith('/success')) {
      const newStatus = {
        ...status,
        [origin(action.type)]: 'success',
      }
      yield put(Creators.updateState({ status: newStatus }))
    } else if (action.type.endsWith('/failure')) {
      const newStatus = {
        ...status,
        [origin(action.type)]: 'failure',
      }
      yield put(Creators.updateState({ status: newStatus }))

      const { err, showAlert } = action.payload
      let message
      let statusCode
      if (err.response && err.response.data.err) {
        statusCode = err.response.status
        message = err.response.data.err
      } else if (err.message) {
        message = err.message
      } else {
        message = err
      }
      if (statusCode !== 403 && message && message !== 'no_alert' && showAlert !== false) {
        NotificationManager.error(message.toString(), 'Error')
      }
    }
  } catch (err) {
    // if (app.alertUncaughted) {
    //   if (err) {
    //     NotificationManager.error(
    //       errorMessage(err.errorMessage || err.message),
    //       'Error...'
    //     )
    //   }
    // }
  }
}

export function* globalSaga() {
  yield all([
    takeEvery('*', listenAction),
  ])
}
