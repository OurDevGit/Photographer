import React, { Component } from "react";
import { Label, Input, Button, Modal } from "semantic-ui-react";
import { API_BASE_URL, ACCESS_TOKEN } from "../../../constants";
import {
  getCurrentUser,
  getAllCategories,
  getAllTags,
  addNewTag,
} from "../../../util/APIUtils";
import "./style.less";
import { notification } from "antd";
class CategoriesAndTags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      visible: "",
      categories: [],
      tags: [],
      inputValue: [],
      tagIconFile: null,
      tagIconUrl: "",
      categoryIconFile: null,
      categoryIconUrl: "",
      IconFile: null,
      IconUrl: "",
      open: false,
      selected: {},
      editValue: "",
      isButtonLoading: false,
    };
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.loadAllTags = this.loadAllTags.bind(this);
    this.handleAddTag = this.handleAddTag.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleTagFileUpload = this.handleTagFileUpload.bind(this);
    this.handleClickTag = this.handleClickTag.bind(this);
    this.modalclose = this.modalclose.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
    this.handleInputEdit = this.handleInputEdit.bind(this);
    this.handleCategoryFileUpload = this.handleCategoryFileUpload.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleClickCategory = this.handleClickCategory.bind(this);
  }
  componentDidMount() {
    this.loadAllTags();
    this.loadAllCategories();
  }
  loadAllCategories() {
    getAllCategories()
      .then((response) => {
        let categorylist = response.categories.map((category) => {
          return {
            key: category.id,
            value: category.value,
            text: category.value,
            icon: category.icon,
          };
        });
        this.setState({
          categories: categorylist,
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
            icon: tag.icon,
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

  handleAddTag(e) {
    if (
      !this.state.inputValue["newTag"] ||
      this.state.inputValue["newTag"] == ""
    ) {
      notification.error({
        message: "Openshoots",
        description: "Please input tag Name.",
      });
    } else {
      if (!this.state.tagIconFile) {
        notification.error({
          message: "Openshoots",
          description: "Please select Icon file.",
        });
      } else {
        var myHeaders = new Headers({});
        if (localStorage.getItem(ACCESS_TOKEN)) {
          myHeaders.append(
            "Authorization",
            "Bearer " + localStorage.getItem(ACCESS_TOKEN)
          );
        }
        const formData = new FormData();
        formData.append("tagName", this.state.inputValue["newTag"]);
        formData.append("file", this.state.tagIconFile);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formData,
          redirect: "follow",
        };
        this.setState({
          isButtonLoading: true,
        });
        fetch(
          API_BASE_URL + "/tag_and_category/add_new_tag_with_icon",
          requestOptions
        )
          .then((response) => {
            console.log(response);
            if (response.ok) {
              notification.success({
                message: "Openshoots",
                description: "Successfully add new Tag",
              });
            } else {
              notification.error({
                message: "Openshoots",
                description: "Something went wrong. Please try again",
              });
            }
            this.setState({
              isButtonLoading: false,
              tagIconFile: null,
              tagIconUrl: "",
              inputValue: [],
            });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Openshoots",
              description: "Something went wrong. Please try again",
            });
            this.setState({
              isButtonLoading: false,
            });
          });
      }
    }
  }

  handleAddCategory(e) {
    if (
      !this.state.inputValue["newCategory"] ||
      this.state.inputValue["newCategory"] == ""
    ) {
      notification.error({
        message: "Openshoots",
        description: "Please input Category Name.",
      });
    } else {
      if (!this.state.categoryIconFile) {
        notification.error({
          message: "Openshoots",
          description: "Please select Icon file.",
        });
      } else {
        var myHeaders = new Headers({});
        if (localStorage.getItem(ACCESS_TOKEN)) {
          myHeaders.append(
            "Authorization",
            "Bearer " + localStorage.getItem(ACCESS_TOKEN)
          );
        }
        console.log("thi", this.state.inputValue["newCategory"]);
        const formData = new FormData();
        formData.append("categoryName", this.state.inputValue["newCategory"]);
        formData.append("file", this.state.categoryIconFile);

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: formData,
          redirect: "follow",
        };

        this.setState({
          isButtonLoading: true,
        });
        fetch(
          API_BASE_URL + "/tag_and_category/add_new_category_with_icon",
          requestOptions
        )
          .then((response) => {
            console.log(response);
            if (response.ok) {
              notification.success({
                message: "Openshoots",
                description: "Successfully add new Category",
              });
            } else {
              notification.error({
                message: "Openshoots",
                description: "Something went wrong. Please try again",
              });
            }
            this.setState({
              isButtonLoading: false,
              categoryIconFile: null,
              categoryIconUrl: "",
              inputValue: [],
            });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Openshoots",
              description: "Something went wrong. Please try again",
            });
            this.setState({
              isButtonLoading: false,
            });
          });
      }
    }
  }

  handleInputChange(e, { name, value }) {
    this.state.inputValue[name] = value;
    this.setState({
      inputValue: this.state.inputValue,
    });
  }

  handleTagFileUpload(e) {
    this.setState({
      tagIconFile: e.target.files[0],
      tagIconUrl: URL.createObjectURL(e.target.files[0]),
    });
  }
  handleCategoryFileUpload(e) {
    this.setState({
      categoryIconFile: e.target.files[0],
      categoryIconUrl: URL.createObjectURL(e.target.files[0]),
    });
  }

  handleFileUpload(e) {
    console.log(e.target.files);
    this.setState({
      IconFile: e.target.files[0],
      IconUrl: URL.createObjectURL(e.target.files[0]),
    });
  }
  handleClickTag(e) {
    this.setState({
      open: true,
      selected: { type: "tag", object: this.state.tags[e.target.id] },
      IconUrl: this.state.tags[e.target.id].icon,
      editValue: this.state.tags[e.target.id].value,
    });
  }

  handleClickCategory(e) {
    this.setState({
      open: true,
      selected: { type: "category", object: this.state.tags[e.target.id] },
      IconUrl: this.state.categories[e.target.id].icon,
      editValue: this.state.categories[e.target.id].value,
    });
  }

  handleInputEdit(e, { value }) {
    this.setState({
      editValue: value,
    });
  }

  modalclose() {
    this.setState({
      open: false,
      selected: {},
      IconUrl: "",
      editValue: "",
    });
  }

  render() {
    console.log("tags", this.state.tags);
    const { visible } = this.props;
    const keywords = [];
    this.state.tags.forEach((tag, tagIndex) => {
      // keywords.push(<button className="value">{tag.value}</button>);
      keywords.push(
        <Label
          as="a"
          className="value"
          id={tagIndex}
          image
          onClick={this.handleClickTag}
        >
          <img src={tag.icon} />
          {tag.value}
        </Label>
      );
    });
    const categories = [];
    this.state.categories.forEach((category, categoryIndex) => {
      categories.push(
        <Label
          as="a"
          className="value"
          id={categoryIndex}
          onClick={this.handleClickCategory}
          image
        >
          <img src={category.icon} />
          {category.value}
        </Label>
      );
    });
    return (
      <div className={visible ? "visible" : "disable"} id="CategoryAndTag">
        <div className="column Category">
          <div className="AddCategory">
            <h3>
              Category Icon:
              <span className="IconUpload">
                <Input
                  type="file"
                  name="tagIcon"
                  className="fileUpload"
                  onChange={this.handleCategoryFileUpload}
                ></Input>
                {!this.state.categoryIconFile ? (
                  <button className="UploadButton">click</button>
                ) : (
                  <img src={this.state.categoryIconUrl} />
                )}
              </span>
              Add New Category :
              <Input
                type="text"
                name="newCategory"
                placeholder="New Category..."
                action
                onChange={this.handleInputChange}
              >
                <input />
                <Button
                  type="button"
                  onClick={this.handleAddCategory}
                  loading={this.state.isButtonLoading}
                >
                  Add
                </Button>
              </Input>
            </h3>
          </div>
          <div className="existingCategories">
            <h3>
              Existing Catetgories:
              <Input
                size="small"
                icon="search"
                placeholder="Search..."
                onChange={this.handleInputChange}
              />
            </h3>
            {categories}
          </div>
        </div>
        <div className="column Tag">
          <div className="AddTag">
            <h3>
              Tag Icon:
              <span className="IconUpload">
                <Input
                  type="file"
                  name="tagIcon"
                  className="fileUpload"
                  onChange={this.handleTagFileUpload}
                ></Input>
                {!this.state.tagIconFile ? (
                  <button className="UploadButton">click</button>
                ) : (
                  <img src={this.state.tagIconUrl} />
                )}
              </span>
              Add New Tag :
              <Input
                type="text"
                name="newTag"
                placeholder="New Tag..."
                action
                onChange={this.handleInputChange}
              >
                <input />
                <Button type="button" onClick={this.handleAddTag}>
                  Add
                </Button>
              </Input>
            </h3>
          </div>
          <div className="existingTags">
            <h3>
              Existing Tags:
              <Input
                size="small"
                icon="search"
                placeholder="Search..."
                onChange={this.handleInputChange}
              />
            </h3>
            {keywords}
          </div>
        </div>
        <Modal
          open={this.state.open}
          closeOnEscape={false}
          closeOnDimmerClick={true}
          onClose={this.modalclose}
          className="editModal"
        >
          <Modal.Header>Edit {this.state.selected.type}</Modal.Header>
          <Modal.Content>
            <div className="AddTag">
              <h3>
                {this.state.selected.type} Icon:
                <span className="IconUpload">
                  <Input
                    type="file"
                    name="tagIcon"
                    className="fileUpload"
                    onChange={this.handleFileUpload}
                  ></Input>
                  <img src={this.state.IconUrl} />
                </span>
                Edit {this.state.selected.type} :
                <Input
                  type="text"
                  name="newTag"
                  placeholder="New Tag..."
                  action
                  onChange={this.handleInputEdit}
                  value={this.state.editValue}
                >
                  <input />
                  <Button type="button" onClick={this.handleEditTag}>
                    Edit
                  </Button>
                </Input>
              </h3>
            </div>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={this.modalclose} negative>
              No
            </Button>
            <Button
              onClick={this.close}
              positive
              labelPosition="right"
              icon="checkmark"
              content="Yes"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default CategoriesAndTags;
