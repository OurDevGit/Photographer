import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NotificationContainer } from 'react-notifications'
import Intercom from 'react-intercom'
import ReactGA from 'react-ga'
import 'react-notifications/lib/notifications.css'

import routes from './routes'
import config from '../../config'

ReactGA.initialize(config.gaTrackingId)

class View extends Component {
  constructor(props) {
    super(props)
    this.state = { }
  }

  componentDidMount() {
    const { pathname } = this.props.history.location
    ReactGA.set({ page: pathname })
    ReactGA.pageview(pathname)

    // Set up pathname listener
    this.props.history.listen((location) => {
      ReactGA.set({ page: location.pathname })    // Update the user's current page
      ReactGA.pageview(location.pathname)         // Record a pageview for the given page
    })
  }

  render() {
    return (
      <div>
        <main>
          { routes }
        </main>
        <NotificationContainer />
        <Intercom appID={config.intercomAppId} />
      </div>
    )
  }
}

const mapStateToProps = () => ({})

const mapDispatchToProps = {}

View.propTypes = {
  history: PropTypes.object.isRequired,
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(View))
