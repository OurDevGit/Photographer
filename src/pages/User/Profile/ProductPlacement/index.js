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
import { getAllTags } from "../../../../util/APIUtils";
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
      platforms: [
        { key: "1", value: "facebook", text: "Facebook" },
        { key: "2", value: "instagram", text: "Instagram" },
        { key: "3", value: "youtube", text: "Youtube" },
      ],
    };
    this.loadAllTags = this.loadAllTags.bind(this);
    this.handleChangeData = this.handleChangeData.bind(this);
    this.handleChangeImageFile = this.handleChangeImageFile.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.addProduct = this.addProduct.bind(this);
    this.editProduct = this.editProduct.bind(this);
    this.closeModal = this.closeModal.bind(this);
    // this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
    this.loadAllTags();
  }

  componentDidUpdate(nextProps) {
    console.log("update");
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
    });
  }

  handleChangeData(e, { name, value }) {
    console.log(name, value);
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

  handleSave() {
    this.props.update_userData(this.state.user);
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
                            <Icon name="instagram official" />
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
                <Modal.Header>{this.state.type} banner</Modal.Header>
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
                              value={this.state.productData["keywords"]}
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
                              value={this.state.productData["exclusions"]}
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
                              value={this.state.productData["platforms"]}
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
