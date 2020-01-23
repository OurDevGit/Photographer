import React from 'react'
import PropTypes from 'prop-types'
import { Loader } from 'semantic-ui-react'
import './styles.less'

const style = {
  margin   : '0px',
  position : 'absolute',
  top      : 'calc(50% - 24px)',
  left     : 'calc(50% - 24px)'
}

const View = ({ text }) => (
  <div className="loading-overlay-div">
    {!text && (
      <div className="loading-center-wrapper">
        <Loader active inline="centered" size="large" style={style} />
      </div>
    )}
    {text && (
      <div className="loading-center-with-text">
        <Loader active inline="centered" size="large" style={style} />
        <span className="text">{text}</span>
      </div>
    )}
  </div>
)

View.propTypes = {
  text: PropTypes.string
}

export default View
