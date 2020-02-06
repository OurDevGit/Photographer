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
            activeMentItem: 'list_submitted_photos'
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
                <Menu.Item as='a' value='list_submitted_photos' className={this.state.activeMentItem == 'list_submitted_photos' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='cloud upload' />
                Submitted Content
                </Menu.Item>
                <Menu.Item as='a' value='list_accepted_photos' className={this.state.activeMentItem == 'list_accepted_photos' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='check' />
                Accepted Content
                </Menu.Item>
                <Menu.Item as='a' value='list_rejected_photos' className={this.state.activeMentItem == 'list_rejected_photos' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='exclamation triangle' />
                Rejected Content
                </Menu.Item>
                <Menu.Item as='a' value='Authorizations' className={this.state.activeMentItem == 'Authorizations' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='id card' />
                Authorizations
                </Menu.Item>
                <Menu.Item as='a' value='CategoriesAndTags' className={this.state.activeMentItem == 'CategoriesAndTags' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='grid layout' />
                Categories and Tags
                </Menu.Item>
                <Menu.Item as='a' value='Users' className={this.state.activeMentItem == 'Users' ? 'active' : ''} onClick={this.handleMenuClick}>
                <Icon name='users' />
                Users
                </Menu.Item>
            </Sidebar>
        )
    }
}