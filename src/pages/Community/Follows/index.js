import React, { Component } from "react";
import { UserCard, HomeHeader } from "../../../components";
import { getPublicUsers, getCurrentUser, get_followers, get_suggested_followers } from "../../../util/APIUtils";
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
    };
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadFollowers = this.loadFollowers.bind(this);
    this.loadSuggestedFollowers = this.loadSuggestedFollowers.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
  }

  componentDidMount() {
    this.loadCurrentUser();
    // this.loadPublicUsers();
    this.loadFollowers();
    // this.loadSuggestedFollowers()
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
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadFollowers() {
    this.setState({
      isLoading: true,
    });
    get_followers()
      .then((response) => {
        this.setState({
          followUsers: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  loadSuggestedFollowers() {
    this.setState({
      isLoading: true,
    });
    get_suggested_followers()
      .then((response) => {
        this.setState({
          suggestedfollowUsers: response,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleSearchTag(e) {
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
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
                clickSearch={this.clickSearch}
                handleSearchTag={this.handleSearchTag}
              />
              {/* </Grid.Column>
            <Grid.Column width='16'> */}
              <div className="followersList">
                <a>
                  <h3>Followed Users</h3>
                </a>
                {this.state.followUsers? (
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
                {!this.state.followUsers? (
                  // <UserCard
                  //   users={this.state.followUsers}
                  //   status="unfollowed"
                  // ></UserCard>
                  null
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
