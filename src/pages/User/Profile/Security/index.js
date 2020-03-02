import React, { Component } from 'react';
import { Form, Input, Select, Icon, Button} from 'semantic-ui-react'

class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            InputType:{
              old: false,
              new: false,
              confirm:false
            }
        }
        this.showPassword =  this.showPassword.bind(this)
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
    }

    showPassword(e, {value}){
      this.state.InputType[value] = !this.state.InputType[value]
      this.setState({
        InputType: this.state.InputType
      })
    }

    componentDidUpdate(nextProps) {
 
    }

    render() {
        return (
            <Form>
                <Form.Field
                  id='form-input-control-old-password'
                  control={Input}
                  type={this.state.InputType['old'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['old'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="old" />}
                  label='Old Password'
                  placeholder='Old Password'
                  name="old"
                />
                <Form.Field
                  id='form-input-control-new-password'
                  control={Input}
                  type={this.state.InputType['new'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['new'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="new" />}
                  label='New Password'
                  placeholder='New Password'
                  name="new"
                />
                <Form.Field
                  id='form-input-control-confirm-password'
                  control={Input}
                  type={this.state.InputType['confirm'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['confirm'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="confirm" />}
                  label='Confirm'
                  placeholder='Confirm'
                  name="confirm"
                />

                <Form.Field
                  id='form-button-control-public'
                  control={Button}
                  content='Save'
                />
              </Form>            
        );
    }
}

export default Security;