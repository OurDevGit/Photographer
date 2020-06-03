import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import {
  getCurrentUser,
  getAllCategories,
  getPhotoLists,
  add_geo_tag
} from "../../util/APIUtils";
import ChatHttpServer from '../../util/chatHttpServer'
import { ACCESS_TOKEN, PHOTO_LIST_SIZE, GEOCODING_API_KEY } from "../../constants";
import { HomeHeader, PhotoList } from "../../components";
import PhotoDetails from "./PhotoDetails";
import Bucket from "./Bucket";
import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      ImageShow: false,
      selImage: {},
      totalPages: 0,
      activePage: 1,
      BucketShow: false,
      searchOptions: [],
      isCtrlKey: false,
      tagSearch: null,
      photos: [],
      hasMoreItems: false,
      latitude: "",
      longitude: ""
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
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.LoadPhotos = this.LoadPhotos.bind(this);
  }

  async loadCurrentUser() {
    this.setState({
      isLoading: true,
    });
    getCurrentUser()
      .then((response) => {
        console.log(response)
        const data = {
          username: response.username,
          uid: response.id
        }
        ChatHttpServer.login(data)
          .then(res => {
            if (res.error) {
              alert('Invalid login details')
            } else {
              this.setState({
                currentUser: response,
                // isAuthenticated: true,
                isLoading: false,
                hasMoreItems: true
              });
            }
          })
          .catch(error => {
            alert('Invalid login details')
          })
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

  LoadPhotos(page) {
    console.log(page);
    getPhotoLists(page, 30)
      .then((response) => {
        const photos = this.state.photos.slice();
        console.log("res" + page, response);
        if (response.last) {
          this.setState({
            hasMoreItems: false,
          });
        } else {
          this.setState({
            photos: photos.concat(response.content),
          });
        }
      })
      .catch((error) => {
        console.log(error);
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

  position = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          position: position
        });
        console.log("Location", position)
        fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + GEOCODING_API_KEY)
          .then((response) => response.json())
          .then((responseJson) => {
            console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
            this.setState({
              locationName: responseJson
            })
          })
          .catch(error => console.log(error))
      },
      err => console.log(err)
    );
  }

  componentDidMount() {

    this.position();
    this.loadCurrentUser();
    // this.loadAllCategories();
    // this.getTotalpages();
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
    console.log(this.props.location.search.split("="));
  }

  componentDidUpdate() {
    // if()
    // var Request = {
    //     "longitude": this.state.longitude,
    //     "latitude": this.state.latitude,
    //     "locationName": "string",
    //     "userId": this.state.currentUser.id
    // }
    // add_geo_tag(Request)
    // .then(response=>{
    //   console.log(response)
    // })
    // .catch(error=>{
    //   console.log(error);
    // })
  }

  keydown = (e) => {
    if (e.keyCode === 17) {
      this.setState({
        isCtrlKey: true,
      });
    }
  };

  keyup = (e) => {
    if (e.keyCode === 17) {
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
    this.props.history.push("/?key=" + e);
  }

  handleSearchTag(e) {
    console.log(e);
    this.props.history.push("/?tag=" + e);
  }

  render() {
    console.log("location", this.state.position)
    console.log("dd", this.state.photos)
    if (this.props.location.search.split("=")[0] === "?tag") {
      var tagSearch = this.props.location.search.split("=")[1];
      console.log("dddd", tagSearch);
    } else if (this.props.location.search.split("=")[0] === "?key") {
      var keySearch = this.props.location.search.split("=")[1];
      var SearchOptions = [
        {
          label: "key",
          value: keySearch,
        },
      ];
    }

    const loader = <div className="loader">Loading ...</div>;

    var items = [];
    this.state.photos.map((track, i) => {
      items.push(
        <div className="track" key={i}>
          <a>
            <img src={track.url_lr} width="150" height="150" />
            <p className="title">{track.id}</p>
          </a>
        </div>
      );
    });
    if (this.state.isLoading) {
      return <LoadingIndicator />
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
        <Grid className="pages page-index homeContent">
          <Grid.Row>
            {/* <GridColumn only='computer' width={16}>
              <CategoryCarousel categories={this.state.categories} />
            </GridColumn> */}

            <Grid.Column width={16}>

              <PhotoList
                type="home_list"
                onClickImage={this.handleImageClick}
                addToBucket={this.addToBucket}
                // activePage={this.state.activePage}
                // totalPages={this.state.totalPages}
                quickView={this.quickView}
                viewOwner={this.viewOwner}
                searchOptions={SearchOptions}
                tagSearch={tagSearch}
              />
              {/* <Gallery photos={photos}  /> */}
              <PhotoDetails
                show={this.state.ImageShow}
                photo={this.state.selImage}
                handleClose={this.CloseImageModal}
                addToBucket={this.addToBucket}
              />
              <Bucket
                show={this.state.BucketShow}
                photo={this.state.selImage}
                handleClose={this.CloseBucketModal}
              />
            </Grid.Column>
            <Grid.Column className="PageNation" width="16">
              {/* <Pagination_Component 
                totalPages = {this.state.totalPages}
                onChangePage = {this.onChangePage}
              /> */}
            </Grid.Column>
            <Grid.Column width="16">{/* <Footer /> */}</Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  }
}
export default Home;
