import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Grid, GridColumn, Image, Divider } from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import Gallery from "react-photo-gallery";
import {
  getCurrentUser,
  getAllCategories,
  getPhotoLists,
} from "../../../util/APIUtils";
import { ACCESS_TOKEN, PHOTO_LIST_SIZE } from "../../../constants";
import {
  HomeHeader,
  SearchBar,
  PhotoList,
  Pagination_Component,
} from "../../../components";
// import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../../common/LoadingIndicator";
class DownloadedPhotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
      categories: [],
      ImageShow: false,
      selImage: {},
      totalPages: 0,
      activePage: 1,
      BucketShow: false,
      searchOptions: [],
      isCtrlKey: false,
      tagSearch: null,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.CloseImageModal = this.CloseImageModal.bind(this);
    this.CloseBucketModal = this.CloseBucketModal.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.quickView = this.quickView.bind(this);
    this.viewOwner = this.viewOwner.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.handleSearchTag =  this.handleSearchTag.bind(this)
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

  getTotalpages() {
    getPhotoLists(0, PHOTO_LIST_SIZE)
      .then((response) => {
        this.setState({
          totalPages: response.totalPages,
          photos: response.content,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
    // this.loadAllCategories();
    this.getTotalpages();
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  keydown = (e) => {
    if (e.keyCode == 17) {
      this.setState({
        isCtrlKey: true,
      });
    }
  };

  keyup = (e) => {
    if (e.keyCode == 17) {
      this.setState({
        isCtrlKey: false,
      });
    }
  };

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

  handleImageClick(e) {
    if (!this.state.currentUser) {
      notification.warning({
        message: "Openshoots",
        description: "Please login with your account.",
      });
    }
    this.setState({
      selImage: e,
    });
    if (this.state.isCtrlKey) {
      window.open("/Photo_details/" + e.id, "_blank");
    } else {
      this.props.history.push("/Photo_details/" + e.id);
    }
  }

  CloseImageModal(flag) {
    this.setState({
      ImageShow: flag,
    });
  }

  viewOwner(ownerId) {
    this.props.history.push("/user/profile/" + ownerId);
  }

  quickView(e) {
    this.setState({
      ImageShow: true,
      selImage: e,
    });
  }
  CloseBucketModal(flag) {
    this.setState({
      BucketShow: flag,
    });
  }

  addToBucket(e, flag) {
    this.setState({
      selImage: e,
      BucketShow: true,
    });
  }

  onChangePage(activePage) {
    this.setState({
      activePage: activePage,
    });
  }

  clickSearch(e) {
    console.log("sfasdfsadfsafsafasf", e);
    this.setState({
      searchOptions: e,
    });
  }

  handleSearchTag(e) {
    console.log(e);
    this.props.history.push("/?tag=" + e);
  }

  render() {
    if (this.props.location.search.split("=")[0] === "?tag") {
      var tagSearch = this.props.location.search.split("=")[1];
    }
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (!this.state.isLoading && !this.state.currentUser) {
      return <Redirect to="/" />;
    }
    console.log(this.state.currentUser);
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
        <Grid className="pages page-index homeContent">
          <Grid.Row>
            <Grid.Column width={16}>
              <PhotoList
                type="downloaded_photolist"
                onClickImage={this.handleImageClick}
                addToBucket={this.addToBucket}
                activePage={this.state.activePage}
                totalPages={this.state.totalPages}
                quickView={this.quickView}
                viewOwner={this.viewOwner}
                searchOptions={this.state.searchOptions}
                tagSearch={tagSearch}
                username={this.state.currentUser.username}
                currentUser={this.state.currentUser}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
export default DownloadedPhotos;
