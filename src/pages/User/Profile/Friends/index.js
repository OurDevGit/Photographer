import React, { Component } from 'react';
import { Form, Input, Select, TextArea, Button} from 'semantic-ui-react'
import {UserCard} from '../../../../components'
import {getPublicUsers} from '../../../../util/APIUtils'
import LoadingIndicator  from '../../../../common/LoadingIndicator';
class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            followUsers:[]
        }
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
      this.loadPublicUsers()
    }

    componentDidUpdate(nextProps) {
 
    }

    loadPublicUsers(){
      this.setState({
        isLoading: true
      })
      getPublicUsers(0,10)
      .then(response=>{
        this.setState({
          followUsers:response.content 
        })
        console.log("userslist",response)
      })
      .catch(error=>{
        console.log(error)
      }
      )
    }

    render() {
        return (
          <>
          <a>Followed Users</a>
          {
            this.state.followUsers.length > 0 ? 
              <UserCard users={this.state.followUsers} status="followed"></UserCard>
            : <LoadingIndicator />
          }
          <a>UnFollowedUsers</a>
          {
            this.state.followUsers.length > 0 ? 
              <UserCard users={this.state.followUsers} status="unfollowed"></UserCard>
            : <LoadingIndicator />
          }
            
          </>     
        );
    }
}

export default Friends;