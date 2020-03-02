import React, { Component } from 'react';
import { Form, Input, Select, TextArea, Button} from 'semantic-ui-react'
import {UserCard} from '../../../../components'
class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
        }
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
    }

    componentDidUpdate(nextProps) {
 
    }

    render() {
        return (
            <UserCard></UserCard>        
        );
    }
}

export default Friends;