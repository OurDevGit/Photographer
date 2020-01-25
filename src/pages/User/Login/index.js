import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { Button, Form, Grid, Header, Image, Message, Segment, Icon } from 'semantic-ui-react'
import { HomeHeader} from '../../../components'
import Footer from './Footer'
import { login } from '../../../util/APIUtils';
import { ACCESS_TOKEN } from '../../../constants';
import './style.less'
import {notification } from 'antd';
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
                <Button className='social' color='facebook' fluid size='large' href='/'>
                  <Icon name='facebook' /> Facebook Login
                </Button>
                <Button className='social' color='instagram' fluid size='large' href='/'>
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