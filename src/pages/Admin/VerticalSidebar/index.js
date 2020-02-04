import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Button,
  Checkbox,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react'
import './style.less'
export default class VerticalSidebar extends Component{
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            disabled: true,
            isLoading: false,
            activeMentItem: ''
        }
        this.handleMenuClick = this.handleMenuClick.bind(this)
    }

    handleMenuClick(e, {value}){
        this.props.handleMenuClick(value);
        this.setState({
            activeMentItem: value
        })
    }
    render(){
        const {animation, direction, visible} = this.props
        return(
            <Sidebar
                as={Menu}
                animation={animation}
                direction={direction}
                icon='labeled'
                inverted
                vertical
                visible={visible}
                // width='thin'
                className = 'VerticalSidebar'
            >
                <Menu.Item as='a' value='SubmittedContent' className={this.state.activeMentItem == 'SubmittedContent' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='cloud upload' />
                Submitted Content
                </Menu.Item>
                <Menu.Item as='a' value='AcceptedContent' className={this.state.activeMentItem == 'AcceptedContent' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='check' />
                Accepted Content
                </Menu.Item>
                <Menu.Item as='a' value='RejectedContent' className={this.state.activeMentItem == 'RejectedContent' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='exclamation triangle' />
                Rejected Content
                </Menu.Item>
                <Menu.Item as='a' value='Authorizations' className={this.state.activeMentItem == 'Authorizations' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='id card' />
                Authorizations
                </Menu.Item>
                <Menu.Item as='a' value='Users' className={this.state.activeMentItem == 'Users' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='users' />
                Users
                </Menu.Item>
            </Sidebar>
        )
    }
}