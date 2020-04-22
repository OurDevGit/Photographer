import React, { Component } from "react";
import {
  Grid,
  Button,
  Icon,
  Label,
  Comment,
  TextArea,
  Modal,
  Table,
  Header,
  Image,
} from "semantic-ui-react";
import MetaTags from "react-meta-tags";
import { NavLink, Redirect } from "react-router-dom";
import {
  getCurrentUser,
  getAllCategories,
  getPhotoDetail,
  addToLike,
  removeToLike,
  is_liked,
  getLikeAmount,
  getDownloadAmount,
  getViewsAmount,
  add_comment,
  getSameCollection,
  download,
  getPhotoAuthDownload,
} from "../../util/APIUtils";
import { ACCESS_TOKEN, HOST_URL } from "../../constants";
import {
  HomeHeader,
  AvatarImage,
  PhotoList,
  AnimateButton,
  Comments,
} from "../../components";
import PanAndZoomImage from "../../PanAndZoomImage";
import ImageCarousel from "./ImageCarousel";
import Bucket from "../Home/Bucket";
import {
  Heart_Icon,
  Plus_Icon,
  Zoom_Icon,
  CloseIcon,
} from "../../assets/icons";
import { AvatarDefault } from "../../assets/images/homepage";
import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
import PhotoDetails from "./PhotoDetails";
class Photo_details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      ImageShow: false,
      similarPhotos: [],
      likes: 0,
      downloads: 0,
      views: 0,
      likeFlag: false,
      BucketShow: false,
      isFollower: false,
      followerUrl: "https://www.instagram.com/plutus_in_fabula/",
      commentContent: "",
      commitFlag: false,
      isCtrlKey: false,
      sameCollectionPhotos: [],
      opne: false,
      ImageShow: false,
      modalImageDetail: {},
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.is_like_photo = this.is_like_photo.bind(this);
    this.loadPhotoDetail = this.loadPhotoDetail.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.CloseImageModal = this.CloseImageModal.bind(this);
    this.CloseBucketModal = this.CloseBucketModal.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
    this.addLike = this.addLike.bind(this);
    this.goBack = this.goBack.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.replyComment = this.replyComment.bind(this);
    this.handleChangeComment = this.handleChangeComment.bind(this);
    this.addComment = this.addComment.bind(this);
    this.loadSameCollectionPhotos = this.loadSameCollectionPhotos.bind(this);
    this.sameTagPhotos = this.sameTagPhotos.bind(this);
    this.photoDownload = this.photoDownload.bind(this);
    this.modalclose = this.modalclose.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);
    this.viewOwner = this.viewOwner.bind(this);
    this.quickView = this.quickView.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch =  this.clickSearch.bind(this);
    this.showUserServiceDetail = this.showUserServiceDetail.bind(this);
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

  loadPhotoDetail(id) {
    this.setState({
      isLoading: true,
    });
    getPhotoDetail(id)
      .then((response) => {
        window.scrollTo(0, 0);
        this.setState({
          selImage: response.photoDto,
          similarPhotos: response.similarPhotos.content,
          likes: response.photoDto.likes,
          downloads: response.photoDto.downloads,
          views: response.photoDto.viewed,
        });
        this.loadSameCollectionPhotos(id);
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  loadSameCollectionPhotos(id) {
    getSameCollection(id)
      .then((response) => {
        this.setState({
          isLoading: false,
          sameCollectionPhotos: response,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
      });
  }

  is_like_photo(id) {
    is_liked(id)
      .then((response) => {
        this.setState({
          likeFlag: response,
        });
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  loadLikeAmount(id) {
    getLikeAmount(id)
      .then((response) => {
        this.setState({
          likes: response,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  loadDownloadAmount(id) {
    getDownloadAmount(id)
      .then((response) => {
        this.setState({
          downloads: response,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  loadViewsAmount(id) {
    getViewsAmount(id)
      .then((response) => {
        this.setState({
          views: response,
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
    // this.is_like_photo(this.props.match.params.id);
    this.loadPhotoDetail(this.props.match.params.id);
    window.addEventListener("keydown", this.keydown);
    window.addEventListener("keyup", this.keyup);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id != prevProps.match.params.id) {
      this.is_like_photo(this.props.match.params.id);
      this.loadPhotoDetail(this.props.match.params.id);
      this.setState({
        selImage: undefined,
        commentContent: "",
      });
    }
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

  CloseImageModal(flag) {
    this.setState({
      ImageShow: flag,
    });
  }

  CloseBucketModal(flag) {
    this.setState({
      BucketShow: flag,
    });
  }

  addToBucket() {
    if (this.state.currentUser) {
      this.setState({
        BucketShow: true,
      });
    } else {
      notification.warning({
        message: "Openshoots",
        description: "Please login with your account.",
      });
      this.props.history.push("/user/LoginAndSignUp");
    }
  }
  goBack() {
    this.props.history.goBack();
  }

  addLike() {
    if (this.state.currentUser) {
      if (this.state.likeFlag == false) {
        addToLike(this.props.match.params.id)
          .then((response) => {
            this.state.likes = this.state.likes + 1;
            this.setState({
              likes: this.state.likes,
              likeFlag: true,
            });
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else {
        notification.success({
          message: "Photoing App",
          description: "This photo is already your liked photo",
        });
      }
    } else {
      notification.warning({
        message: "Openshoots",
        description: "Please login with your account.",
      });
      this.props.history.push("/user/LoginAndSignUp");
    }
  }

  handleImageClick(e) {
    this.setState({
      // ImageShow: true,
      selImage: e,
    });
    if (this.state.isCtrlKey) {
      window.open(e.id, "_blank");
    } else {
      this.props.history.push("/Photo_details/" + e.id);
    }
  }

  replyComment() {
    console.log("ddd");
  }

  handleChangeComment(e, { value }) {
    this.setState({
      commentContent: value,
    });
  }

  addComment() {
    if (this.state.currentUser) {
      var Request = {
        photo: this.props.match.params.id,
        user: this.state.currentUser.id,
        content: this.state.commentContent,
      };
      this.setState({
        isSendCommentLoading: true,
      });
      add_comment(Request)
        .then((response) => {
          if (response.ok) {
            this.setState({
              commitFlag: !this.state.commitFlag,
              isSendCommentLoading: false,
              commentContent: "",
            });
          } else {
            this.setState({
              isSendCommentLoading: false,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            isSendCommentLoading: false,
          });
        });
    } else {
      notification.warning({
        message: "Openshoots",
        description: "Please login with your account.",
      });
      this.props.history.push("/user/LoginAndSignUp");
    }
  }

  sameTagPhotos(e) {
    console.log(e.target.id);
    this.props.history.push("/?tag=" + e.target.id);
  }

  photoDownload() {
    download(this.state.selImage.id)
      .then((response) => {
        console.log(response);
        response.text().then((text) => {
          if (response.ok) {
            console.log(text);
            // window.open(text)
            this.Filedownload(text, "dddd");
            this.setState({
              open: true,
            });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  Filedownload(filename, text) {
    var element = document.createElement("a");
    element.setAttribute("href", filename);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  downloadPDF() {
    getPhotoAuthDownload(this.state.selImage.id)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    this.modalclose();
  }

  modalclose() {
    this.setState({
      open: false,
    });
  }

  viewOwner(ownerId) {
    this.props.history.push("/user/profile/" + ownerId);
  }

  quickView(e) {
    this.setState({
      ImageShow: true,
      modalImageDetail: e,
    });
    console.log(e);
  }

  CloseImageModal(flag) {
    this.setState({
      ImageShow: flag,
    });
  }

  handleSearchTag(e) {
    console.log(e);
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  showUserServiceDetail() {
    this.props.history.push("/product_detail/1302804");
  }

  render() {
    const { selImage, similarPhotos } = this.state;
    const keywords = [];
    var url = "";
    var downloadUrl = "";
    if (selImage && selImage.tags) {
      for (let i = 0; i < selImage.tags.length; i++) {
        keywords.push(
          <button onClick={this.sameTagPhotos} id={selImage.tags[i].value}>
            {selImage.tags[i].value}
          </button>
        );
      }
      url = selImage.url_fr + "";
      downloadUrl = selImage.url_hr + "";
    }

    if (!selImage) {
      return <LoadingIndicator />;
    } else {
      return (
        <>
          <MetaTags>
            <title>Openshoot</title>
          </MetaTags>
          <HomeHeader
            isAuthenticated={this.state.isAuthenticated}
            currentUser={this.state.currentUser}
            onLogout={this.handleLogout}
            Back={this.goBack}
            clickSearch={this.clickSearch}
            handleSearchTag={this.handleSearchTag}
          />
          <Grid className="photo_details" verticalAlign="">
            <Grid.Row only="computer" className="photo_details_row">
              <Grid.Column width={8}>
                {/* <Button content='Back to List' icon='arrow left' labelPosition='left' color='green' className="BackToList"/> */}
                <div className="zoomImage">
                  {/* <a target="blank" href={url}>
                    <Zoom_Icon className="detail_Icon Zoom-icon" />
                  </a> */}
                  <a onClick={this.addLike}>
                    <Heart_Icon className="detail_Icon Heart-icon" />
                  </a>
                  <a onClick={this.addToBucket}>
                    <Plus_Icon className="detail_Icon Plus-icon" />
                  </a>
                  <a
                    className="owner"
                    href={"/user/profile/" + selImage.ownerId}
                  >
                    <AvatarImage
                      url={
                        selImage.ownerIcon ? selImage.ownerIcon : AvatarDefault
                      }
                      name={selImage.owner}
                    />
                  </a>
                  <Bucket
                    show={this.state.BucketShow}
                    photo={selImage}
                    handleClose={this.CloseBucketModal}
                  />

                  <Button
                    as="div"
                    className="love ImageButton"
                    labelPosition="right"
                  >
                    <Button color="red">
                      <Icon name="heart" />
                      {/* Like */}
                    </Button>
                    <Label as="a" basic color="red" pointing="left">
                      {this.state.likes}
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
                      {this.state.downloads}
                    </Label>
                  </Button>
                  <a
                    target="blank"
                    className="ImageButton followAndDownload"
                    onClick={this.photoDownload}
                  >
                    <AnimateButton content="Download" IconName="download" />
                  </a>
                  <Button
                    as="div"
                    className="view ImageButton"
                    labelPosition="right"
                  >
                    <Button color="grey">
                      <Icon name="eye" />
                    </Button>
                    <Label as="a" basic color="gray" pointing="left">
                      {this.state.views}
                    </Label>
                  </Button>
                  <a>Zoom : Shift + scroll</a>
                  <PanAndZoomImage src={downloadUrl} />
                </div>
                <div className="CommentBox">
                  <Comments
                    className="CommentList"
                    photoId={this.props.match.params.id}
                    flag={this.state.commitFlag}
                    photo={selImage}
                  />
                  <Comment.Group>
                    <Comment className="commitText">
                      <Comment.Avatar
                        src={
                          selImage.ownerIcon
                            ? selImage.ownerIcon
                            : AvatarDefault
                        }
                      />
                      <Comment.Content>
                        <TextArea
                          rows={1}
                          value={this.state.commentContent}
                          placeholder="add comments"
                          onChange={this.handleChangeComment}
                        />
                        {this.state.isSendCommentLoading ? (
                          <Icon name="spinner" className="sending" />
                        ) : (
                          <Icon
                            name="send"
                            className="sending"
                            disabled={
                              this.state.commentContent == "" ? true : false
                            }
                            onClick={this.addComment}
                          />
                        )}
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                </div>
              </Grid.Column>
              <Grid.Column width={8}>
                <div className="photoDetail">
                  {/* <h2>Product Placement with one Model, exclusive shooting</h2>
                  <h3 className="shared">
                    <span className="social">
                      <Icon name="youtube official" />
                    </span>
                    <span className="social">
                      <Icon name="facebook official" />
                    </span>
                    <span className="social">
                      <Icon name="instagram official" />
                    </span>
                    <span>Shared on:</span>
                  </h3> */}
                  <p>
                    This Content is created by{" "}
                    <a href="">
                      <b>{selImage.owner}</b>
                    </a>
                    .
                  </p>
                  {/* <p>
                  Image# <a href=""><b>{url.split('/')[url.split('/').length-1]}</b></a>.
                </p> */}
                  <p>
                    uploaded: <b> June 18, 2018 11:14 AM</b>
                  </p>
                  <p>
                    Releases:{" "}
                    <b>
                      {" "}
                      Has{" "}
                      {selImage.authorizations
                        ? selImage.authorizations.length
                        : ""}{" "}
                      model release
                    </b>
                  </p>
                  {selImage.description ? (
                    <p>
                      Descriptions: <b>{selImage.description}</b>
                    </p>
                  ) : null}
                  <div className="keywords">
                    <p>Keywords:</p>
                    {keywords}
                  </div>
                  {/* <p className="Tax">
                    <span> 1.000 $(Incl. Tax)</span>
                    <span className="fee">
                      <b>Fee: </b>
                    </span>
                  </p>
                  <p className="Tax">
                    <span> Available from firm</span>
                    <span>
                      <b>Invoice: </b>
                    </span>
                  </p>
                  <div className="paymentButtons">
                    <Button size="massive" color="blue">
                      Reserve with Escrow
                    </Button>
                    <Button size="massive" color="blue">
                      Contact the Seller
                    </Button>
                  </div> */}
                  <h3>The User offers this services</h3>
                  <div className="userServiceTable">
                    <Table basic="very" selectable>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell></Table.HeaderCell>
                          <Table.HeaderCell>Service:</Table.HeaderCell>
                          <Table.HeaderCell>Platforms shared</Table.HeaderCell>
                          <Table.HeaderCell>Price</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Dedicated Photoshoots with one Model
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>1.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Dedicated Photoshoots with two Models
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>2.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Product Placement with one Model, exclusive
                                shooting
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="social">
                              <Icon name="youtube official" />
                            </span>
                            <span className="social">
                              <Icon name="facebook official" />
                            </span>
                            <span className="social">
                              <Icon name="instagram official" />
                            </span>
                          </Table.Cell>
                          <Table.Cell>1.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Product Placement with one Model, SHared
                                shooting
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="social">
                              <Icon name="youtube official" />
                            </span>
                            <span className="social">
                              <Icon name="facebook official" />
                            </span>
                            <span className="social">
                              <Icon name="instagram official" />
                            </span>
                          </Table.Cell>
                          <Table.Cell>500 $</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </div>
                </div>
                {/* <div className='photoReleases'>
                <div className='keywords'>
                  <p>Releases</p>
                </div>
              </div>                      */}
              </Grid.Column>
            </Grid.Row>

            <Grid.Row only="mobile tablet" className="photo_details_row">
              <Grid.Column width={16}>
                <div className="zoomImage">
                  <a target="blank" href={url}>
                    <Zoom_Icon className="detail_Icon Zoom-icon" />
                  </a>
                  <a onClick={this.addLike}>
                    <Heart_Icon className="detail_Icon Heart-icon" />
                  </a>
                  <a onClick={this.addToBucket}>
                    <Plus_Icon className="detail_Icon Plus-icon" />
                  </a>
                  <Bucket
                    show={this.state.BucketShow}
                    photo={selImage}
                    handleClose={this.CloseBucketModal}
                  />

                  <PanAndZoomImage src={downloadUrl}></PanAndZoomImage>
                </div>
                <div className="CommentBox">
                  <Comments
                    className="CommentList"
                    photoId={this.props.match.params.id}
                    flag={this.state.commitFlag}
                    photo={selImage}
                  />
                  <Comment.Group>
                    <Comment className="commitText">
                      <Comment.Avatar
                        src={
                          selImage.ownerIcon
                            ? selImage.ownerIcon
                            : AvatarDefault
                        }
                      />
                      <Comment.Content>
                        <TextArea
                          rows={1}
                          value={this.state.commentContent}
                          placeholder="add comments"
                          onChange={this.handleChangeComment}
                        />
                        {this.state.isSendCommentLoading ? (
                          <Icon name="spinner" className="sending" />
                        ) : (
                          <Icon
                            name="send"
                            className="sending"
                            disabled={
                              this.state.commentContent == "" ? true : false
                            }
                            onClick={this.addComment}
                          />
                        )}
                      </Comment.Content>
                    </Comment>
                  </Comment.Group>
                </div>
              </Grid.Column>
              <Grid.Column className="mobileButtonGroup" width={16}>
                <a
                  target="blank"
                  onClick={this.photoDownload}
                  className="ImageButton followAndDownload"
                >
                  <AnimateButton
                    content="Follow and Download"
                    IconName="download"
                  />
                </a>
              </Grid.Column>
              <Grid.Column className="mobileButtonGroup" width={16}>
                <Button
                  as="div"
                  className="love ImageButton"
                  labelPosition="right"
                >
                  <Button color="red">
                    <Icon name="heart" />
                    {/* Like */}
                  </Button>
                  <Label as="a" basic color="red" pointing="left">
                    {this.state.likes}
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
                    {this.state.downloads}
                  </Label>
                </Button>

                <Button
                  as="div"
                  className="view ImageButton"
                  labelPosition="right"
                >
                  <Button color="grey">
                    <Icon name="eye" />
                  </Button>
                  <Label as="a" basic color="gray" pointing="left">
                    {this.state.views}
                  </Label>
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <div className="photoDetail">
                  {/* <h3>Product Placement with one Model, exclusive shooting</h3>
                  <h3 className="shared">
                    <span className="social">
                      <Icon name="youtube official" />
                    </span>
                    <span className="social">
                      <Icon name="facebook official" />
                    </span>
                    <span className="social">
                      <Icon name="instagram official" />
                    </span>
                    <span>Shared on:</span>
                  </h3> */}
                  <p>
                    This Content is created by{" "}
                    <a href="">
                      <b>{selImage.owner}</b>
                    </a>
                    .
                  </p>
                  <p>
                    Releases:{" "}
                    <b>
                      {" "}
                      Has{" "}
                      {selImage.authorizations
                        ? selImage.authorizations.length
                        : ""}{" "}
                      model release
                    </b>
                  </p>
                  <p>
                    Descriptions: <b>{selImage.description}</b>
                  </p>
                  <div className="keywords">
                    <p>Keywords</p>
                    {keywords}
                  </div>
                  {/* <p className="Tax">
                    <span> 1.000 $(Incl. Tax)</span>
                    <span className="fee">
                      <b>Fee: </b>
                    </span>
                  </p>
                  <p className="Tax">
                    <span> Available from firm</span>
                    <span>
                      <b>Invoice: </b>
                    </span>
                  </p>
                  <div className="paymentButtons">
                    <Button size="huge" color="blue">
                      Reserve with Escrow
                    </Button>
                    <Button size="huge" color="blue">
                      Contact the Seller
                    </Button>
                  </div> */}
                  <h3>The User offers this services</h3>
                  <div className="userServiceTable">
                    <Table basic="very" selectable>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell></Table.HeaderCell>
                          <Table.HeaderCell>Service:</Table.HeaderCell>
                          <Table.HeaderCell>Platforms shared</Table.HeaderCell>
                          <Table.HeaderCell>Price</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>

                      <Table.Body>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Dedicated Photoshoots with one Model
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>1.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Dedicated Photoshoots with two Models
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell></Table.Cell>
                          <Table.Cell>2.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Product Placement with one Model, exclusive
                                shooting
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="social">
                              <Icon name="youtube official" />
                            </span>
                            <span className="social">
                              <Icon name="facebook official" />
                            </span>
                            <span className="social">
                              <Icon name="instagram official" />
                            </span>
                          </Table.Cell>
                          <Table.Cell>1.000 $</Table.Cell>
                        </Table.Row>
                        <Table.Row onClick={this.showUserServiceDetail}>
                          <Table.Cell>
                            <Image
                              src="https://picktur.s3.eu-central-1.amazonaws.com/HR_1584239946119-balintathlete453k.jpg"
                              rounded
                              size="tiny"
                            />
                          </Table.Cell>
                          <Table.Cell>
                            <Header as="h4">
                              <Header.Content>
                                Product Placement with one Model, SHared
                                shooting
                              </Header.Content>
                            </Header>
                          </Table.Cell>
                          <Table.Cell>
                            <span className="social">
                              <Icon name="youtube official" />
                            </span>
                            <span className="social">
                              <Icon name="facebook official" />
                            </span>
                            <span className="social">
                              <Icon name="instagram official" />
                            </span>
                          </Table.Cell>
                          <Table.Cell>500 $</Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    </Table>
                  </div>
                </div>
                {/* <div className='photoReleases'>
                <div className='keywords'>
                  <p>Releases</p>
                </div>
              </div>                      */}
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column className="relatedPhotos">
                <a className="relatedPhotosLabel">Same collection photos</a>
                <ImageCarousel photo={this.state.sameCollectionPhotos} />
                <a className="relatedPhotosLabel">Related Photos</a>
                <PhotoList
                  type="home_list"
                  onClickImage={this.handleImageClick}
                  addToBucket={this.addToBucket}
                  activePage={this.state.activePage}
                  totalPages={5}
                  quickView={this.quickView}
                  viewOwner={this.viewOwner}
                />
                <PhotoDetails
                  show={this.state.ImageShow}
                  photo={this.state.modalImageDetail}
                  handleClose={this.CloseImageModal}
                  addToBucket={this.addToBucket}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Modal
            open={this.state.open}
            closeOnEscape={false}
            closeOnDimmerClick={true}
            onClose={this.modalclose}
            className="Basicmodal"
            basic
            size="small"
          >
            <Modal.Content>
              <p>Do you want to download pdf?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button basic color="red" inverted onClick={this.modalclose}>
                <Icon name="remove" /> No
              </Button>
              <Button color="green" inverted onClick={this.downloadPDF}>
                <Icon name="checkmark" /> Yes
              </Button>
            </Modal.Actions>
          </Modal>
        </>
      );
    }
  }
}
export default Photo_details;
