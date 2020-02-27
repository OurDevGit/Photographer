import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon, Input } from 'semantic-ui-react'
import { login, FBLogin } from '../../../util/APIUtils';
import { ACCESS_TOKEN } from '../../../constants';
import './style.less'
import {notification } from 'antd';
import FacebookLoginWithButton from 'react-facebook-login'
import InstagramLogin from 'react-instagram-login'

class Login extends Component{
  constructor(props) {
    super(props);
    this.state = {
      usernameOrEmail: {
          value: ''
      },
      password: {
          value: ''
      },
      falg: false
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFBLogin = this.handleFBLogin.bind(this);
  }
  handleInputChange(event){
    const target = event.target;
    const inputName = target.name;        
    const inputValue = target.value;

    this.setState({
        [inputName] : {
            value: inputValue,
        }
    });
  }

  handleSubmit(event) {
    event.preventDefault();   

    const loginRequest = {
        usernameOrEmail: this.state.usernameOrEmail.value,
        password: this.state.password.value
    };

    login(loginRequest)
    .then(response => {
        localStorage.setItem(ACCESS_TOKEN, response.accessToken);
        this.setState({flag: true});
    }).catch(error => {
        if(error.status === 401) {
            notification.error({
                message: 'Photoing App',
                description: 'Your Username or Password is incorrect. Please try again!'
            });                    
        } else {
            notification.error({
                message: 'Photoing App',
                description: error.message || 'Sorry! Something went wrong. Please try again!'
            });                                            
        }
    });
  }

  handleFBLogin(){
    console.log("dd")
    FBLogin()
    .then(response =>{
      console.log(response)
      if(response.ok)
      {
        response.text().then(result => {
          console.log(result.slice(9))
          window.location.assign(result.slice(9));
      })
      }
    })
    .catch(error=>{
      console.log(error)
    })
  }


  responseFacebook = (response) => {
    console.log(response);
  }
  
  componentClicked = () => {
    console.log( "Clicked!" )
  }

  responseInstagram = (response) => {
    console.log(response);
  }


  render(){
    if(this.state.flag){
      return(
        <Redirect to='/' />
      )
    }else{
      return(
        <div>
                <Input 
                        fluid 
                        icon='user' 
                        iconPosition='left' 
                        placeholder='Username or Email address' 
                        name='usernameOrEmail'
                        value={this.state.usernameOrEmail.value}
                        onChange={this.handleInputChange}
                        />
                <Input
                        fluid
                        icon='lock'
                        iconPosition='left'
                        placeholder='Password'
                        type='password'
                        name='password'
                        value={this.state.password.value}
                        onChange={this.handleInputChange}
                />
                <Button 
                        color='teal' 
                        fluid 
                        size='large' 
                        type='submit'
                        onClick={this.handleSubmit}
                >
                  Login
                </Button>
        </div>
      )
    }
    
  }
}

export default Login