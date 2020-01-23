import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions(
  {
    updateState           : ['payload'],
    resetState            : [],
    showInvestModal       : ['flag'],
    setPinCodeDialog      : ['flag'],
    setFundDialog         : ['flag'],
    setFundAmount         : ['fundAmount'],
    showGetFinancingModal : ['flag'],
    showDiagnosticsModal  : ['flag']
  },
  { prefix: 'global_' }
)

export { Types, Creators }
