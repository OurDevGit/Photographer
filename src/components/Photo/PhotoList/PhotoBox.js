import React, { Component } from "react";
import { Popup, Button, Icon, Label } from "semantic-ui-react";
import { Heart_Icon, Plus_Icon, Zoom_Icon } from "../../../assets/icons";
import { AvatarImage } from "../../../components";
import { AvatarDefault } from "../../../assets/images/homepage";
import { addToLike, is_liked } from "../../../util/APIUtils";
import { notification } from "antd";
import banner from "../../../assets/images/banner_Certificate.jpg";
class PhotoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      photo_list: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0,
      last: true,
      currentVotes: [],
      hasMore: true,
      isLoading: false,
      islike: 0,
    };
    this.handleImageClick = this.handleImageClick.bind(this);
    this.quickView = this.quickView.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.handleViewOwner = this.handleViewOwner.bind(this);
    this.addLike = this.addLike.bind(this);
  }

  handleImageClick(e) {
    this.props.onClickImage(e);
  }

  handleViewOwner() {
    console.log(this.props.photo.ownerId);
    this.props.viewOwner(this.props.photo.ownerId);
  }

  quickView() {
    this.props.quickView(this.props.photo);
  }

  addToBucket() {
    this.props.addToBucket(this.props.photo, true);
  }
  onMouseOver() {
    this.MouseOverFlag = setTimeout(this.quickView, 1000);
  }
  onMouseOut() {
    clearTimeout(this.MouseOverFlag);
  }
  addLike() {
    is_liked(this.props.photo.id)
      .then((response) => {
        if (response) {
          notification.error({
            message: "Openshoots",
            description: "This photo is already your liked photo",
          });
        } else {
          addToLike(this.props.photo.id)
            .then((response) => {
              if (response.ok) {
                this.setState({
                  islike: 1,
                });
              } else {
                notification.error({
                  message: "Openshoots",
                  description: "Something went wrong. Please try again.",
                });
              }
            })
            .catch((error) => {
              notification.error({
                message: "Openshoots",
                description: "Something went wrong. Please try again.",
              });
            });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Openshoots",
          description: "Something went wrong. Please try again.",
        });
      });
  }

  render() {
    var releaseNum = this.props.photo.authorizations
      ? this.props.photo.authorizations.length
      : 0;
    return (
      <>
        {this.props.photo.type ? (
          <div className="banner">
            <a href={this.props.photo.redirect} target={this.props.photo.newTab ? "blank" : ""}><img src={this.props.photo.src} width="100%" /></a>
          </div>
        ) : (
          <div className="PhotoBox">
            <a target="blank" onClick={this.quickView}>
              <Zoom_Icon className="detail_Icon Zoom-icon" />
            </a>
            <a onClick={this.addLike}>
              <Heart_Icon className="detail_Icon Heart-icon" />
            </a>
            <a onClick={this.addToBucket}>
              <Plus_Icon className="detail_Icon Plus-icon" />
            </a>
            <div className="owner_content" onClick={this.handleViewOwner}>
              <AvatarImage
                url={
                  this.props.photo.ownerIcon
                    ? this.props.photo.ownerIcon
                    : AvatarDefault
                }
                name={this.props.photo.owner}
              />
            </div>
            <img
              id={this.props.photo.id}
              src={this.props.photo.url_mr || this.props.photo.url_lr}
              width={this.props.photo.width}
              height={this.props.photo.height}
              // {...this.props.photo}
              onClick={this.handleImageClick}
            />
            {/* <Popup
        mouseEnterDelay={500}
        on="hover"
        position="right center"
        trigger={
          <img
            id={this.props.photo.id}
            src={this.props.photo.url_mr || this.props.photo.url_lr}
            width={this.props.photo.width}
            height={this.props.photo.height}
            // {...this.props.photo}
            onClick={this.handleImageClick}
          />
        }
      >
        <div>
          <img
            className="modalImage"
            id={this.props.photo.id}
            src={this.props.photo.url_mr}
          />
          <p></p>
          <span>Has {releaseNum} Releases</span>
          <Button as="div" className="love ImageButton" labelPosition="right">
            <Button color="red">
              <Icon name="heart" />
            </Button>
            <Label as="a" basic color="red" pointing="left">
              {this.props.photo.likes +  this.state.islike}
            </Label>
          </Button>

          <Button
            as="div"
            className="download ImageButton"
            labelPosition="right"
          >
            <Button color="blue">
              <Icon name="download" onClick={this.downloadImage} />
            </Button>
            <Label as="a" basic color="blue" pointing="left">
              {this.props.photo.downloads}
            </Label>
          </Button>

          <Button as="div" className="view ImageButton" labelPosition="right">
            <Button color="grey">
              <Icon name="eye" />
            </Button>
            <Label as="a" basic color="grey" pointing="left">
              {this.props.photo.viewed}
            </Label>
          </Button>
        </div>
      </Popup> */}
          </div>
        )}
      </>
    );
  }
}

export default PhotoBox;
