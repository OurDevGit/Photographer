import React, { Component } from "react";
import { UserCard } from "../../../../components";
import { getPublicUsers } from "../../../../util/APIUtils";
import LoadingIndicator from "../../../../common/LoadingIndicator";
class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      followUsers: []
    };
  }

  componentDidMount() {
    this.setState({
      user: this.props.user
    });
    this.loadPublicUsers();
  }

  componentDidUpdate(nextProps) {}

  loadPublicUsers() {
    this.setState({
      isLoading: true
    });
    getPublicUsers(0, 10)
      .then(response => {
        this.setState({
          followUsers: response.content
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <>
        <a>
          <h3>Followed Users</h3>
        </a>
        {this.state.followUsers.length > 0 ? (
          <UserCard users={this.state.followUsers} status="followed"></UserCard>
        ) : (
          <LoadingIndicator />
        )}
        <a>
          <h3>Suggest Users</h3>
        </a>
        {this.state.followUsers.length > 0 ? (
          <UserCard
            users={this.state.followUsers}
            status="unfollowed"
          ></UserCard>
        ) : (
          <LoadingIndicator />
        )}
      </>
    );
  }
}

export default Friends;
