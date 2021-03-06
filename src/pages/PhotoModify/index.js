import React, { Component } from "react";
import {
  Grid,
  Dropdown,
  Icon,
  Message,
  Form,
  Button,
  TextArea,
  Select,
  Accordion,
  Checkbox,
  Popup,
  Input,
  Modal,
  Header,
  Image,
  Label,
  Table,
  Tab
} from "semantic-ui-react";
import { Line } from "react-chartjs-2";
import { Redirect } from "react-router-dom";
import MetaTags from "react-meta-tags";
import {
  getCurrentUser,
  getAllCategories,
  getAllTags,
  getNumberOfPhotos,
  photo_update,
  addAuthorizationToPhotoIDs,
  removeAuthorizationToPhotoIDs,
  addNewTag,
  redeemMultiplePhoto,
  get_data_for_foto_diagram,
  getPhotosInCollection,
  save_update_photo_links,
  get_photo_links
} from "../../util/APIUtils";
import {
  API_BASE_URL,
  ACCESS_TOKEN
} from "../../constants";
import {
  HomeHeader,
  PhotoList,
  AvatarImage,
  ConfirmModal,
} from "../../components";
import {
  ISOFormatDate,
  formatDate,
  CalFirstDay,
  nextDay,
  nextMonth,
  DotFormatDate,
} from "../../util/Helpers";
import "./style.less";
import { notification } from "antd";
import LoadingIndicator from "../../common/LoadingIndicator";
import anchor from "../../assets/images/anchor.gif";
class PhotoModify extends Component {
  constructor(props) {
    super(props);
    this.tagDropbox = React.createRef();
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
      categories: [],
      categories1: [],
      categories2: [],
      tags: [],
      containTags: [],
      activeIndex: 1,
      showOptions: ["unvisible", "visible"],
      modifyAvailability: false,
      photoSelectedFlag: false,
      selImage: {},
      selImageIDs: [],
      pageStatus: "",
      photoOptions: { ImageType: "Photo" },
      changedPhotoOptions: {},
      submit_status: "TO_BE_SUBMITTED",
      activeMenuItem: "ACCEPTED",
      total: {},
      currentTagValues: [],
      currentContainTags: [],
      loginStatus: true,
      errorMessage: [],
      DisplayImageUrl: "",
      ReleaseModalOpen: false,
      NewReleaseModalOpen: false,
      linkModalOpen: false,
      authorization: {},
      releaseFile: {},
      releaseName: "",
      selRelease: [],
      ReleaseScore: [],
      deleteAction: false,
      activeMode: "DAY",
      data: {},
      today: new Date(),
      linkOption: {},
      error: [],
      activeLinkContent: false,
      linkContentType: "",
      photoLinks: [],
      photoLinksTemp: []
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.loadAllTags = this.loadAllTags.bind(this);
    this.getTotalNumberOfPhotos = this.getTotalNumberOfPhotos.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
    this.handleSetPhotoOption = this.handleSetPhotoOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updatePhotoOptions = this.updatePhotoOptions.bind(this);
    this.openReleaseModal = this.openReleaseModal.bind(this);
    this.onChangeFIle = this.onChangeFIle.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleChangeReleasename = this.handleChangeReleasename.bind(this);
    this.newReleaseUpload = this.newReleaseUpload.bind(this);
    this.uploadAndJoinAuthorization = this.uploadAndJoinAuthorization.bind(
      this
    );
    this.onCloseModal = this.onCloseModal.bind(this);
    this.addFromContainedTags = this.addFromContainedTags.bind(this);
    this.handleReleaseTypeChange = this.handleReleaseTypeChange.bind(this);
    this.handleSearchReleaseKeyChange = this.handleSearchReleaseKeyChange.bind(
      this
    );
    this.getCommonRelease = this.getCommonRelease.bind(this);
    this.handleClickAttach = this.handleClickAttach.bind(this);
    this.handleRedeem = this.handleRedeem.bind(this);
    this.addAllContainTags = this.addAllContainTags.bind(this);
    this.confirmModalShow = this.confirmModalShow.bind(this);
    this.confirmModalClose = this.confirmModalClose.bind(this);
    this.deletePhotos = this.deletePhotos.bind(this);
    this.deleteFun = this.deleteFun.bind(this);
    this.loadDataForPhotoDiagram = this.loadDataForPhotoDiagram.bind(this);
    this.modifyPhoto = this.modifyPhoto.bind(this);
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.openLinkModal = this.openLinkModal.bind(this);
    this.linkOptionChange = this.linkOptionChange.bind(this);
    this.getPos = this.getPos.bind(this);
    this.setPos = this.setPos.bind(this);
    this.linkAction = this.linkAction.bind(this);
    this.handleActiveAdd = this.handleActiveAdd.bind(this);
    this.handleActiveEdit = this.handleActiveEdit.bind(this);
    this.handleRemoveLink = this.handleRemoveLink.bind(this);
    this.updatephotoLinks = this.updatephotoLinks.bind(this);
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
    this.loadAllTags();
    this.getTotalNumberOfPhotos();
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
        let categorylist = response.categories.map((category) => {
          return {
            key: category.id,
            value: category.value,
            text: category.value,
          };
        });
        this.setState({
          categories: categorylist,
          categories1: categorylist,
          categories2: categorylist,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  loadAllTags() {
    getAllTags()
      .then((response) => {
        let taglist = response.tags.map((tag) => {
          return {
            key: tag.id,
            value: tag.value,
            text: tag.value,
          };
        });
        this.setState({
          tags: taglist,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  getTotalNumberOfPhotos() {
    getNumberOfPhotos()
      .then((response) => {
        this.setState({
          total: response,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
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

  confirmModalShow() {
    this.setState({
      confirmModalShow: true,
    });
  }

  confirmModalClose() {
    this.setState({
      confirmModalShow: false,
    });
  }

  deletePhotos() {
    getNumberOfPhotos();
    this.setState({
      confirmModalShow: false,
      deleteAction: true,
    });
  }

  deleteFun() {
    this.setState({
      deleteAction: false,
      showOptions: ["unvisible", "visible"],
      selImageIDs: [],
      selImage: [],
    });
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  handleMultiSelectAddition = (e, { value }) => {
    this.setState((prevState) => ({
      tags: [{ text: value, value }, ...prevState.tags],
    }));
  };

  addFromContainedTags(e, { content }) {
    if (this.state.currentTagValues === null) {
      this.state.currentTagValues = [];
    }
    this.state.currentTagValues.push(content);
    this.state.currentContainTags = this.state.currentContainTags.filter(
      (item) => item !== content
    );
    this.setState({
      currentTagValues: this.state.currentTagValues,
      currentContainTags: this.state.currentContainTags,
    });
    // this.tagDropbox.current.target.focus()
    this.tagDropbox.current.setState({
      focus: true,
    });
    this.updatePhotoOptions("Tag");
  }

  addAllContainTags() {
    if (this.state.currentTagValues === null) {
      this.state.currentTagValues = [];
    }
    this.state.currentTagValues = this.state.currentTagValues.concat(
      this.state.currentContainTags
    );
    this.state.currentContainTags = [];
    this.setState({
      currentTagValues: this.state.currentTagValues,
      currentContainTags: this.state.currentContainTags,
    });
    this.tagDropbox.current.setState({
      focus: true,
    });
    this.updatePhotoOptions("Tag");
  }

  handleMultiSelectChange = (e, { value }) => {
    if (value.length < 7) {
      // this.state.errorMessage['tags'] = "Please add at least 7 keywords"
    } else {
      this.state.errorMessage["tags"] = "";
    }
    if (this.state.currentTagValues === null) {
      this.state.currentTagValues = [];
    }
    if (this.state.currentTagValues.length > value.length) {
      var RemoveItem = this.state.currentTagValues;
      for (let i = 0; i < value.length; i++) {
        RemoveItem = RemoveItem.filter((item) => item !== value[i]);
      }
      for (let j = 0; j < this.state.containTags.length; j++) {
        if (RemoveItem[0] === this.state.containTags[j]) {
          this.state.currentContainTags.push(RemoveItem);
          this.setState({
            currentContainTags: this.state.currentContainTags,
          });
          j = this.state.containTags.length;
        }
      }
    } else {
      for (let k = 0; k < this.state.currentContainTags.length; k++) {
        if (this.state.currentContainTags[k] === value[value.length - 1]) {
          this.state.currentContainTags = this.state.currentContainTags.filter(
            (item) => item !== value[value.length - 1]
          );
        }
      }
      var TagScore = 0;
      this.state.tags.forEach((tag, tagindex) => {
        if (tag.value === value[value.length - 1]) {
          TagScore = 1;
        }
      });
      if (TagScore === 0) {
        addNewTag(value[value.length - 1])
          .then((response) => {
            this.state.tags.push({
              key: "",
              value: value[value.length - 1],
              text: value[value.length - 1],
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    this.state.currentTagValues = value;
    this.setState({
      currentContainTags: this.state.currentContainTags,
      currentTagValues: value,
      changedTagValues: value,
      errorMessage: this.state.errorMessage,
    });
    this.updatePhotoOptions("Tag");
  };

  handleClickAttach(name, value) {
    const Request = {
      authorizationId: value + "",
      authorizedPhotos: this.state.selImageIDs,
    };
    this.state.categories2 = this.state.categories;
    this.state.categories1 = this.state.categories;
    if (name === "attachAll" || name === "attach") {
      addAuthorizationToPhotoIDs(Request)
        .then((response) => {
          this.state.ReleaseScore[value] = 1;
          this.setState({
            ReleaseScore: this.state.ReleaseScore,
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    } else if (name === "removeAll" || name === "attached") {
      removeAuthorizationToPhotoIDs(Request)
        .then((response) => {
          if (response.ok) {
            this.state.ReleaseScore[value] = null;
            this.setState({
              ReleaseScore: this.state.ReleaseScore,
            });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }

  getCommonRelease(images, IDs) {
    var ReleaseScore = [];
    var ReleaseNameArray = [];
    if (IDs.length === 1) {
      var authorizations = images[IDs[0]].authorizations;
      for (let j = 0; j < authorizations.length; j++) {
        ReleaseScore[authorizations[j].id] = 1;
        ReleaseNameArray[authorizations[j].id] = authorizations[j].caption;
      }
    } else {
      for (let i = 0; i < IDs.length; i++) {
        var authorizations = images[IDs[i]].authorizations;
        if (authorizations.length === 0) {
          for (let k = 0; k < ReleaseScore.length; k++) {
            if (ReleaseScore[k] === i - 1) {
              ReleaseScore[k] = 0;
            }
          }
        }
        for (let j = 0; j < authorizations.length; j++) {
          if (ReleaseScore[authorizations[j].id] === i - 1) {
            ReleaseScore[authorizations[j].id] = i;
            ReleaseNameArray[authorizations[j].id] = authorizations[j].caption;
          } else {
            ReleaseScore[authorizations[j].id] = 0;
            ReleaseNameArray[authorizations[j].id] = authorizations[j].caption;
          }
        }
      }
    }
    this.setState({
      ReleaseScore,
      ReleaseNameArray,
    });
  }

  //Multiple Image click event

  handleImageClick(e, flag) {
    // this.setState({
    //   containTags: e.photo.containedTags,
    //   currentContainTags: e.photo.containedTags,
    // });
    if (!this.state.selImage[e.photo.id]) {
      this.state.selImage[e.photo.id] = e.photo;
      this.setState({
        selImage: this.state.selImage,
      });
    }
    // flag: check imgae or uncheck image when click Image
    if (flag) {
      this.state.selImageIDs.push(e.photo.id);
      this.setState({
        selImageIDs: this.state.selImageIDs,
      });
    } else {
      this.state.selImageIDs = this.state.selImageIDs.filter(
        (item) => item !== e.photo.id
      );
      this.setState({
        selImageIDs: this.state.selImageIDs,
      });
    }

    // DisplayImageurl when click Image
    if (this.state.selImageIDs.length === 1) {
      this.setState({
        DisplayImageUrl: this.state.selImage[this.state.selImageIDs[0]].url_fr,
      });

      var start = ISOFormatDate(
        CalFirstDay(this.state.activeMode, this.state.today)
      );
      var Request = {
        grouping: "DAY",
        start: start,
        end: ISOFormatDate(this.state.today),
        photoId: e.photo.id,
      };
      this.loadDataForPhotoDiagram(Request);
      get_photo_links(this.state.selImageIDs[0])
        .then(response => {
          this.setState({
            photoLinks: response
          })
        })
        .catch(error => {
          console.log(error)
        })
    } else if (this.state.selImageIDs.length > 1) {
      this.setState({
        DisplayImageUrl: this.state.selImage[this.state.selImageIDs[0]].url_fr,
        photoLinks: []
      });
    }

    // get common category and tags of checked images
    if (this.state.selImageIDs.length > 0) {
      // when there is images which checked
      this.setState({
        showOptions: ["visible", "unvisible"],
        photoSelectedFlag: true,
      });
      if (this.state.selImageIDs.length === 1) {
        var temp_image = this.state.selImage[this.state.selImageIDs[0]];

        this.state.photoOptions["Description"] = temp_image.description
          ? temp_image.description
          : "";
        this.state.photoOptions["Category1"] = temp_image.categories
          ? temp_image.categories[0]
          : null;
        this.state.photoOptions["Category2"] = temp_image.categories
          ? temp_image.categories[1]
          : null;
        this.state.currentTagValues = temp_image.tags;
        this.setState({
          photoOptions: this.state.photoOptions,
          currentTagValues: this.state.currentTagValues,
        });
      } else {
        var tag_flag = [];
        var category_flag1 = [];
        var category_flag2 = [];
        var common_tags = [];
        var common_category = [null, null];
        var desScore = 0;
        for (var i = 0; i < this.state.selImageIDs.length; i++) {
          // common descriptions
          if (
            i > 0 &&
            this.state.selImage[this.state.selImageIDs[i - 1]].description ===
            this.state.selImage[this.state.selImageIDs[i]].description
          ) {
            desScore++;
          }
          // common tags
          var temp_tag = this.state.selImage[this.state.selImageIDs[i]].tags;
          if (temp_tag) {
            for (var j = 0; j < temp_tag.length; j++) {
              if (tag_flag[temp_tag[j]] === i - 1) {
                tag_flag[temp_tag[j]] = i;
              } else {
                tag_flag[temp_tag[j]] = 0;
              }
              if (tag_flag[temp_tag[j]] === this.state.selImageIDs.length - 1) {
                common_tags.push(temp_tag[j]);
              }
            }
          }
          // common categories
          var temp_category = this.state.selImage[this.state.selImageIDs[i]]
            .categories;
          if (temp_category) {
            if (temp_category[0]) {
              if (category_flag1[temp_category[0]] === i - 1) {
                category_flag1[temp_category[0]] = i;
              } else {
                category_flag1[temp_category[0]] = 0;
              }
              if (
                category_flag1[temp_category[0]] ===
                this.state.selImageIDs.length - 1
              ) {
                common_category[0] = temp_category[0];
              }
            }

            if (temp_category[1]) {
              if (category_flag2[temp_category[1]] === i - 1) {
                category_flag2[temp_category[1]] = i;
              } else {
                category_flag2[temp_category[1]] = 0;
              }
              if (
                category_flag2[temp_category[1]] ===
                this.state.selImageIDs.length - 1
              ) {
                common_category[1] = temp_category[1];
              }
            }
          }
        }
        if (common_category.length === 2) {
          this.state.photoOptions["Category1"] = common_category[0];
          this.state.photoOptions["Category2"] = common_category[1];
        } else if (common_category.length === 1) {
          this.state.photoOptions["Category1"] = common_category[0];
          this.state.photoOptions["Category2"] = null;
        } else {
          this.state.photoOptions["Category1"] = null;
          this.state.photoOptions["Category2"] = null;
        }
        if (desScore === this.state.selImageIDs.length - 1) {
          this.state.photoOptions["Description"] = this.state.selImage[
            this.state.selImageIDs[0]
          ].description;
        } else {
          this.state.photoOptions["Description"] = "";
        }
        // set state common category and tags
        this.state.currentTagValues = common_tags;
        this.setState({
          currentTagValues: common_tags,
          common_tag: common_tags,
          photoOptions: this.state.photoOptions,
        });
      }
      if (this.state.photoOptions["Category1"]) {
        var Categories2 = [];
        var pos = this.state.categories2.findIndex(
          (v) => v.value === this.state.photoOptions["Category1"]
        );
        Categories2 = this.state.categories2
          .slice(0, pos)
          .concat(
            this.state.categories2.slice(pos + 1, this.state.categories2.length)
          );
        this.state.categories2 = Categories2;
      }
      if (this.state.photoOptions["Category2"]) {
        var Categories1 = [];
        var pos = this.state.categories1.findIndex(
          (v) => v.value === this.state.photoOptions["Category2"]
        );
        Categories1 = this.state.categories1
          .slice(0, pos)
          .concat(
            this.state.categories1.slice(pos + 1, this.state.categories1.length)
          );
        this.state.categories1 = Categories1;
      }

      this.setState({
        categories1: this.state.categories1,
        categories2: this.state.categories2,
      });

      this.getCommonRelease(this.state.selImage, this.state.selImageIDs);
      this.state.currentTagValues = this.state.currentTagValues
        ? this.state.currentTagValues
        : [];
      // for (let t = 0; t < this.state.currentTagValues.length; t++) {
      //   if (e.photo.containedTags.includes(this.state.currentTagValues[t])) {
      //     e.photo.containedTags = e.photo.containedTags.filter(
      //       (item) => item !== this.state.currentTagValues[t]
      //     );
      //   }
      // }
      // this.setState({
      //   currentContainTags: e.photo.containedTags,
      // });
    } else {
      // when there is not images which checked
      this.setState({
        showOptions: ["unvisible", "visible"],
        photoSelectedFlag: false,
        modifyAvailability: false,
        photoLinks: []
      });
    }
  }

  loadDataForPhotoDiagram(Request) {
    this.setState({
      isDiagramLoading: true,
    });
    get_data_for_foto_diagram(Request)
      .then((response) => {
        this.setDiagramData(Request, response);
        this.setState({
          isDiagramLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isDiagramLoading: false,
        });
      });
  }

  setDiagramData(Request, dataList) {
    var data = {
      labels: [],
      datasets: [
        {
          label: "like",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(255,0,0,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
        {
          label: "View",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(100,255,150,0.4)",
          borderColor: "rgba(100,255,150,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(100,255,150,1)",
          pointHoverBorderColor: "rgba(100,255,150,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
        {
          label: "Download",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
      ],
    };

    if (Request.grouping === "DAY") {
      var start = Request.start;
      for (var i = 0; i < 30; i++) {
        start = nextDay(start);
        data.labels.push(DotFormatDate("DAY", start));
        if (dataList.likedList[DotFormatDate("DAY", start)]) {
          data.datasets[0].data.push(
            dataList.likedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[0].data.push("0");
        }
        if (dataList.viewedList[DotFormatDate("DAY", start)]) {
          data.datasets[1].data.push(
            dataList.viewedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[1].data.push("0");
        }
        if (dataList.downloadedList[DotFormatDate("DAY", start)]) {
          data.datasets[2].data.push(
            dataList.downloadedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[2].data.push("0");
        }
      }
    } else if (Request.grouping === "MONTH") {
      var start = Request.start;
      for (var i = 0; i < 12; i++) {
        data.labels.push(formatDate(start));
        if (dataList.likedList[DotFormatDate("MONTH", start)]) {
          data.datasets[0].data.push(
            dataList.likedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[0].data.push("0");
        }
        if (dataList.viewedList[DotFormatDate("MONTH", start)]) {
          data.datasets[1].data.push(
            dataList.viewedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[1].data.push("0");
        }
        if (dataList.downloadedList[DotFormatDate("MONTH", start)]) {
          data.datasets[2].data.push(
            dataList.downloadedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[2].data.push("0");
        }
        start = nextMonth(start);
      }
    }
    this.setState({ data: data });
  }

  // Menu click

  handleMenuItemClick = (e, { name }) => {
    this.setState({
      activeMenuItem: name,
      selImage: [],
      selImageIDs: [],
      common_tag: [],
      showOptions: ["unvisible", "visible"],
    });
  };

  // when change some photoptions

  handleSetPhotoOption = (e, { name, value }) => {
    this.arr_options = this.state.photoOptions;
    this.arr_options[name] = value;
    this.state.changedPhotoOptions[name] = value;
    this.state.errorMessage[name] = "";

    if (name === "Category1") {
      this.state.categories2 = this.state.categories;
      var Categories2 = [];
      var pos = this.state.categories2.findIndex((v) => v.value === value);
      Categories2 = this.state.categories2
        .slice(0, pos)
        .concat(
          this.state.categories2.slice(pos + 1, this.state.categories2.length)
        );
      this.state.categories2 = Categories2;
    }
    if (name === "Category2") {
      this.state.categories1 = this.state.categories;
      var Categories1 = [];
      var pos = this.state.categories1.findIndex((v) => v.value === value);
      Categories1 = this.state.categories1
        .slice(0, pos)
        .concat(
          this.state.categories1.slice(pos + 1, this.state.categories1.length)
        );
      this.state.categories1 = Categories1;
    }

    this.setState({
      photoOptions: this.arr_options,
      changedPhotoOptions: this.state.changedPhotoOptions,
      errorMessage: this.state.errorMessage,
      categories1: this.state.categories1,
      categories2: this.state.categories2,
    });
    // if(name === 'Category1' || name === 'Category2'){
    //   for(let i=0; i< this.state.categories.length; i++)
    //   {
    //     if(this.state.categories[i].value === this.arr_options[name])
    //     {
    //       this.state.categories.splice(i,1);
    //       i=this.state.categories.length;
    //     }
    //   }
    //   this.setState({
    //     categories: this.state.categories
    //   })
    // }
    this.updatePhotoOptions(name);
  };

  handleCheck = (e, { name, value }) => {
    this.isChecked = !this.isChecked;
    this.state.photoOptions[name] = this.isChecked;
    this.arr_options = this.state.photoOptions;
    this.setState({
      photoOptions: this.arr_options,
    });
  };
  handleRadioChange = (e, { value }) => {
    this.setState({
      ReleaseTypevalue: value,
    });
  };
  handleChangeReleasename = (e, { value }) => {
    this.setState({
      releaseName: value,
    });
  };
  // when click submit button

  handleSubmit() {
    var updateRequest = [];

    for (let i = 0; i < this.state.selImageIDs.length; i++) {
      this.state.selImage[
        this.state.selImageIDs[i]
      ].published = this.state.photoOptions["published"];
      this.setState({
        selImage: this.state.selImage,
      });
      updateRequest.push({
        photoDto: this.state.selImage[this.state.selImageIDs[i]],
      });
    }
    photo_update(updateRequest)
      .then((response) => {
        notification.success({
          message: "Photoing App",
          description: "Successfully photos updated.",
        });
      })
      .catch((error) => {
        notification.error({
          message: "Photoing App",
          description: "Something went wrong. Please try again!",
        });
      });
  }

  handleRedeem() {
    redeemMultiplePhoto(this.state.selImageIDs)
      .then((response) => {
        this.getTotalNumberOfPhotos();
        this.setState({
          activeMenuItem: "TO_BE_SUBMITTED",
          // total: this.state.total
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // update photo options

  updatePhotoOptions(name) {
    // this.tagDropbox.current.setState({
    //   focus: false
    // })
    this.setState({
      common_tag: this.state.currentTagValues,
    });
    const updateRequest = [];
    for (let i = 0; i < this.state.selImageIDs.length; i++) {
      var temp_options = this.state.selImage[this.state.selImageIDs[i]];
      if (name === "Description") {
        temp_options.description = this.state.photoOptions["Description"];
      }
      // update categories
      else if (name === "Category1" || name === "Category2") {
        if (!temp_options.categories) {
          temp_options.categories = [];
          temp_options.categories.push(this.state.photoOptions["Category1"]);
          temp_options.categories.push(this.state.photoOptions["Category2"]);
        } else {
          if (!temp_options.categories[1]) {
            temp_options.categories[1] = null;
          }
          temp_options.categories[0] = this.state.photoOptions["Category1"]
            ? this.state.photoOptions["Category1"]
            : temp_options.categories[0];
          temp_options.categories[1] = this.state.photoOptions["Category2"]
            ? this.state.photoOptions["Category2"]
            : temp_options.categories[1];
        }

        temp_options.categories = temp_options.categories.filter(
          (item) => item !== null
        );
      }

      //update tags
      else if (name === "Tag") {
        var temp_flags = [];
        var tem_tag = this.state.common_tag;
        if (!tem_tag) {
          temp_options.tags = this.state.currentTagValues;
        } else {
          if (tem_tag.length > 0) {
            for (let j = 0; j < tem_tag.length; j++) {
              temp_flags[tem_tag[j]] = 1;
            }

            for (let k = 0; k < this.state.currentTagValues.length; k++) {
              if (temp_flags[this.state.currentTagValues[k]] !== 1) {
                temp_options.tags.push(this.state.currentTagValues[k]);
              } else {
                tem_tag = tem_tag.filter(
                  (item) => item !== this.state.currentTagValues[k]
                );
              }
            }
            for (let h = 0; h < tem_tag.length; h++) {
              temp_options.tags = temp_options.tags.filter(
                (item) => item !== tem_tag[h]
              );
            }
          } else {
            if (!temp_options.tags) {
              temp_options.tags = [];
            }
            if (!this.state.currentTagValues) {
              this.state.currentTagValues = [];
            }
            if (this.state.selImageIDs.length === 1) {
              temp_options.tags = [];
            }
            for (
              let index = 0;
              index < this.state.currentTagValues.length;
              index++
            ) {
              temp_options.tags.push(this.state.currentTagValues[index]);
            }
          }
        }
      }

      this.state.selImage[this.state.selImageIDs[i]] = temp_options;
    }

    this.setState({ selImage: this.state.selImage });
  }

  newReleaseUpload() {
    if (this.state.releaseName === "") {
      alert("Put Release caption");
    } else if (!this.state.ReleaseTypevalue) {
      alert("select Release Type");
    } else {
      this.state.authorization.caption = this.state.releaseName;
      this.state.authorization.authorizedPhotosld = this.state.selImageIDs;
      this.state.authorization.authorizationKind = this.state.ReleaseTypevalue;
      this.setState({
        authorization: this.state.authorization,
      });
      this.uploadAndJoinAuthorization(this.state.authorization);
    }
  }

  uploadAndJoinAuthorization(authorization) {
    var myHeaders = new Headers({});
    if (localStorage.getItem(ACCESS_TOKEN)) {
      myHeaders.append(
        "Authorization",
        "Bearer " + localStorage.getItem(ACCESS_TOKEN)
      );
    }
    const formData = new FormData();
    formData.append("caption", authorization.caption);
    formData.append("authorizationKind", authorization.authorizationKind);
    formData.append("files", this.state.releaseFile);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formData,
      redirect: "follow",
    };
    fetch(
      API_BASE_URL + "/authorization_controller/upload_authorization",
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          this.setState({
            NewReleaseModalOpen: false,
            isLoading: false,
            ReleaseModalOpen: true,
          });
        }
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  handleReleaseTypeChange(e, { name, value }) {
    this.setState({
      ReleaseType: value,
    });
  }

  handleSearchReleaseKeyChange(e, { value }) {
    this.setState({
      searchReleaseKey: value,
    });
  }

  onChangeFIle(e) {
    this.setState({
      ReleaseModalOpen: false,
      NewReleaseModalOpen: true,
      releaseFile: e.target.files[0],
      releaseName: e.target.files[0].name.split(".")[0],
    });
  }
  openReleaseModal() {
    this.setState({
      ReleaseModalOpen: true,
    });
  }
  onCloseModal() {
    this.setState({
      ReleaseModalOpen: false,
      NewReleaseModalOpen: false,
      linkModalOpen: false,
      linkOption: {},
      photoLinks: this.state.photoLinksTemp
    });
  }

  modifyPhoto() {
    this.setState({
      modifyAvailability: true,
    });
  }

  handleChangeMode(e, { value }) {
    this.setState({
      activeMode: value,
    });
    var start = ISOFormatDate(CalFirstDay(value, this.state.today));
    var Request = {
      grouping: value,
      start: start,
      end: ISOFormatDate(this.state.today),
      photoId: this.state.selImageIDs[0],
    };
    this.loadDataForPhotoDiagram(Request);
  }

  handleSearchTag(e) {
    this.props.history.push("/?tag=" + e);
  }

  clickSearch(e) {
    this.props.history.push("/?key=" + e);
  }

  openLinkModal() {
    this.setState({
      linkModalOpen: true
    })
  }

  handleActiveAdd() {
    this.state.linkOption['icon'] = ""
    this.setState({
      activeLinkContent: true,
      linkContentType: "Add",
      linkOption: this.state.linkOption,
      selectedPhotoLink: null
    })
  }

  handleActiveEdit(e) {
    this.setState({
      activeLinkContent: true,
      linkContentType: "Edit",
      linkOption: this.state.photoLinks[e.target.id],
      selectedPhotoLink: parseInt(e.target.id)
    })
  }

  handleRemoveLink(e) {
    var key = parseInt(e.target.id);
    var temp = this.state.photoLinks.slice(0, key).concat(this.state.photoLinks.slice(key + 1, this.state.photoLinks.length));
    this.setState({
      photoLinks: temp
    })
  }

  getPos(e) {
    var imagePosInfo = e.currentTarget.getBoundingClientRect();
    this.setState({
      posX: Math.floor((e.clientX - imagePosInfo.x) / imagePosInfo.width * 100),
      posY: Math.floor((e.clientY - imagePosInfo.y) / imagePosInfo.height * 100)
    })
  }

  setPos() {
    this.state.linkOption['x'] = this.state.posX;
    this.state.linkOption['y'] = this.state.posY;
    this.setState({
      linkOption: this.state.linkOption
    })
  }

  linkOptionChange(e, { value, name }) {
    this.state.linkOption[name] = value;
    if (value !== "") {
      this.state.error[name] = false;
    } else {
      this.state.error[name] = true;
    }
    this.setState({
      linkOptionChange: this.state.linkOption,
      error: this.state.error
    })

  }

  linkAction() {
    if (!this.state.linkOption['x'] || !this.state.linkOption['y']) {
      notification.error({
        message: "Openshoots",
        description: "Please set link position of photo. Try again.",
      });
    } else if (!this.state.linkOption['link'] || this.state.linkOption['link'] === "") {
      this.state.error['link'] = true;
      this.setState({
        error: this.state.error
      })
      notification.error({
        message: "Openshoots",
        description: "Please put link address.",
      });
    } else if (!this.state.linkOption['description'] || this.state.linkOption['description'] === "") {
      this.state.error['description'] = true;
      this.setState({
        error: this.state.error
      })
      notification.error({
        message: "Openshoots",
        description: "Please put description about link.",
      });
    } else {
      if (this.state.linkContentType === "Add") {
        this.state.photoLinks.push(this.state.linkOption)
      } else if (this.state.linkContentType === "Edit") {
        this.state.photoLinks[this.state.selectedPhotoLink] = this.state.linkOption
      }
      this.setState({
        activeLinkContent: false,
        photoLinks: this.state.photoLinks,
        linkOption: {}
      })
    }
  }

  updatephotoLinks() {
    var Request = {
      "photoId": this.state.selImageIDs[0],
      "hotSpots": this.state.photoLinks
    }
    this.setState({
      isButtonLoading: true
    })
    save_update_photo_links(Request)
      .then(response => {
        if (response.ok) {
          this.setState({
            linkModalOpen: false,
            linkOption: {},
            photoLinksTemp: this.state.photoLinks,
            isButtonLoading: false
          })
          notification.success({
            message: "Openshoots",
            description: "Successfully updated photo links.",
          });
        } else {
          notification.error({
            message: "Openshoots",
            description: "Something went wrong. Please try again.",
          });
          this.setState({
            isButtonLoading: false
          })
        }
      })
      .catch(error => {
        console.log(error)
        notification.error({
          message: "Openshoots",
          description: "Something went wrong. Please try again.",
        });
        this.setState({
          isButtonLoading: false
        })
      })
  }

  render() {
    const { activeIndex, activeItem } = this.state;
    const keywords = [];
    const commonReleases = [];
    const photoLinksArray = [];
    const ViewMode = [
      { key: "day", value: "DAY", text: "Daily" },
      // { key: 'week', value: 'WEEK', text: 'Weekly' },
      { key: "month", value: "MONTH", text: "Monthly" },
    ];

    this.state.ReleaseScore.forEach((Release, ReleaseIndex) => {
      if (Release > 0) {
        commonReleases.push(
          <Button
            className="releaseIcons"
            type="button"
            size="mini"
            content={this.state.ReleaseNameArray[ReleaseIndex]}
            icon="id card"
            labelPosition="left"
          />
        );
      }
    });
    this.state.currentContainTags.forEach((tag, tagIndex) => {
      keywords.push(
        <Button
          type="button"
          size="mini"
          content={tag}
          icon="plus"
          labelPosition="right"
          onClick={this.addFromContainedTags}
        />
      );
    });

    this.state.photoLinks.forEach((photoLink, index) => {
      photoLinksArray.push(
        <Table.Row>
          <Table.Cell>{index + 1}</Table.Cell>
          <Table.Cell><img width="30px" height="30px" src={anchor} /></Table.Cell>
          <Table.Cell>{photoLink.description}</Table.Cell>
          <Table.Cell><a href={photoLink.link}>{photoLink.link}</a></Table.Cell>
          <Table.Cell>
            <Icon id={index} name='edit' onClick={this.handleActiveEdit} />
            <Icon id={index} name="trash" onClick={this.handleRemoveLink} />
          </Table.Cell>
        </Table.Row>
      )
    })

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
        <Grid className="pages page-index modify_page">
          <Grid.Row className="content_title">
            <Grid.Column width="8">
              <h2>My Published Photos</h2>
            </Grid.Column>
            {this.state.selImageIDs.length > 0 &&
              this.state.activeMenuItem !== "ACCEPTED" ? (
                <Grid.Column className="selectedShowContent right" width="8">
                  <span>{this.state.selImageIDs.length} selected files</span>
                  <Button negative onClick={this.confirmModalShow}>
                    DELETE
                </Button>
                  <ConfirmModal
                    modalHeader="Delete Files"
                    modalContent="Do you really delete selected files?"
                    modalOpen={this.state.confirmModalShow}
                    modalClose={this.confirmModalClose}
                    handleOK={this.deletePhotos}
                  />
                </Grid.Column>
              ) : null}
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10} className="image_section">
              {/* <Grid.Row>
                <Grid.Column>
                  <Menu borderless className="desktop-menu-style">
                    <Menu.Item position="left" style={style.noPaddingStyle}>
                      <Menu.Item name='TO_BE_SUBMITTED' active={this.state.activeMenuItem === 'TO_BE_SUBMITTED'} onClick={this.handleMenuItemClick}>
                        To submit({this.state.total.toBeSubmitted})
                      </Menu.Item>
                      <Menu.Item name='SUBMITTED' active={this.state.activeMenuItem === 'SUBMITTED'} onClick={this.handleMenuItemClick}>
                        Pending({this.state.total.submitted})
                      </Menu.Item>
                      <Menu.Item className='' name='ACCEPTED' active={this.state.activeMenuItem === 'ACCEPTED'} onClick={this.handleMenuItemClick}>
                        Accepted({this.state.total.accepted})
                      </Menu.Item>
                      <Menu.Item className='ReviewedMenu' name='REJECTED' active={this.state.activeMenuItem === 'REJECTED'} onClick={this.handleMenuItemClick}>
                        Rejected({this.state.total.rejected})
                      </Menu.Item>
                      <Dropdown item text="Images">
                        <Dropdown.Menu>
                          <Dropdown.Item as={NavLink} to='/'>Images</Dropdown.Item>
                          <Dropdown.Item as={NavLink} to='/'>Videos</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                      <Menu.Item position='right'>
                        <Dropdown item text="Newest">
                          <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to='/'>Newest</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to='/'>Oldest</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu.Item>
                  </Menu>
                </Grid.Column>
              </Grid.Row> */}
              <Grid.Row>
                {this.state.activeMenuItem === "TO_BE_SUBMITTED" ? (
                  <Message attached="top" className="welcomeMessage" positive>
                    <Icon name="check circle" />
                    Welcome! Let's get your content approved. Select an item to
                    add details and submit for review&nbsp;
                    <a href="#">Learn more</a>&nbsp;
                  </Message>
                ) : null}

                <div></div>
              </Grid.Row>
              <Grid.Row>
                <PhotoList
                  onClickImage={this.handleImageClick}
                  username={this.state.currentUser.username}
                  type="userPhoto"
                  status={this.state.activeMenuItem}
                  delete={this.state.deleteAction}
                  deleteFun={this.deleteFun}
                  currentUser={this.state.currentUser}
                />
              </Grid.Row>
            </Grid.Column>
            <Grid.Column width={6} className="image_options">
              <div
                className={
                  this.state.modifyAvailability && this.state.photoSelectedFlag
                    ? "visible"
                    : "unvisible"
                }
              >
                <Grid.Row>
                  <Form>
                    <Grid.Column className="image_option" width={3}>
                      <div class="column avatarImage">
                        <AvatarImage
                          url={this.state.DisplayImageUrl}
                          name="Image.jpg"
                        />
                        <a target="blank" href={this.state.DisplayImageUrl}>
                          <Icon
                            name="search plus"
                            className="center"
                            size="large"
                          />
                        </a>
                      </div>
                      <div class="column">
                        <Form.Field>
                          <label>
                            Image type
                            <Popup
                              trigger={
                                <Icon name="question circle" size="large" />
                              }
                              content="Illustrations include scanned artwork, digitally produced illustrations, 3d renderings, and composites"
                              position="bottom center"
                            />
                          </label>
                          <Button
                            id={
                              this.state.photoOptions["ImageType"] === "Photo"
                                ? "activate"
                                : ""
                            }
                            type="button"
                            name="ImageType"
                            value="Photo"
                            onClick={this.handleSetPhotoOption}
                          >
                            Photo
                          </Button>
                          <Button
                            id={
                              this.state.photoOptions["ImageType"] ===
                                "Illustration"
                                ? "activate"
                                : ""
                            }
                            type="button"
                            name="ImageType"
                            value="Illustration"
                            onClick={this.handleSetPhotoOption}
                          >
                            Illustration
                          </Button>
                        </Form.Field>
                      </div>
                      {/* <div class="column">
                      <Form.Field>
                        <label>Usage 
                          <Popup
                            trigger={<Icon name='question circle' size="large"/>}
                            content='Editorial content is newsworthy or of public interest'
                            position='bottom center'
                          />
                        </label>
                        <Button id={this.state.photoOptions['Usage'] === 'Commercial' ? 'activate' : ''} type='button' name='Usage' value="Commercial" onClick={this.handleSetPhotoOption} disabled={this.state.activeMenuItem !== 'TO_BE_SUBMITTED'} >Commercial</Button>
                        <Button id={this.state.photoOptions['Usage'] === 'Editorial' ? 'activate' : ''} type='button' name='Usage' value='Editorial' onClick={this.handleSetPhotoOption} disabled={this.state.activeMenuItem !== 'TO_BE_SUBMITTED'}>Editorial</Button>

                      </Form.Field>
                    </div> */}
                      <div class="column">
                        <Form.Field>
                          <div class="label">Description</div>
                          <TextArea
                            rows={1}
                            placeholder="Descriptions"
                            name="Description"
                            value={this.state.photoOptions["Description"]}
                            required
                            onChange={this.handleSetPhotoOption}
                          />
                          <div class="label error">
                            {this.state.errorMessage["Description"]}
                          </div>
                        </Form.Field>
                      </div>
                      <div class="column">
                        <Form.Field>
                          <div class="label">Follow Instagram link</div>
                          <Input
                            placeholder="Follow Instagram link"
                            name="FollowIGLink"
                            value={this.state.photoOptions["FollowIGLink"]}
                            required
                            onChange={this.handleSetPhotoOption}
                          />
                          <div class="label error">
                            {this.state.errorMessage["Description"]}
                          </div>
                        </Form.Field>
                      </div>
                      <div class="column">
                        <Form.Field>
                          <div class="label">Collection</div>
                          <Select
                            placeholder="Collection"
                            options={this.state.categories}
                            name="Category1"
                            value={this.state.photoOptions["Collection"]}
                            onChange={this.handleSetPhotoOption}
                          />
                          <div class="label error">
                            {this.state.errorMessage["Collection"]}
                          </div>
                        </Form.Field>
                      </div>
                      {/* <div class="column">
                      <Form.Field>
                      <div class="label">Category 1</div>
                        <Select placeholder='Category 1' options={this.state.categories1} name="Category1" value={this.state.photoOptions['Category1']} onChange={this.handleSetPhotoOption} disabled={this.state.activeMenuItem !== 'TO_BE_SUBMITTED'}/>
                        <div class='label error'>{this.state.errorMessage['Category1']}</div>
                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                      <div class="label">Category 2(optional)</div>
                        <Select placeholder='Category 2(optional)' options={this.state.categories2} name="Category2" value={this.state.photoOptions['Category2']} onChange={this.handleSetPhotoOption} disabled={(this.state.photoOptions['Category1'] &&  this.state.activeMenuItem === 'TO_BE_SUBMITTED') ? false : true}/>
                      </Form.Field>
                    </div> */}
                      <div class="column">
                        <Form.Field required>
                          <div class="label">Location(optional)</div>
                          <input
                            type="text"
                            placeholder="Location(optional)"
                            name="Location"
                            value={this.state.photoOptions["Location"]}
                            required
                            onChange={this.handleSetPhotoOption}
                          />
                          <Popup
                            trigger={
                              <Icon
                                name="question circle"
                                className="bottom"
                                size="large"
                                color="grey"
                              />
                            }
                            content={
                              <span>
                                Select the geographic location shown in your
                                photo. Be specific: select neighborhoods, towns,
                                or cities. In the future, location data will
                                power new search and filtering options for
                                customers. <a href="#">Learn more</a>
                              </span>
                            }
                            position="bottom center"
                            on="click"
                          />
                        </Form.Field>
                      </div>
                      <div class="column">
                        <Form.Field>
                          <Accordion fluid styled>
                            <Accordion.Title
                              className="label"
                              active={activeIndex === 0}
                              index={0}
                              onClick={this.handleAccordionClick}
                            >
                              {" "}
                              More options(as needed)
                              <Icon name="angle down" />
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0}>
                              <Select
                                placeholder="Notes for reviewer"
                                className="left fullwidth"
                                name="NotesForReviewer"
                                value={
                                  this.state.photoOptions["NotesForReviewer"]
                                }
                                onChange={this.handleSetPhotoOption}
                              />
                              <div class="check">
                                <Checkbox
                                  className="black left fullwidth"
                                  label="Mature content"
                                  name="MatureContent"
                                  value={
                                    this.state.photoOptions["MatureContent"]
                                  }
                                  onChange={this.handleCheck}
                                />
                                <Popup
                                  trigger={
                                    <Icon
                                      name="question circle"
                                      className="center"
                                      size="large"
                                    />
                                  }
                                  content="Mature content contains nudity. sexual or suggestive content, or offensive language."
                                  position="bottom center"
                                />
                              </div>
                            </Accordion.Content>
                          </Accordion>
                        </Form.Field>
                      </div>
                      <div className="column">
                        publish/unpublish:{" "}
                        <Checkbox
                          value={this.state.photoOptions["published"]}
                          onChange={this.handleCheck}
                          name="published"
                          toggle
                        />
                      </div>
                      {
                        this.state.selImageIDs.length === 1 ?
                          <div className="column">
                            <Button color="blue" type="button" onClick={this.openLinkModal}>Links</Button>
                          </div>
                          : null
                      }
                    </Grid.Column>
                    <Grid.Column className="image_option" width={3}>
                      <Form.Field>
                        <div class="label">Keywords</div>
                        <div>
                          <Dropdown
                            options={this.state.tags}
                            placeholder="Choose Keywords"
                            search
                            selection
                            fluid
                            multiple
                            allowAdditions
                            // openOnFocus={false}
                            value={this.state.currentTagValues}
                            onAddItem={this.handleMultiSelectAddition}
                            onChange={this.handleMultiSelectChange}
                            ref={this.tagDropbox}
                          />
                          <div class="column">
                            <div class="label error">
                              {this.state.errorMessage["tags"]}
                            </div>
                          </div>
                        </div>
                      </Form.Field>
                      <Form.Field>
                        <div class="label">
                          Keyword Suggestions
                          <Popup
                            trigger={
                              <Icon
                                name="plus"
                                size="large"
                                onClick={this.addAllContainTags}
                              />
                            }
                            content="Add all contained tags"
                            position="bottom right"
                          />
                        </div>
                        <div className="suggestKeywords">
                          {this.state.activeMenuItem === "TO_BE_SUBMITTED"
                            ? keywords
                            : null}
                        </div>
                      </Form.Field>
                    </Grid.Column>
                  </Form>
                </Grid.Row>
                <Grid.Column>
                  <Button
                    className="submitButton"
                    onClick={this.handleSubmit}
                    fluid
                    negative
                  >
                    Update
                  </Button>
                </Grid.Column>
              </div>
              <div
                className={
                  this.state.modifyAvailability ? "unvisible" : "visible"
                }
              >
                <Grid.Row
                  className={
                    this.state.selImageIDs.length === 1 ? "chart" : "unvisible"
                  }
                >
                  <a>ViewMode:</a>{" "}
                  <Select
                    placeholder="Select view mode"
                    value={this.state.activeMode}
                    options={ViewMode}
                    onChange={this.handleChangeMode}
                  />
                  {this.state.isDiagramLoading ? (
                    <LoadingIndicator />
                  ) : (
                      <Line
                        className={
                          this.state.selImageIDs.length === 1
                            ? "visible"
                            : "invisible"
                        }
                        ref="chart"
                        data={this.state.data}
                      />
                    )}
                </Grid.Row>
                <Grid.Row className="imageOption_Blank">
                  <Button
                    className="modify_button"
                    primary
                    onClick={this.modifyPhoto}
                    disabled={!this.state.photoSelectedFlag}
                  >
                    Modify
                  </Button>
                  <h3>Select an item to add details</h3>
                  <p>Tip: Select multiple items by</p>
                  <p> "Command/Control".</p>
                </Grid.Row>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Modal open={this.state.linkModalOpen} className="LinkModal">
          <Modal.Header>ADD Link to Photo</Modal.Header>
          <div className="ListofLinks">
            <p style={{ textAlign: "right" }}>
              <Button
                positive
                labelPosition='right'
                icon='add circle'
                content='Add'
                onClick={this.handleActiveAdd}
              />
            </p>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>No</Table.HeaderCell>
                  <Table.HeaderCell>Icon</Table.HeaderCell>
                  <Table.HeaderCell>Description</Table.HeaderCell>
                  <Table.HeaderCell>Link</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {photoLinksArray}
              </Table.Body>
            </Table>
          </div>
          <Modal.Content className={!this.state.activeLinkContent ? "unvisible" : ""} image>
            <div className="ImageForLinks">
              <Image wrapped size='medium' src={this.state.DisplayImageUrl} onMouseMove={this.getPos} onClick={this.setPos} />
            </div>
            <Modal.Description className="Description">
              <Form className="addLinkForm">
                <p>
                  <Input labelPosition='right' type='text' placeholder='Amount' disabled value={this.state.linkOption['x'] ? this.state.linkOption['x'] : ""}>
                    <Label basic>X:</Label>
                    <input />
                    <Label>%</Label>
                  </Input>
                </p>
                <p>
                  <Input labelPosition='right' type='text' placeholder='Amount' disabled value={this.state.linkOption['y'] ? this.state.linkOption['y'] : ""}>
                    <Label basic>Y:</Label>
                    <input />
                    <Label>%</Label>
                  </Input>
                </p>
                <p>
                  <span>Link Address </span><Input error={this.state.error['link']} fluid placeholder='link address' name="link" value={this.state.linkOption['link'] ? this.state.linkOption['link'] : ""} onChange={this.linkOptionChange} />
                </p>
                <p>
                  <span>Description: </span><Form.TextArea error={this.state.error['description']} placeholder='description' style={{ minHeight: 100 }} name="description" value={this.state.linkOption['description'] ? this.state.linkOption['description'] : ""} onChange={this.linkOptionChange} />
                </p>
                <span>Icon: </span> <input type="file" />
                <p style={{ textAlign: "right" }}><Button type="button" color="blue" onClick={this.linkAction} > {this.state.linkContentType} </Button></p>
              </Form>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.onCloseModal} negative>
              No
            </Button>
            <Button
              onClick={this.close}
              positive
              labelPosition='right'
              icon='checkmark'
              content='Update'
              onClick={this.updatephotoLinks}
              loading={this.state.isButtonLoading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default PhotoModify;
