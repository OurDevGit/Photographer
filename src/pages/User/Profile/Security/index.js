import React, { Component } from 'react';
import { Form, Input, Select, Icon, Button} from 'semantic-ui-react'
import {notification} from 'antd'
import {update_password} from '../../../../util/APIUtils'
import LoadingIndicator  from '../../../../common/LoadingIndicator';
class Security extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            InputType:{
              old: false,
              new: false,
              confirm:false
            },
            password:[],
            ValidateFlag:[]
        }
        this.showPassword =  this.showPassword.bind(this)
        this.handleChangeInput =  this.handleChangeInput.bind(this)
        this.handleChangePassword =  this.handleChangePassword.bind(this)
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

    handleChangeInput(e, {name, value}){
      
      this.state.password[name] = value;
      if(value == "")
      {
        this.state.ValidateFlag[name] = true;
      }else{
        this.state.ValidateFlag[name] = false;
      }
      this.setState({
        password: this.state.password,
        ValidateFlag: this.state.ValidateFlag
      })
      console.log(this.state.password)
    }

    handleChangePassword(){
      if(!this.state.password['oldPassword'] || this.state.password['oldPassword'] == ""){
        this.state.ValidateFlag['oldPassword'] = true;
      }else if(!this.state.password['newPassword'] || this.state.password['newPassword'] == ""){
        this.state.ValidateFlag['newPassword'] = true;
      }else if(!this.state.password['confirmPassword'] || this.state.password['newPassword'] != this.state.password['confirmPassword']){
        this.state.ValidateFlag['confirmPassword'] = true;
      }else{
        var UpdatePassword = {
          'newPassword':this.state.password['newPassword'],
          'oldPassword':this.state.password['oldPassword']
        }
        this.setState({
          isLoading: true
        })
        update_password(UpdatePassword)
        .then(response=>{
          console.log("response",response)
          this.setState({
            isLoading: false,
            password:[]
          })
          if(response.ok)
          {
            notification.success({
              message: 'Photoing App',
              description: "Successfully changed your password",
            });
          }else{
            notification.error({
              message: 'Photoing App',
              description: "Your old password is not correct. Please put correct your password.",
            });
          }

        })
        .catch(error=>{
          console.log("error",error)
          this.setState({
            isLoading: false
          })
          notification.error({
            message: 'Photoing App',
            description: "Sorry. There are some problems to update. Please try again",
          });
        })
      }
      this.setState({
        ValidateFlag: this.state.ValidateFlag
      })
    }

    componentDidUpdate(nextProps) {
      
    }

    render() {
        if(this.state.isLoading)
        {
          return(
            <LoadingIndicator />
          )
        }
      
        return (
            <Form>
                <Form.Field
                  id='form-input-control-old-password'
                  control={Input}
                  type={this.state.InputType['old'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['old'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="old" />}
                  label='Old Password*'
                  placeholder='Old Password'
                  name="oldPassword"
                  value={this.state.password['oldPassword']}
                  onChange={this.handleChangeInput}
                  error={this.state.ValidateFlag['oldPassword'] ?
                    {
                      content: 'This field is required',
                      pointing: 'below',
                    }
                    : null
                  }
                />
                <Form.Field
                  id='form-input-control-new-password'
                  control={Input}
                  type={this.state.InputType['new'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['new'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="new" />}
                  label='New Password*'
                  placeholder='New Password'
                  name="newPassword"
                  value={this.state.password['newPassword']}
                  onChange={this.handleChangeInput}
                  error={this.state.ValidateFlag['newPassword'] ?
                    {
                      content: 'This field is required',
                      pointing: 'below',
                    }
                    : null
                  }
                />
                <Form.Field
                  id='form-input-control-confirm-password'
                  control={Input}
                  type={this.state.InputType['confirm'] ? "text" : "password"}
                  icon={<Icon name={this.state.InputType['confirm'] ? "eye slash" : "eye"} circular link onClick={this.showPassword} value="confirm" />}
                  label='Confirm*'
                  placeholder='Confirm'
                  name="confirmPassword"
                  value={this.state.password['confirmPassword']}
                  onChange={this.handleChangeInput}
                  error={this.state.ValidateFlag['confirmPassword'] ?
                    {
                      content: 'Password is not matching. Please put again',
                      pointing: 'below',
                    }
                    : null
                  }
                />

                <Form.Field
                  id='form-button-control-public'
                  control={Button}
                  content='Save'
                  onClick={this.handleChangePassword}
                />
              </Form>            
        );
    }
}

export default Security;