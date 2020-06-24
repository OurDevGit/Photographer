import React, { Component } from "react";
import {
  Input,
  Button,
  Modal,
  Form,
  Grid,
  Checkbox,
} from "semantic-ui-react";
import { API_BASE_URL, ACCESS_TOKEN } from "../../../constants";
import {
  get_banners_for_admin,
  deactivate_banner,
  activate_banner
} from "../../../util/APIUtils";
import "./style.less";
import { notification } from "antd";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ISOFormatDate } from "../../../util/Helpers";
import LoadingIndicator from "../../../common/LoadingIndicator";
class Banners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      banners: [],
      visible: "",
      open: false,
      startDate: new Date(),
      ImageUrl: "",
      ImageFile: null,
      bannerData: [],
      error: [],
      isButtonLoading: false,
      type: "Add",
      selectedBannerID: "",
    };
    this.openModalForAddBanner = this.openModalForAddBanner.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangeImageFile = this.handleChangeImageFile.bind(this);
    this.handleBannerAction = this.handleBannerAction.bind(this);
    this.handleChangebannerData = this.handleChangebannerData.bind(this);
    this.showEditModal = this.showEditModal.bind(this);
    this.loadBanners = this.loadBanners.bind(this);
    this.activeBannerAction = this.activeBannerAction.bind(this);
  }
  componentDidMount() {
    this.loadBanners();
  }

  loadBanners() {
    this.setState({
      isLoading: true,
    });
    get_banners_for_admin()
      .then((response) => {
        this.setState({
          banners: response,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
        console.log(error);
      });
  }

  openModalForAddBanner() {
    this.setState({
      open: true,
      type: "Add",
    });
  }

  showEditModal(e) {
    this.state.bannerData["redirect"] = this.state.banners[
      e.target.id
    ].redirect;
    this.state.bannerData["description"] = this.state.banners[
      e.target.id
    ].description;
    this.state.bannerData["maxViews"] = this.state.banners[
      e.target.id
    ].maxViews;
    this.state.bannerData["maxOpens"] = this.state.banners[
      e.target.id
    ].maxOpens;
    this.state.bannerData["newTab"] = this.state.banners[e.target.id].newTab;
    this.state.bannerData["homepage"] = this.state.banners[
      e.target.id
    ].homepage;
    this.state.bannerData["active"] = this.state.banners[e.target.id].active;
    this.setState({
      open: true,
      type: "Edit",
      bannerData: this.state.bannerData,
      ImageUrl: this.state.banners[e.target.id].address,
      startDate: new Date(this.state.banners[e.target.id].campaignEnd),
      selectedBannerID: this.state.banners[e.target.id].id,
    });
  }

  closeModal() {
    this.setState({
      open: false,
      bannerData: [],
      error: [],
      ImageFile: null,
      ImageUrl: "",
      selectedBannerID: "",
      startDate: new Date(),
    });
  }

  handleChange = (date) => {
    if (date === null) {
      this.state.error["date"] = true;
    } else {
      this.state.error["date"] = false;
    }
    this.setState({
      startDate: date,
      error: this.state.error,
    });
  };

  handleChangeImageFile(e) {
    this.state.error["file"] = false;
    this.setState({
      ImageUrl: URL.createObjectURL(e.target.files[0]),
      ImageFile: e.target.files[0],
      error: this.state.error,
    });
  }

  handleChangebannerData(e, { name, value, checked }) {
    if (!e.target.type) {
      this.state.bannerData[name] = checked;
    } else {
      this.state.bannerData[name] = value;
      if (value === "") {
        this.state.error[name] = true;
      } else {
        this.state.error[name] = false;
      }
    }
    this.setState({
      bannerData: this.state.bannerData,
      error: this.state.error,
    });
  }

  handleBannerAction() {
    var errorNum = 0;
    if (
      !this.state.bannerData["redirect"] ||
      this.state.bannerData["redirect"] === ""
    ) {
      errorNum++;
      this.state.error["redirect"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (
      !this.state.bannerData["description"] ||
      this.state.bannerData["description"] === ""
    ) {
      errorNum++;
      this.state.error["description"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (
      !this.state.bannerData["maxOpens"] ||
      this.state.bannerData["maxOpens"] === ""
    ) {
      errorNum++;
      this.state.error["maxOpens"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (
      !this.state.bannerData["maxViews"] ||
      this.state.bannerData["maxViews"] === ""
    ) {
      errorNum++;
      this.state.error["maxViews"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (!this.state.startDate) {
      errorNum++;
      this.state.error["date"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (!this.state.ImageUrl) {
      errorNum++;
      this.state.error["file"] = true;
      this.setState({
        error: this.state.error,
      });
    }
    if (errorNum > 0) {
      notification.error({
        message: "openshoots",
        description: "Please put on required field.",
      });
    } else {
      var Request = {};
      if (this.state.type === "Add") {
        Request = {
          redirect: this.state.bannerData["redirect"],
          homepage: this.state.bannerData["homepage"] ? true : false,
          description: this.state.bannerData["description"],
          importance: 0.13,
          maxViews: parseInt(this.state.bannerData["maxViews"]),
          maxOpens: parseInt(this.state.bannerData["maxOpens"]),
          campaignEnd: ISOFormatDate(this.state.startDate),
          active: true,
          newTab: this.state.bannerData["newTab"] ? true : false,
        };
      } else {
        Request = {
          id: this.state.selectedBannerID,
          redirect: this.state.bannerData["redirect"],
          homepage: this.state.bannerData["homepage"] ? true : false,
          description: this.state.bannerData["description"],
          importance: 0.13,
          maxViews: parseInt(this.state.bannerData["maxViews"]),
          maxOpens: parseInt(this.state.bannerData["maxOpens"]),
          campaignEnd: ISOFormatDate(this.state.startDate),
          active: true,
          newTab: this.state.bannerData["newTab"] ? true : false,
        };
      }

      var bannerDto = new Blob([JSON.stringify(Request)], {
        type: "application/json",
      });
      const myHeaders = new Headers({});
      if (localStorage.getItem(ACCESS_TOKEN)) {
        myHeaders.append(
          "Authorization",
          "Bearer " + localStorage.getItem(ACCESS_TOKEN)
        );
      }
      const formData = new FormData();
      formData.append("bannerDto", bannerDto);
      if (this.state.ImageFile) {
        formData.append("file", this.state.ImageFile);
      }
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: formData,
        redirect: "follow",
      };
      this.setState({
        isButtonLoading: true,
      });
      var url =
        this.state.type === "Add"
          ? API_BASE_URL + "/banners/uploadBanner"
          : API_BASE_URL + "/banners/edit_banner";
      fetch(url, requestOptions)
        .then((response) => {
          if (response.ok) {
            notification.success({
              message: "openshoots",
              description:
                this.state.type === "Add"
                  ? "Successfully added new banner."
                  : "Successfully updated banner.",
            });
            this.setState({
              open: false,
              bannerData: [],
              error: [],
              ImageFile: null,
              ImageUrl: "",
            });
            this.loadBanners();
          } else {
            notification.error({
              message: "openshoots",
              description: "Something went wrong. Please try again.",
            });
          }
          this.setState({
            isButtonLoading: false,
          });
        })
        .catch((error) => {
          console.log(error);
          notification.error({
            message: "openshoots",
            description: "Something went wrong. Please try again.",
          });
          this.setState({
            isButtonLoading: false,
          });
        });
    }
  }

  activeBannerAction() {
    if(this.state.bannerData['active']){
      deactivate_banner(this.state.selectedBannerID)
      .then((response) => {
        if (response.ok) {
          this.setState({
            open: false,
            bannerData: [],
            error: [],
            ImageFile: null,
            ImageUrl: "",
          });
          this.loadBanners();
        } else {
          notification.error({
            message: "openshoots",
            description: "Something went wrong. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "openshoots",
          description: "Something went wrong. Please try again.",
        });
      });
    }else{
      activate_banner(this.state.selectedBannerID)
      .then((response) => {
        if (response.ok) {
          this.setState({
            open: false,
            bannerData: [],
            error: [],
            ImageFile: null,
            ImageUrl: "",
          });
          this.loadBanners();
        } else {
          notification.error({
            message: "openshoots",
            description: "Something went wrong. Please try again.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "openshoots",
          description: "Something went wrong. Please try again.",
        });
      });
    }
    
  }

  render() {
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    const bannerList = [];
    this.state.banners.forEach((banner, bannerIndex) => {
      bannerList.push(
        <img
          key = {bannerIndex}
          className="bannerImage"
          id={bannerIndex}
          src={banner.address}
          onClick={this.showEditModal}
        />
      );
    });
    const { visible } = this.props;
    return (
      <>
        <div className={visible ? "visible" : "disable"} id="banners">
          <Button positive onClick={this.openModalForAddBanner}>
            ADD NEW BANNER
          </Button>
        </div>
        {bannerList}
        <Modal
          open={this.state.open}
          closeOnEscape={false}
          closeOnDimmerClick={true}
          onClose={this.closeModal}
        >
          <Modal.Header>{this.state.type} banner</Modal.Header>
          <Modal.Content>
            <Grid>
              <Grid.Row verticalAlign="middle">
                <Grid.Column width={10}>
                  <Form className="addBewBannerFrom">
                    <Form.Field required>
                      <label>redirect</label>
                      <Input
                        placeholder={
                          this.state.error["redirect"]
                            ? "This Field is required"
                            : "redirect"
                        }
                        name="redirect"
                        value={this.state.bannerData["redirect"]}
                        onChange={this.handleChangebannerData}
                        error={this.state.error["redirect"]}
                      />
                    </Form.Field>
                    <Form.Field required>
                      <label>description</label>
                      <Input
                        placeholder={
                          this.state.error["description"]
                            ? "This Field is required"
                            : "description"
                        }
                        error={this.state.error["description"]}
                        name="description"
                        value={this.state.bannerData["description"]}
                        onChange={this.handleChangebannerData}
                      />
                    </Form.Field>
                    <Form.Group widths="equal">
                      <Form.Field required>
                        <label>max downloads</label>
                        <Input
                          fluid
                          placeholder={
                            this.state.error["maxOpens"]
                              ? "This Field is required"
                              : "max downloads"
                          }
                          error={this.state.error["maxOpens"]}
                          name="maxOpens"
                          value={this.state.bannerData["maxOpens"]}
                          onChange={this.handleChangebannerData}
                        />
                      </Form.Field>
                      <Form.Field required>
                        <label>max views</label>
                        <Input
                          fluid
                          placeholder={
                            this.state.error["maxViews"]
                              ? "This Field is required"
                              : "max Views"
                          }
                          error={this.state.error["maxViews"]}
                          name="maxViews"
                          value={this.state.bannerData["maxViews"]}
                          onChange={this.handleChangebannerData}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <Checkbox
                          label="New Tab"
                          name="newTab"
                          checked={this.state.bannerData["newTab"]}
                          onChange={this.handleChangebannerData}
                        />
                      </Form.Field>
                      <Form.Field>
                        <Checkbox
                          label="Home page"
                          name="homepage"
                          checked={this.state.bannerData["homepage"]}
                          onChange={this.handleChangebannerData}
                        />
                      </Form.Field>
                    </Form.Group>
                    <Form.Field required>
                      <label>campaign end</label>
                      <DatePicker
                        selected={this.state.startDate}
                        onChange={this.handleChange}
                        className={this.state.error["date"] ? "error" : ""}
                      />
                      <span className="error">
                        {this.state.error["date"]
                          ? "This Feild is required"
                          : ""}
                      </span>
                    </Form.Field>
                  </Form>
                </Grid.Column>
                <Grid.Column width={6}>
                  <div className="upload">
                    <div className="uploadBannerImage">
                      {this.state.ImageUrl === "" ? (
                        <h1>+</h1>
                      ) : (
                        <img src={this.state.ImageUrl} />
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="dragImage"
                      name="file"
                      onChange={this.handleChangeImageFile}
                    />
                    {this.state.error["file"] ? (
                      <span className="error">Please select banner Image</span>
                    ) : null}
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.closeModal} negative>
              Cancel
            </Button>
            {this.state.type === "Add" ? null : (
              <Button onClick={this.activeBannerAction} negative>
                {this.state.bannerData['active'] ? "Remove" : "Active"}
              </Button>
            )}

            <Button
              onClick={this.handleBannerAction}
              positive
              labelPosition="right"
              icon="checkmark"
              content={this.state.type}
              loading={this.state.isButtonLoading}
            />
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default Banners;
