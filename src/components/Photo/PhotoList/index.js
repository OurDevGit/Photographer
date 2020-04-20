import React, { Component, useCallback } from "react";
import Gallery from "react-photo-gallery";
import {
  getAllPhotos,
  getUserCreatedPhotos,
  getUserVotedPhotos,
  getPhotoLists,
  getSubmitPhotos,
  getAdminPublicationPhotoList,
  getPhotoListsForSearch,
  getPhotoListsForSearchByTag,
  getDownloadedPhotos,
  getListBasketsContent,
} from "../../../util/APIUtils";
import Photo from "../Photo";
import { castVote } from "../../../util/APIUtils";
import LoadingIndicator from "../../../common/LoadingIndicator";
import { Button, Icon, notification } from "antd";
import { PHOTO_LIST_SIZE } from "../../../constants";
import InfiniteScroll from "react-infinite-scroller";
import PhotoBox from "./PhotoBox";
import "./style.less";

const photos = [
  {
    id: 1,
  },
];
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
      } else if (this.props.type == "Submit_operation") {
        promise = getSubmitPhotos();
      } else if (this.props.type == "admin_photolist") {
        promise = getAdminPublicationPhotoList(this.props.status);
      } else if (this.props.type == "downloaded_photolist") {
        promise = getDownloadedPhotos(this.props.currentUser.id);
      } else if (this.props.type === "basket") {
        promise = getListBasketsContent(this.props.basketId);
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

    this.setState({
      isLoading: true,
    });
    if (this.props.type == "Submit_operation") {
      promise
        .then((response) => {
          const photos = this.state.photos.slice();
          for (let i = 0; i < response.photos.length; i++) {
            if (response.photos[i].submitStatus == this.props.status) {
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
      this.props.type == "admin_photolist" ||
      this.props.type === "downloaded_photolist" ||
      this.props.type === "basket"
    ) {
      promise
        .then((response) => {
          console.log("####################", response);
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
          console.log("DDDD", response);
          this.setState({
            photos: photos.concat(response.content),
            photo_list: photos.concat(response.content),
            // page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,
            currentVotes: currentVotes.concat(
              Array(response.content.length).fill(null)
            ),
            isLoading: false,
          });
        })
        .catch((error) => {
          this.setState({
            isLoading: false,
          });
        });
    }
  }

  componentDidMount() {
    this.loadPhotoList();
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
      if (this.props.type == "Submit_operation") {
        this.props.deleteFun();
      }
    }

    if (this.props.publish != prevProps.publish) {
      this.state.photo_list.splice(this.props.active, 1);

      this.setState({
        photo_list: this.state.photo_list,
      });
    }
    if (this.props.activePage != prevProps.activePage) {
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
    if (this.props.searchOptions != prevProps.searchOptions) {
      console.log("SearchOPtionsfrsfafwefwef", this.props.searchOptions);
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
    if (this.props.basketId != prevProps.basketId) {
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
    if(this.props.tagSearch !== prevProps.tagSearch){
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
    console.log("DDDD@@@@@", this.state.totalPages);
    console.log("DDDD~~~~~~~~~~", page);
    console.log("DDDD~~~~~~~~~~", this.state.last);
    this.setState({
      page: page,
    });
    if (page == this.state.totalPages - 1 || this.state.totalPages == 1) {
      this.setState({
        hasMore: false,
      });
    }
    // if(this.state.last)
    // {
    //     this.setState({
    //         hasMore: false
    //     })
    // }
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
      // key= {photo.id}
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
          // currentVote={this.state.currentVotes[photoIndex]}
          // handleVoteChange={(event) => this.handleVoteChange(event, photoIndex)}
          // handleVoteSubmit={(event) => this.handleVoteSubmit(event, photoIndex)}
        />
      );
    });

    var items = [];
    this.state.photo_list.map((track, i) => {
      items.push(
        <div className="track" key={i}>
          <a href={track.url_fr} target="_blank">
            <img src={track.url_fr} width="150" height="150" />
          </a>
        </div>
      );
    });

    var samphotosq = this.state.photo_list;
    //
    if (this.state.photo_list.length > 0) {
      for (let k = 0; k < this.state.photo_list.length; k++) {
        // samphotosq[k].id = this.state.photo_list[k].id;
        samphotosq[k].src = this.state.photo_list[k].url_lr;
        samphotosq[k].width = this.state.photo_list[k].lr_width;
        samphotosq[k].height = this.state.photo_list[k].lr_heigh;
      }
    }
    console.log("%%%%%%%%%%%%%%%%%", samphotosq);
    return (
      <div className="photos-container">
        {/* {photoViews} */}
        {this.props.type == "home_list" && this.state.totalPages > 0 ? (
          <div className="infiniteScroll">
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadFunc}
              hasMore={this.state.hasMore}
              loader={
                <div className="loader" key={0}>
                  Loading ...
                </div>
              }
            >
              {/* {photoViews} */}
              <Gallery photos={samphotosq} renderImage={this.ImageRender} />
            </InfiniteScroll>
          </div>
        ) : this.props.type == "home_list" &&
          this.props.totalPages == 0 ? null : this.props.type ===
            "downloaded_photolist" || this.props.type === "basket" ? (
          <Gallery photos={samphotosq} renderImage={this.ImageRender} />
        ) : (
          photoViews
        )}

        {!this.state.isLoading && this.state.photos.length === 0 ? (
          <div className="no-photos-found">
            <span>No Photos Found.</span>
          </div>
        ) : null}
        {/* {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-photos">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }               */}
        {this.state.isLoading ? <LoadingIndicator /> : null}
      </div>
    );
  }
}

export default PhotoList;
