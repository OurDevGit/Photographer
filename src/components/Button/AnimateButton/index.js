import React from 'react'
import {Icon} from 'semantic-ui-react'
import PropTypes from 'prop-types'

import './style.less'

const colorSchema = {
  offline: {
    secondary : 'rgba(158, 158, 158, 0.6)',
    primary   : '#EEEEEE'
  },
  online: {
    secondary : 'rgba(59, 232, 218, 0.4)',
    primary   : '#FF010102'
  }
}

const AnimateButton = ({ content, link, color, IconName }) => (
    <a className="animateButton_demo1" href={link}>
        {content}
        <Icon name={IconName}/>
    </a>
)

AnimateButton.propTypes = {
  content : PropTypes.string.isRequired,
  link    : PropTypes.string,
  color   : PropTypes.string,
  
}

export default AnimateButton
