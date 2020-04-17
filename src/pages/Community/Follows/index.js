import React, { Component } from "react";
import { UserCard, HomeHeader } from "../../../components";
import { getPublicUsers, getCurrentUser } from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { Grid } from "semantic-ui-react";
import "./style.less";
class Follows extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      user: null,
      isLoading: true,
      followUsers: [],
    };
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadPublicUsers();
  }

  componentDidUpdate(nextProps) {}

  loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadPublicUsers() {
    this.setState({
      isLoading: true,
    });
    getPublicUsers(0, 10)
      .then((response) => {
        this.setState({
          followUsers: response.content,
        });
        console.log("userslist", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <>
        <Grid>
          <Grid.Row>
            <Grid.Column width="16">
              <HomeHeader
                isAuthenticated={this.state.isAuthenticated}
                currentUser={this.state.currentUser}
                onLogout={this.handleLogout}
              />
              {/* </Grid.Column>
            <Grid.Column width='16'> */}
              <div className="followersList">
                <a>
                  <h3>Followed Users</h3>
                </a>
                {this.state.followUsers.length > 0 ? (
                  <UserCard
                    users={this.state.followUsers}
                    status="followed"
                  ></UserCard>
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
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default Follows;
