import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Grid, GridColumn, Image, Divider, Button } from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import { getCurrentUser } from "../../util/APIUtils";
import { ACCESS_TOKEN } from "../../constants";
import { HomeHeader } from "../../components";
import UploadPhoto from "./UploadPhoto";
import Footer from "./Footer";
import MultiUploadPhotos from "./MultiUploadPhotos";
import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";

class AddContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.handleSearchTag =  this.handleSearchTag.bind(this);
    this.clickSearch =  this.clickSearch.bind(this);
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

  componentDidMount() {
    this.loadCurrentUser();
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
  handleSearchTag(e) {
    this.props.history.push("/?tag=" + e);
  }
  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    } else {
      if (!this.state.currentUser) {
        return <Redirect to="/" />;
      }
    }
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

        <Grid className="pages page-index upload-page">
          <Grid.Row>
            <Grid.Column only="computer" width={16}>
              <div className="page_title">
                <h2>Upload Your Content</h2>
              </div>
            </Grid.Column>
            <Grid.Column only="mobile tablet" width={16}>
              <div className="mobile_page_title">
                <h2>Upload Your Content</h2>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <MultiUploadPhotos />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>{/* <Footer /> */}</Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}

export default AddContent;
