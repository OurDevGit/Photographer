import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import { getCurrentUser, getAllCategories } from "../../util/APIUtils";
import { ACCESS_TOKEN } from "../../constants";
import { HomeHeader } from "../../components";
import "./style.less";
import VerticalSidebar from "./VerticalSidebar";
import PhotoContent from "./PhotoContent";
import OrderingPhotoForHome from "./OrderingPhotoForHome";
import CategoriesAndTags from "./CategoriesAndTags";
import Banners from "./Banners";
import Users from "./Users";
import { notification } from "antd";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      visible: "list_submitted_photos",
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
  }

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

  loadAllCategories() {
    getAllCategories()
      .then((response) => {
        this.setState({
          categories: response.categories,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
    // this.loadAllCategories();
  }

  handleLogout(
    redirectTo = "/",
    notificationType = "success",
    description = "You're successfully logged out."
  ) {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      currentUser: null,
      isAuthenticated: false,
    });

    this.props.history.push(redirectTo);

    notification[notificationType]({
      message: "Photoing App",
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: "Photoing App",
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleMenuClick(e) {
    this.setState({
      visible: e,
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
        <Grid className="pages page-index">
          <Grid.Row>
            {/* <Sidebar.Pushable as={Segment}> */}
            <Grid.Column width="3">
              <VerticalSidebar
                animation="overlay"
                direction="left"
                visible={true}
                handleMenuClick={this.handleMenuClick}
              />
            </Grid.Column>
            <Grid.Column width="13">
              <div className="admin_content">
                {this.state.visible == "list_submitted_photos" ||
                this.state.visible == "list_accepted_photos" ||
                this.state.visible == "list_rejected_photos" ? (
                  <PhotoContent
                    visible={
                      this.state.visible == "list_submitted_photos" ||
                      this.state.visible == "list_accepted_photos" ||
                      this.state.visible == "list_rejected_photos"
                    }
                    currentUser={this.state.currentUser}
                    status={this.state.visible}
                  />
                ) : null}
                {this.state.visible == "order_photo_home" ? (
                  <OrderingPhotoForHome
                    visible={this.state.visible == "order_photo_home"}
                  />
                ) : null}
                {this.state.visible == "banners" ? (
                  <Banners
                    visible={this.state.visible == "banners"}
                  />
                ) : null}
                {this.state.visible == "CategoriesAndTags" ? (
                  <CategoriesAndTags
                    visible={this.state.visible == "CategoriesAndTags"}
                  />
                ) : null}
                {this.state.visible == "Users" ? (
                  <Users visible={this.state.visible == "Users"} />
                ) : null}
              </div>
            </Grid.Column>

            {/* </Sidebar.Pushable> */}
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
export default Admin;
