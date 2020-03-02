import React, {Component} from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../../util/APIUtils';
import './style.less'
import { 
  NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
  USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
  EMAIL_MAX_LENGTH,
  PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../../constants';
import {notification} from 'antd';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
        name: {
            value: ''
        },
        username: {
            value: ''
        },
        email: {
            value: ''
        },
        password: {
            value: ''
        }
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
    this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
    this.isFormInvalid = this.isFormInvalid.bind(this);
  }

  handleInputChange(event, validationFun) {
      const target = event.target;
      const inputName = target.name;        
      const inputValue = target.value;

      this.setState({
          [inputName] : {
              value: inputValue,
              ...validationFun(inputValue)
          }
      });
  }

  handleSubmit(event) {
      event.preventDefault();
      const signupRequest = {
          name: this.state.name.value,
          email: this.state.email.value,
          username: this.state.username.value,
          password: this.state.password.value
      };

      signup(signupRequest)
      .then(response => {
          notification.success({
              message: 'Photoing App',
              description: "Thank you! You're successfully registered. Please Login to continue!",
          });
          this.props.onSuccess();
      }).catch(error => {
          notification.error({
              message: 'Photoing App',
              description: error.message || 'Sorry! Something went wrong. Please try again!'
          });
      });
  }

  isFormInvalid() {
      return !(this.state.name.validateStatus === 'success' &&
          this.state.username.validateStatus === 'success' &&
          this.state.email.validateStatus === 'success' &&
          this.state.password.validateStatus === 'success'
      );
  }

  render(){
    return(
        <div>
              <Form.Input 
                      autoComplete='off'
                      fluid 
                      icon='user' 
                      iconPosition='left'
                      name='name'
                      placeholder='Full Name'
                      value={this.state.name.value}
                      onChange={(event) => this.handleInputChange(event, this.validateName)}
                      error={this.state.name.errorMsg}
                      />
              <Form.Input 
                      fluid 
                      autoComplete='off'
                      icon='user' 
                      iconPosition='left' 
                      placeholder='Username'
                      name='username'
                      value={this.state.username.value}
                      onBlur={this.validateEmailAvailability}
                      onChange={(event) => this.handleInputChange(event, this.validateUsername)}
                      error={this.state.username.errorMsg}
                      />
              <Form.Input 
                      fluid 
                      icon='mail' 
                      autoComplete='off'
                      iconPosition='left' 
                      placeholder='E-mail address'
                      name='email'
                      value={this.state.email.value}
                      onBlur={this.validateEmailAvailability}
                      onChange={(event) => this.handleInputChange(event, this.validateEmail)}
                      error={this.state.email.errorMsg}
                      />
              <Form.Input
                      fluid
                      autoComplete='off'
                      icon='lock'
                      iconPosition='left'
                      placeholder='A password between 6 to 20 characters'
                      type='password'
                      name='password'
                      value={this.state.password.value}
                      onChange={(event)=> this.handleInputChange(event, this.validatePassword)}
                      error={this.state.password.errorMsg}
              />
              <Button 
                      color='teal' 
                      fluid 
                      size='large' 
                      type='submit'
                      disabled={this.isFormInvalid()}
                      onClick ={this.handleSubmit}
              >
                Sign Up
              </Button>
        </div>
    )
  }
  

  // Validation Functions

  validateName = (name) => {
      if(name.length < NAME_MIN_LENGTH) {
          return {
              validateStatus: 'error',
              errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
          }
      } else if (name.length > NAME_MAX_LENGTH) {
          return {
              validationStatus: 'error',
              errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
          }
      } else {
          return {
              validateStatus: "success",
              errorMsg: null,
            };            
      }
  }

  validateEmail = (email) => {
      if(!email) {
          return {
              validateStatus: 'error',
              errorMsg: 'Email may not be empty'                
          }
      }

      const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
      if(!EMAIL_REGEX.test(email)) {
          return {
              validateStatus: 'error',
              errorMsg: 'Email not valid'
          }
      }

      if(email.length > EMAIL_MAX_LENGTH) {
          return {
              validateStatus: 'error',
              errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
          }
      }

      return {
          validateStatus: null,
          errorMsg: null
      }
  }

  validateUsername = (username) => {
      if(username.length < USERNAME_MIN_LENGTH) {
          return {
              validateStatus: 'error',
              errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
          }
      } else if (username.length > USERNAME_MAX_LENGTH) {
          return {
              validationStatus: 'error',
              errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
          }
      } else {
          return {
              validateStatus: 'success',
              errorMsg: null
          }
      }
  }

  validateUsernameAvailability() {
      // First check for client side errors in username
      const usernameValue = this.state.username.value;
      if (usernameValue.length>15){
          this.setState({
              username: {
                  value: usernameValue,
                  validateStatus: 'error',
                  errorMsg: 'Username should be max 15 characters'
              }
          });
          return;
      }
      const usernameValidation = this.validateUsername(usernameValue);

      if(usernameValidation.validateStatus === 'error') {
          this.setState({
              username: {
                  value: usernameValue,
                  ...usernameValidation
              }
          });
          return;
      }

      this.setState({
          username: {
              value: usernameValue,
              validateStatus: 'validating',
              errorMsg: null
          }
      });

      checkUsernameAvailability(usernameValue)
      .then(response => {
          if(response.available) {
              this.setState({
                  username: {
                      value: usernameValue,
                      validateStatus: 'success',
                      errorMsg: null
                  }
              });
          } else {
              this.setState({
                  username: {
                      value: usernameValue,
                      validateStatus: 'error',
                      errorMsg: 'This username is already taken'
                  }
              });
          }
      }).catch(error => {
          // Marking validateStatus as success, Form will be recchecked at server
          this.setState({
              username: {
                  value: usernameValue,
                  validateStatus: 'success',
                  errorMsg: null
              }
          });
      });
  }

  validateEmailAvailability() {
      // First check for client side errors in email
      const emailValue = this.state.email.value;
      const emailValidation = this.validateEmail(emailValue);

      if(emailValidation.validateStatus === 'error') {
          this.setState({
              email: {
                  value: emailValue,
                  ...emailValidation
              }
          });    
          return;
      }

      this.setState({
          email: {
              value: emailValue,
              validateStatus: 'validating',
              errorMsg: null
          }
      });

      checkEmailAvailability(emailValue)
      .then(response => {
          if(response.available) {
              this.setState({
                  email: {
                      value: emailValue,
                      validateStatus: 'success',
                      errorMsg: null
                  }
              });
          } else {
              this.setState({
                  email: {
                      value: emailValue,
                      validateStatus: 'error',
                      errorMsg: 'This Email is already registered'
                  }
              });
          }
      }).catch(error => {
          // Marking validateStatus as success, Form will be recchecked at server
          this.setState({
              email: {
                  value: emailValue,
                  validateStatus: 'success1111',
                  errorMsg: null
              }
          });
      });
  }

  validatePassword = (password) => {
      if(password.length < PASSWORD_MIN_LENGTH) {
          return {
              validateStatus: 'error',
              errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
          }
      } else if (password.length > PASSWORD_MAX_LENGTH) {
          return {
              validationStatus: 'error',
              errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
          }
      } else {
          return {
              validateStatus: 'success',
              errorMsg: null,
          };            
      }
  }
}

export default SignUp