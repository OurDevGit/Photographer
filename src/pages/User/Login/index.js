import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import { HomeHeader} from '../../../components'
import Footer from './Footer'
import { login } from '../../../util/APIUtils';
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
        console.log("access", response.accessToken)
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
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          {/* <HomeHeader /> */}
          <Grid.Column width="16" style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
            Log-in to your account
            </Header>
            <Form size='large' onSubmit={this.handleSubmit} className='login_form'>
              <Segment stacked>
                <Form.Input 
                        fluid 
                        icon='user' 
                        iconPosition='left' 
                        placeholder='Username or Email address' 
                        name='usernameOrEmail'
                        value={this.state.usernameOrEmail.value}
                        onChange={this.handleInputChange}
                        />
                <Form.Input
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
                >
                  Login
                </Button>
                <FacebookLoginWithButton
                  appId="222223435486606"
                  fields="name,email,picture"
                  onClick={this.componentClicked}
                  callback={this.responseFacebook}
                  icon="fa-facebook"/>
                  <div  className='InstagramButton'>
                    <InstagramLogin
                      clientId="edd15be96d05fac4fcb16b5a72084241"
                      buttonText="Login"
                      onSuccess={this.responseInstagram}
                      onFailure={this.responseInstagram}
                    />
                  </div>
                <Button className='social face' color='facebook' fluid size='large'>
                  <Icon name='facebook' /> Facebook Login
                </Button>

                <Button className='social insta' color='instagram' fluid size='large'>
                  <Icon name='instagram' /> Instagram Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <a href='/user/signUp'>Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      )
    }
    
  }
}

export default Login