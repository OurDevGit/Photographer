import { createReducer } from 'reduxsauce'
// Import Actions
import { Types } from '../actions/global'

// Initial State
const initialState = {
  status            : {},
  showInvest        : false,
  showPinCodeDialog : false,
  showFundDialog    : false,
  fundAmount        : '',
  showGetFinancing  : false,
  showDiagnostics   : false,
}

/* Handlers */

const updateState = (state, action) => ({
  ...state,
  ...action.payload,
})

const showDiagnosticsModal = (state, action) => ({
  ...state,
  showDiagnostics: action.flag,
})


const showGetFinancingModal = (state, action) => ({
  ...state,
  showGetFinancing: action.flag,
})

const resetState = () => ({
  ...initialState,
})

// map action types to reducer functions
export const handlers = {
  [Types.UPDATE_STATE]             : updateState,
  [Types.RESET_STATE]              : resetState,
  [Types.SHOW_GET_FINANCING_MODAL] : showGetFinancingModal,
  [Types.SHOW_DIAGNOSTICS_MODAL]   : showDiagnosticsModal
}

// Export Reducer
export default createReducer(initialState, handlers)
