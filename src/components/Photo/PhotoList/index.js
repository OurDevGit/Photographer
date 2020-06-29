import React, { Component } from "react";
import Gallery from "react-photo-gallery";
import {
  getUserCreatedPhotos,
  getUserVotedPhotos,
  getPhotoLists,
  getSubmitPhotos,
  getAdminPublicationPhotoList,
  getPhotoListsForSearch,
  getPhotoListsForSearchByTag,
  getDownloadedPhotos,
  getListBasketsContent,
  getUserPhotos,
  getPhotosInCollection,
  get_banners_for_homepage,
} from "../../../util/APIUtils";
import Photo from "../Photo";
import { castVote } from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import LoadingSpinner from "../../LoadingSpinner"
import { notification } from "antd";
import { PHOTO_LIST_SIZE } from "../../../constants";
import InfiniteScroll from "react-infinite-scroller";
import PhotoBox from "./PhotoBox";
import "./style.less";

class PhotoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      photo_list: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: false,
      currentVotes: [],
      hasMore: true,
      isLoading: false,
    };
    this.loadPhotoList = this.loadPhotoList.bind(this);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.loadFunc = this.loadFunc.bind(this);
    this.photoClick = this.photoClick.bind(this);
    // this.ImageRender =  this.ImageRender.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  loadPhotoList(page = 0, size = PHOTO_LIST_SIZE) {
    let promise;
    if (this.props.username) {
      if (this.props.type === "USER_CREATED_PHOTOS") {
        promise = getUserCreatedPhotos(this.props.username, page, size);
      } else if (this.props.type === "USER_VOTED_PHOTOS") {
        promise = getUserVotedPhotos(this.props.username, page, size);
      } else if (this.props.type === "Submit_operation") {
        promise = getSubmitPhotos();
      } else if (this.props.type === "admin_photolist") {
        promise = getAdminPublicationPhotoList(this.props.status);
      } else if (this.props.type === "downloaded_photolist") {
        promise = getDownloadedPhotos(this.props.currentUser.id);
      } else if (this.props.type === "basket") {
        promise = getListBasketsContent(this.props.basketId);
      } else if (this.props.type === "collection") {
        promise = getPhotosInCollection(this.props.collectionId);
      } else if (this.props.type === "userPhoto") {
        promise = getUserPhotos(this.props.currentUser.id);
      } else {
        if (this.props.searchOptions && this.props.searchOptions.length > 0) {
          promise = getPhotoListsForSearch(
            page,
            size,
            this.props.searchOptions
          );
        } else {
          if (this.props.tagSearch) {
            promise = getPhotoListsForSearchByTag(
              page,
              size,
              this.props.tagSearch
            );
          } else {
            promise = getPhotoLists(page, size);
          }
        }
      }
    } else {
      if (this.props.searchOptions && this.props.searchOptions.length > 0) {
        promise = getPhotoListsForSearch(page, size, this.props.searchOptions);
      } else {
        if (this.props.tagSearch) {
          promise = getPhotoListsForSearchByTag(
            page,
            size,
            this.props.tagSearch
          );
        } else {
          promise = getPhotoLists(page, size);
        }
      }
    }

    if (!promise) {
      return;
    }
    if (this.props.type !== "home_list") {
      this.setState({
        isLoading: true,
      });
    }

    if (this.props.type === "Submit_operation") {
      promise
        .then((response) => {
          const photos = this.state.photos.slice();
          for (let i = 0; i < response.photos.length; i++) {
            if (response.photos[i].submitStatus === this.props.status) {
              photos.push(response.photos[i]);
            }
          }
          this.setState({
            photos: photos,
            photo_list: photos,
            isLoading: false,
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
        });
    } else if (
      this.props.type === "admin_photolist" ||
      this.props.type === "downloaded_photolist" ||
      this.props.type === "basket" ||
      this.props.type === "collection" ||
      this.props.type === "userPhoto"
    ) {
      promise
        .then((response) => {
          this.setState({
            photos: response,
            photo_list: response,
            isLoading: false,
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
        });
    } else {
      promise
        .then((response) => {
          const photos = this.state.photos.slice();
          const currentVotes = this.state.currentVotes.slice();
          if (response.last) {
            this.setState({
              hasMore: false,
            });
          }

          if (!this.state.banners) {
            get_banners_for_homepage()
              .then((res) => {
                if(res[response.number]){
                  response.content.push({
                    type: "banner",
                    lr_width: 1900,
                    lr_heigh: 600,
                    url_lr: res[response.number].address,
                    newTab: res[response.number].newTab,
                    redirect: res[response.number].redirect
                  });
                }
                // res.forEach((banner, bannerIndex) => {
                //   console.log(bannerIndex, banner);
                //   response.content.push({
                //     type: "banner",
                //     lr_width: 1900,
                //     lr_heigh: 600,
                //     url_lr: banner.address,
                //     newTab: banner.newTab,
                //     redirect: banner.redirect
                //   });
                // });
                this.setState({
                  photos: photos.concat(response.content),
                  photo_list: photos.concat(response.content),
                  page: response.number,
                  size: response.size,
                  totalElements: response.totalElements,
                  totalPages: response.totalPages,
                  last: response.last,
                  banners: res,
                  isLoading: false,
                });
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            if(this.state.banners[response.number]){
              response.content.push({
                type: "banner",
                lr_width: 1900,
                lr_heigh: 600,
                url_lr: this.state.banners[response.number].address,
                newTab: this.state.banners[response.number].newTab,
                redirect: this.state.banners[response.number].redirect
              });
            }
            // this.state.banners.forEach((banner, bannerIndex) => {
            //   console.log(bannerIndex, banner);
            //   response.content.push({
            //     type: "banner",
            //     lr_width: 1900,
            //     lr_heigh: 600,
            //     url_lr: banner.address,
            //     newTab: banner.newTab,
            //     redirect: banner.redirect
            //   });
            // });
            this.setState({
              photos: photos.concat(response.content),
              photo_list: photos.concat(response.content),
              page: response.number,
              size: response.size,
              totalElements: response.totalElements,
              totalPages: response.totalPages,
              last: response.last,
              isLoading: false,
            });
          }
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  componentDidMount() {
    if (this.props.type !== "home_list") {
      this.loadPhotoList();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.isAuthenticated !== prevProps.isAuthenticated) {
      // Reset State
      this.setState({
        photos: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
      });
      this.loadPhotoList();
    }
    if (this.props.status !== prevProps.status || this.props.delete) {
      this.setState({
        photos: [],
        photo_list: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
      });
      this.loadPhotoList();
      if (this.props.type === "Submit_operation") {
        this.props.deleteFun();
      }
    }

    if (this.props.publish !== prevProps.publish) {
      this.state.photo_list.splice(this.props.active, 1);

      this.setState({
        photo_list: this.state.photo_list,
      });
    }
    if (this.props.activePage !== prevProps.activePage) {
      this.setState({
        photos: [],
        page: 0,
        totalElements: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
      });
      this.loadPhotoList(this.props.activePage - 1, PHOTO_LIST_SIZE);
    }
    if (this.props.searchOptions !== prevProps.searchOptions) {
      this.setState({
        photos: [],
        photo_list: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
        hasMore: true,
      });
      this.state.photo_list = [];
      this.state.totalPages = 0;
      this.loadPhotoList();
    }
    if (this.props.basketId !== prevProps.basketId) {
      this.setState({
        photos: [],
        photo_list: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
        hasMore: true,
      });
      this.state.photo_list = [];
      this.state.totalPages = 0;
      this.loadPhotoList();
    }
    if (this.props.collectionId !== prevProps.collectionId) {
      this.setState({
        photos: [],
        photo_list: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
        hasMore: true,
      });
      this.state.photo_list = [];
      this.state.totalPages = 0;
      this.loadPhotoList();
    }
    if (this.props.tagSearch !== prevProps.tagSearch) {
      this.setState({
        photos: [],
        photo_list: [],
        page: 0,
        totalElements: 0,
        totalPages: 0,
        last: false,
        currentVotes: [],
        isLoading: false,
        hasMore: true,
      });
      this.state.photo_list = [];
      this.state.totalPages = 0;
      this.loadPhotoList();
    }
  }

  handleLoadMore() {
    this.loadPhotoList(this.state.page + 1);
  }

  handleVoteChange(event, photoIndex) {
    const currentVotes = this.state.currentVotes.slice();
    currentVotes[photoIndex] = event.target.value;

    this.setState({
      currentVotes: currentVotes,
    });
  }

  handleVoteSubmit(event, photoIndex) {
    event.preventDefault();
    if (!this.props.isAuthenticated) {
      this.props.history.push("/login");
      notification.info({
        message: "Photoing App",
        description: "Please login to vote.",
      });
      return;
    }

    const photo = this.state.photos[photoIndex];
    const selectedChoice = this.state.currentVotes[photoIndex];

    const voteData = {
      photoId: photo.id,
      choiceId: selectedChoice,
    };

    castVote(voteData)
      .then((response) => {
        const photos = this.state.photos.slice();
        photos[photoIndex] = response;
        this.setState({
          photos: photos,
        });
      })
      .catch((error) => {
        if (error.status === 401) {
          this.props.handleLogout(
            "/login",
            "error",
            "You have been logged out. Please login to vote"
          );
        } else {
          notification.error({
            message: "Photoing App",
            description:
              error.message || "Sorry! Something went wrong. Please try again!",
          });
        }
      });
  }

  loadFunc(page) {
    this.loadPhotoList(page, PHOTO_LIST_SIZE);
  }

  photoClick(e) {
    this.props.onClickImage(e.target);
  }

  viewOwner(e) {
    this.props.viewOwner(e);
  }

  onMouseUp() {}

  ImageRender = ({ index, left, top, key, photo }) => (
    <PhotoBox
      key={photo.id}
      margin={"2px"}
      index={index}
      photo={photo}
      onClickImage={this.photoClick}
      quickView={this.props.quickView}
      addToBucket={this.props.addToBucket}
      viewOwner={this.props.viewOwner}
    />
  );
  render() {
    const photoViews = [];
    this.state.photo_list.forEach((photo, photoIndex) => {
      photoViews.push(
        <Photo
          key={photoIndex}
          index={photoIndex}
          photo={photo}
          onClick={this.props.onClickImage}
          active={this.props.active}
          total={this.state.photo_list.length}
          type={this.props.type}
          addToBucket={this.props.addToBucket}
          action={this.props.action}
          publish={this.props.publish}
          status={this.props.status}
          quickView={this.props.quickView}
        />
      );
    });

    var samphotosq = this.state.photo_list;

    if (this.state.photo_list.length > 0) {
      for (let k = 0; k < this.state.photo_list.length; k++) {
        // samphotosq[k].id = this.state.photo_list[k].id;
        samphotosq[k].src = this.state.photo_list[k].url_lr;
        samphotosq[k].width = this.state.photo_list[k].lr_width;
        samphotosq[k].height = this.state.photo_list[k].lr_heigh;
      }
    }
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    if (
      this.props.type !== "home_list" &&
      !this.state.isLoading &&
      this.state.photos.length === 0
    ) {
      return (
        <div className="no-photos-found">
          <span>No Photos Found.</span>
        </div>
      );
    }
    return (
      <div className="photos-container">
        {this.props.type === "home_list" ? (
          <div className="infiniteScroll">
            <InfiniteScroll
              pageStart={-1}
              loadMore={this.loadFunc}
              hasMore={this.state.hasMore}
              loader={<LoadingIndicator key={this.state.page} />}
            >
              <Gallery photos={samphotosq} renderImage={this.ImageRender} />
              {/* <img src={banner} /> */}
            </InfiniteScroll>
          </div>
        ) : this.props.type === "downloaded_photolist" ||
          this.props.type === "basket" ||
          this.props.type === "collection" ? (
          <Gallery photos={samphotosq} renderImage={this.ImageRender} />
        ) : (
          photoViews
        )}
      </div>
    );
  }
}

export default PhotoList;
