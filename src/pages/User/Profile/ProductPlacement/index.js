import React, { Component } from "react";
import {
  Form,
  Input,
  Select,
  TextArea,
  Button,
  Icon,
  Grid,
  Table,
  Header,
  Image,
  Modal,
  Checkbox,
  Dropdown,
} from "semantic-ui-react";
import { API_BASE_URL, ACCESS_TOKEN } from "../../../../constants";
import { getAllTags } from "../../../../util/APIUtils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ISOFormatDate } from "../../../../util/Helpers";
import { notification } from "antd";
import LoadingIndicator from "../../../../common/LoadingIndicator";
class ProductPlacement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      tags: [],
      open: false,
      productData: [],
      error: [],
      type: "Add",
      ImageUrl: "",
      ImageFile: null,
      validityDate: new Date(),
      platforms: [
        { key: "1", value: "facebook", text: "Facebook" },
        { key: "2", value: "instagram", text: "Instagram" },
        { key: "3", value: "youtube", text: "Youtube" },
      ],
      serviceTypes: [
        { key: "1", value: "placement", text: "Placement" },
        { key: "2", value: "photoshoot", text: "Photoshoot" },
        { key: "3", value: "modelling", text: "Modelling" },
      ],
    };
    this.loadAllTags = this.loadAllTags.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleChangeImageFile = this.handleChangeImageFile.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleBannerAction = this.handleBannerAction.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    // this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
    this.loadAllTags();
  }

  componentDidUpdate(nextProps) {
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

  addProduct() {
    this.setState({
      open: true,
      type: "Add",
    });
  }

  editProduct() {
    this.setState({
      open: true,
      type: "Edit",
    });
  }

  closeModal() {
    this.setState({
      open: false,
      productData: [],
      ImageFile: null,
      ImageUrl: "",
      validityDate : new Date()
    });
  }

  handleChangeData(e, { name, value }) {
    this.state.productData[name] = value;
    this.setState({
      productData: this.state.productData,
    });
  }

  handleChangeImageFile(e) {
    this.state.error["file"] = false;
    this.setState({
      ImageUrl: URL.createObjectURL(e.target.files[0]),
      ImageFile: e.target.files[0],
      error: this.state.error,
    });
  }

  handleChangeDate = (date) => {
    if (date === null) {
      this.state.error["date"] = true;
    } else {
      this.state.error["date"] = false;
    }
    this.setState({
      validityDate: date,
      error: this.state.error,
    });
  };

  handleBannerAction() {
    var Request = {};
    if(this.state.type === "Add"){
      Request = {
        "userId": this.props.user.id,
        "quantity": 0,
        "title": this.state.productData['title'],
        "description": this.state.productData['description'],
        "price": parseInt(this.state.productData['price'], 10),
        "validity": ISOFormatDate(this.state.validityDate),
        "keywords": this.state.productData['keywords'] ? this.state.productData['keywords'] : [],
        "exclusions": this.state.productData['exclusions'] ? this.state.productData['exclusions'] : [],
        "platforms": this.state.productData['platforms'] ? this.state.productData['platforms'] : [],
        "serviceType": this.state.productData['serviceType'] ? this.state.productData['serviceType'] : this.state.serviceTypes[0].value
      }
    }else{
      Request = {
        "id" : "",
        "userId": this.props.user.id,
        "quantity": 0,
        "title": this.state.productData['title'],
        "description": this.state.productData['description'],
        "price": parseInt(this.state.productData['price'], 10),
        "validity": ISOFormatDate(this.state.validityDate),
        "keywords": this.state.productData['keywords'] ? this.state.productData['keywords'] : [],
        "exclusions": this.state.productData['exclusions'] ? this.state.productData['exclusions'] : [],
        "platforms": this.state.productData['platforms'] ? this.state.productData['platforms'] : [],
        "serviceType": this.state.productData['serviceType'] ? this.state.productData['serviceType'] : this.state.serviceTypes[0].value
      }
    }
    
    var itemDto = new Blob([JSON.stringify(Request)], {
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
    formData.append("itemDto", itemDto);
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
        ? API_BASE_URL + "/public/marketplace/add_item"
        : API_BASE_URL + "/public/marketplace/edit_item";
    fetch(url, requestOptions)
      .then((response) => {
        if (response.ok) {
          notification.success({
            message: "openshoots",
            description:
              this.state.type === "Add"
                ? "Successfully added new service."
                : "Successfully updated service.",
          });
          this.setState({
            open: false,
            bannerData: [],
            error: [],
            ImageFile: null,
            ImageUrl: "",
          });
          // this.loadBanners();
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

  render() {
    if (this.props.isUpdateLoading) {
      return <LoadingIndicator />;
    }
    return (
      <>
        {this.state.user ? (
          <>
            <Grid className="products">
              <Grid.Row className="ProductServiceGrid">
                <Button positive color="blue" onClick={this.addProduct}>
                  Add New Service
                </Button>
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
                      <Table.Row onClick={this.editProduct}>
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
                      <Table.Row onClick={this.editProduct}>
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
                      <Table.Row onClick={this.editProduct}>
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
                            <Icon name="instagram" />
                          </span>
                        </Table.Cell>
                        <Table.Cell>1.000 $</Table.Cell>
                      </Table.Row>
                      <Table.Row onClick={this.editProduct}>
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
                              Product Placement with one Model, SHared shooting
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
              </Grid.Row>
              <Modal
                open={this.state.open}
                closeOnEscape={false}
                closeOnDimmerClick={true}
                onClose={this.closeModal}
                className="ProductModal"
              >
                <Modal.Header>{this.state.type} Service</Modal.Header>
                <Modal.Content>
                  <Grid>
                    <Grid.Row verticalAlign="middle">
                      <Grid.Column width={10}>
                        <Form className="addNewProductForm">
                          <Form.Field required>
                            <label>Title</label>
                            <Input
                              placeholder={
                                this.state.error["redirect"]
                                  ? "This Field is required"
                                  : "Title"
                              }
                              name="title"
                              value={this.state.productData["title"]}
                              onChange={this.handleChangeData}
                              error={this.state.error["title"]}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>Description</label>
                            <TextArea
                              placeholder={
                                this.state.error["description"]
                                  ? "This Field is required"
                                  : "Description"
                              }
                              name="description"
                              value={this.state.productData["description"]}
                              onChange={this.handleChangeData}
                              error={this.state.error["description"]}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>Price</label>
                            <Input
                              placeholder={
                                this.state.error["price"]
                                  ? "This Field is required"
                                  : "Price"
                              }
                              name="price"
                              value={this.state.productData["price"]}
                              onChange={this.handleChangeData}
                              error={this.state.error["price"]}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>validity</label>
                            <DatePicker
                              selected={this.state.validityDate}
                              onChange={this.handleChangeDate}
                              className={this.state.error["date"] ? "error" : ""}
                            />
                            <span className="error">
                              {this.state.error["date"]
                                ? "This Feild is required"
                                : ""}
                            </span>
                          </Form.Field>
                          <Form.Field required>
                            <label>Keywords</label>
                            <Dropdown
                              options={this.state.tags}
                              placeholder="Choose Keywords"
                              search
                              selection
                              fluid
                              multiple
                              name="keywords"
                              // allowAdditions
                              // openOnFocus={false}
                              value={this.state.productData["keywords"] ? this.state.productData["keywords"] : []}
                              // onAddItem={this.handleMultiSelectAddition}
                              onChange={this.handleChangeData}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>Exclusions</label>
                            <Dropdown
                              options={this.state.tags}
                              placeholder="Choose Exclusions"
                              search
                              selection
                              fluid
                              multiple
                              name="exclusions"
                              // allowAdditions
                              // openOnFocus={false}
                              value={this.state.productData["exclusions"] ? this.state.productData["exclusions"] : []}
                              // onAddItem={this.handleMultiSelectAddition}
                              onChange={this.handleChangeData}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>Platforms</label>
                            <Dropdown
                              options={this.state.platforms}
                              placeholder="Choose platforms"
                              search
                              selection
                              fluid
                              multiple
                              name="platforms"
                              // allowAdditions
                              // openOnFocus={false}
                              value={this.state.productData["platforms"] ? this.state.productData["platforms"] : []}
                              // onAddItem={this.handleMultiSelectAddition}
                              onChange={this.handleChangeData}
                            />
                          </Form.Field>
                          <Form.Field required>
                            <label>ServiceType</label>
                            <Dropdown
                              options={this.state.serviceTypes}
                              placeholder="Choose ServiceType"
                              selection
                              fluid
                              name="serviceType"
                              // allowAdditions
                              // openOnFocus={false}
                              value={this.state.productData["serviceType"] ? this.state.productData["serviceType"] : this.state.serviceTypes[0].value}
                              // onAddItem={this.handleMultiSelectAddition}
                              onChange={this.handleChangeData}
                            />
                          </Form.Field>
                        </Form>
                      </Grid.Column>
                      <Grid.Column width={6}>
                        <div className="upload">
                          <div className="uploadImage">
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
                            <span className="error">Please select Image</span>
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
                    <Button onClick={this.removeBanner} negative>
                      Remove
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
            </Grid>
          </>
        ) : null}
      </>
    );
  }
}

export default ProductPlacement;
