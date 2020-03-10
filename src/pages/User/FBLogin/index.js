import React, { Component } from 'react'
import  { Redirect } from 'react-router-dom'
import { getCurrentUser } from '../../../util/APIUtils';
import { ACCESS_TOKEN } from '../../../constants';
import './style.less'
import {notification} from 'antd';
import LoadingIndicator  from '../../../common/LoadingIndicator';
class FBLogin extends Component{
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
    }
  }
  componentDidMount(){
    if(this.props.location.search){
      var accessToken = this.props.location.search.split('(')[1].split(',')[0].split('=')[1];
      console.log(accessToken)
    }
    if(accessToken)
    {
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      getCurrentUser()
      .then(response => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false
        });
        notification.success({
          message: 'Photoing App',
          description: 'Successfully Logined'
        });
      }).catch(error => {
        this.setState({
          isLoading: false
        });  
        notification.error({
          message: 'Photoing App',
          description: 'Sorry! Something went wrong. Please try again!'
        });
      });
    }else{
      notification.error({
        message: 'Photoing App',
        description: 'Sorry! Something went wrong. Please try again!'
      });
      this.setState({
        isLoading: false
      });
    }
  }


  render(){
    if(this.state.isLoading)
    {
      return(
        <LoadingIndicator />
      )
    }else{
      return(
        <Redirect to='/' />
      )
    }
  }
}

export default FBLogin