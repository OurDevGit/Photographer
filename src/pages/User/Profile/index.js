import React, { Component } from "react";
import MetaTags from "react-meta-tags";
import { Grid, Icon, Button, Image, Tab } from "semantic-ui-react";
import { API_BASE_URL, ACCESS_TOKEN } from "../../../constants";
import {
  update_user,
  getCurrentUser,
  getUserDetail,
} from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import "./style.less";
import NotFound from "../../../common/NotFound";
import ServerError from "../../../common/ServerError";
import { HomeHeader } from "../../../components";
import { AvatarDefault } from "../../../assets/images/homepage";
import PersonalInfo from "./PersonalInfo";
import Security from "./Security";
import Collections from "./Collections";
import Baskets from "./Baskets";
import ProductPlacement from "./ProductPlacement";
import { notification } from "antd";
import ChatSocketServer from '../../../util/chatSocketServer'
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      currentUser: null,
      isAuthenticated: false,
      isAvatarLoading: false,
      user_avatar_url: AvatarDefault,
      uploadLabel: "Upload your photo",
      isUpdateLoading: false,
    };
    this.loadUserProfile = this.loadUserProfile.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.uploadAvatar = this.uploadAvatar.bind(this);
    this.update_userData = this.update_userData.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.sendAndUpdateMessages = this.sendAndUpdateMessages.bind(this)
  }

  loadCurrentUser(userId) {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        console.log("RES~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", response);
        this.loadUserProfile(userId);
        this.setState({
          currentUser: response,
          isAuthenticated: true,
          // isLoading: false
        });
        ChatSocketServer.establishSocketConnection(response.id);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadUserProfile(userId) {
    this.setState({
      // isLoading: true
    });

    getUserDetail(userId)
      .then((response) => {
        console.log("userdeta", response);
        this.setState({
          user: response,
          isLoading: false,
        });
      })
      .catch((error) => {
        if (error.status === 404) {
          this.setState({
            notFound: true,
            isLoading: false,
          });
        } else {
          console.log(error);
          this.setState({
            serverError: true,
            isLoading: false,
          });
        }
      });
  }

  uploadAvatar(e) {
    this.setState({
      isAvatarLoading: true,
    });
    var url = URL.createObjectURL(e.target.files[0]);
    var myHeaders = new Headers({});
    if (localStorage.getItem(ACCESS_TOKEN)) {
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem(ACCESS_TOKEN)
      );
    }
    const formData = new FormData();
    formData.append("files", e.target.files[0]);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    fetch(API_BASE_URL + "/public/users/submitMultiplePhoto", requestOptions)
      .then((response) => {
        if (response.ok) {
          this.state.user.avatar = url;
          this.setState({
            user: this.state.user,
            isAvatarLoading: false,
            uploadLabel: "Change your photo",
          });
          this.setState({
            isAvatarLoading: false,
          });
          console.log("uploadAvatar", response);
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isAvatarLoading: false,
        });
      });
  }

  update_userData(e) {
    console.log("update", e);
    this.setState({
      isUpdateLoading: true,
    });
    update_user(e)
      .then((response) => {
        if (response.ok) {
          this.setState({
            user: e,
          });
          notification.success({
            message: "Photoing App",
            description: "Successfully Updated your Information",
          });
        } else {
          notification.error({
            message: "Photoing App",
            description:
              "Sorry. There are some problems to update. Please try again",
          });
        }
        this.setState({
          isUpdateLoading: false,
        });
        console.log(response);
      })
      .catch((error) => {
        this.setState({
          isUpdateLoading: false,
        });
        notification.error({
          message: "Photoing App",
          description:
            "Sorry. There are some problems to update. Please try again",
        });
        console.log(error);
      });
  }

  componentDidMount() {
    const userId = this.props.match.params.id;
    // this.loadUserProfile(userId);
    this.loadCurrentUser(userId);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      console.log("ddd", this.props.match.params.id);
      this.setState({
        user: null,
      });
      this.loadCurrentUser(this.props.match.params.id);
    }
  }

  handleImageClick(e) {
    console.log(e);
    this.props.history.push("/Photo_details/" + e.id);
  }

  handleSearchTag(e) {
    console.log(e);
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  sendMessage(){
    const message = "Hi";
    console.log("current", this.state.currentUser)
    console.log("user", this.state.user)
    // const { userId, newSelectedUser } = this.props;
    if (message === '' || message === undefined || message === null) {
      alert(`Message can't be empty.`);
    } else {
      this.sendAndUpdateMessages({
        fromUserId: this.state.currentUser.id,
        message: (message).trim(),
        toUserId: this.state.user.id,
        date: new Date()
      });
    }
  }

  sendAndUpdateMessages(message) {
    try {
      ChatSocketServer.sendMessage(message);
    } catch (error) {
      alert(`Can't send your message`);
    }
  }

  render() {
    console.log(this.state.currentUser);

    const panes_me = [
      {
        menuItem: "Personal Info",
        render: () => (
          <Tab.Pane>
            <PersonalInfo
              user={this.state.user}
              isUpdateLoading={this.state.isUpdateLoading}
              update_userData={this.update_userData}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Security",
        render: () => (
          <Tab.Pane>
            <Security user={this.state.user} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Collections",
        render: () => (
          <Tab.Pane>
            <Collections user={this.state.user} type="currentUser" />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Baskets",
        render: () => (
          <Tab.Pane>
            <Baskets
              user={this.state.user}
              handleImageClick={this.handleImageClick}
            />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Product Placement",
        render: () => (
          <Tab.Pane>
            <ProductPlacement
              user={this.state.user}
              isUpdateLoading={this.state.isUpdateLoading}
              update_userData={this.update_userData}
            />
          </Tab.Pane>
        ),
      },
    ];
    const panes_user = [
      {
        menuItem: "Collections",
        render: () => (
          <Tab.Pane>
            <Collections user={this.state.user} />
          </Tab.Pane>
        ),
      },
    ];
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }

    if (this.state.notFound) {
      return <NotFound />;
    }

    if (this.state.serverError) {
      return <ServerError />;
    }

    if (!this.state.isLoading && !this.state.currentUser) {
      // return <Redirect to='/user/LoginAndSignUp' />
    }

    return (
      <div className="profile">
        {this.state.user ? (
          <>
            <MetaTags>
              <title>Openshoot</title>
            </MetaTags>
            <HomeHeader
              isAuthenticated={this.state.isAuthenticated}
              currentUser={this.state.currentUser}
              onLogout={this.handleLogout}
              clickSearch={this.clickSearch}
              handleSearchTag={this.handleSearchTag}
            />
            <Grid className="pages page-index profile_page">
              {this.state.currentUser &&
              this.state.user.id === this.state.currentUser.id ? (
                <>
                  <Grid.Row only="computer">
                    <Grid.Column width={4}>
                      <div className="avatar">
                        {this.state.isAvatarLoading ? (
                          <LoadingIndicator />
                        ) : (
                          <div className="avatarUpload">
                            <input
                              type="file"
                              accept="image/*"
                              className="imageUpload input"
                              name="file"
                              onChange={this.uploadAvatar}
                            />
                            <Button className="imageUpload button">
                              {this.state.uploadLabel}
                            </Button>
                          </div>
                        )}
                        <Image
                          src={
                            this.state.user.avatar
                              ? this.state.user.avatar
                              : AvatarDefault
                          }
                          className={
                            this.state.isAvatarLoading ? "avatar_image" : ""
                          }
                          circular
                        />
                      </div>
                    </Grid.Column>
                    <Grid.Column width={12}>
                      <Tab panes={panes_me} />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row only="mobile tablet">
                    <Grid.Column width={16}>
                      <div className="avatar">
                        {this.state.isAvatarLoading ? (
                          <LoadingIndicator />
                        ) : (
                          <div className="avatarUpload">
                            <input
                              type="file"
                              accept="image/*"
                              className="imageUpload input"
                              name="file"
                              onChange={this.uploadAvatar}
                            />
                            <Button className="imageUpload button">
                              {this.state.uploadLabel}
                            </Button>
                          </div>
                        )}
                        <Image
                          src={
                            this.state.user.avatar
                              ? this.state.user.avatar
                              : AvatarDefault
                          }
                          className={
                            this.state.isAvatarLoading ? "avatar_image" : ""
                          }
                          circular
                        />
                      </div>
                    </Grid.Column>
                    <Grid.Column width={16}>
                      <Tab panes={panes_me} />
                    </Grid.Column>
                  </Grid.Row>
                </>
              ) : (
                <Grid.Row>
                  <Grid.Column width={5}>
                    <div className="userName">
                      <h2>
                        {this.state.user.name + " "}{" "}
                        {this.state.user.surname ? this.state.user.surname : ""}
                      </h2>
                      <h3>
                        {this.state.user.description
                          ? this.state.user.description
                          : ""}
                      </h3>
                      <Button icon labelPosition="left" color="black">
                        <Icon name="user plus" />
                        Follow
                      </Button>
                      <Button icon labelPosition="left" color="black" onClick={this.sendMessage}>
                        <Icon name="chat" />
                        Send
                      </Button>
                    </div>
                  </Grid.Column>
                  <Grid.Column width={6}>
                    <div className="avatar">
                      <Image
                        src={
                          this.state.user.avatar
                            ? this.state.user.avatar
                            : AvatarDefault
                        }
                        className={
                          this.state.isAvatarLoading ? "avatar_image" : ""
                        }
                        circular
                      />
                    </div>
                  </Grid.Column>
                  <Grid.Column width={5}>
                    <div className="userDetails">
                      <h3>
                        <a>
                          <Icon name="user" />
                          30 followers
                        </a>
                      </h3>
                      <h3>
                        <a>
                          <Icon name="picture" />
                          20 Assets{" "}
                        </a>
                      </h3>
                      <span className="social">
                        <Icon name="facebook official" link />
                      </span>
                      <span className="social">
                        <Icon name="instagram" link />
                      </span>
                    </div>
                  </Grid.Column>
                  <Grid.Column width="16">
                    <Tab panes={panes_user} className="user_photos_tab" />
                  </Grid.Column>
                </Grid.Row>
              )}
            </Grid>
          </>
        ) : null}
      </div>
    );
  }
}

export default Profile;
