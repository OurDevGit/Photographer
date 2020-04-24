import React, { Component } from "react";
import { PhotoList } from "../../../../components";
import { Tab, Input, Button } from "semantic-ui-react";
import Myphotos from "../Myphotos";
import {
} from "../../../../util/APIUtils";
import { notification } from "antd";
class Collections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
      collectionName: "",
    };
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
    this.addNewCollection = this.addNewCollection.bind(this);
    this.handleChangeCollectionName = this.handleChangeCollectionName.bind(
      this
    );
  }

  componentDidUpdate(nextProps) {}

  ShowCollectionTab = (id) => {
    return (
      <div className="Myphotos">
        <PhotoList
          type="home_list"
          onClickImage={this.handleImageClick}
          addToBucket={this.addToBucket}
          activePage={this.state.activePage}
          totalPages={5}
          quickView={this.quickView}
        />
      </div>
    );
  };

  addNewCollection() {}

  handleChangeCollectionName(e, { value }) {
    this.setState({
      collectionName: value,
    });
  }

  addNewCollection() {
    if (this.state.collectionName === "") {
      notification.error({
        message: "Openshoots",
        description: "Please put new Collection name!",
      });
    } else {
    //   this.setState({
    //     isLoading: true,
    //   });
    //   addNewCollectionForUser(this.state.collectionName)
    //     .then((response) => {
    //       response.json().then((json) => {
    //         if (!response.ok) {
    //           this.setState({
    //             isLoading: false,
    //           });
    //           notification.success({
    //             message: "Openshoots",
    //             description: "Something went worng. Please try again",
    //           });
    //         }
    //         console.log(json);
    //         this.state.user.collections = json;
    //         this.setState({
    //           isLoading: false,
    //           user: this.state.user,
    //         });
    //         notification.success({
    //           message: "Openshoots",
    //           description: "Successfully add your new collection",
    //         });
    //       });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //       this.setState({
    //         isLoading: false,
    //       });
    //       notification.error({
    //         message: "Openshoots",
    //         description: "Something went worng. Please try again",
    //       });
    //     });
    }
  }

  render() {
    console.log(this.props.user)
    const panes_collection = [];
    this.props.user.collections.forEach((collection) => {
      console.log("collection", collection);
      panes_collection.push({
        menuItem: collection.name,
        render: () => (
          <Tab.Pane>
            <Myphotos
              user={this.props.user}
              type="collection"
              collectionId={collection.id}
            />
          </Tab.Pane>
        ),
      });
    });
    if (this.props.type === "currentUser") {
      panes_collection.push({
        menuItem: "+",
        render: () => (
          <div className="AddBasketDiv">
            <Input
              value={this.state.collectionName}
              placeholder="New Collection Name"
              onChange={this.handleChangeCollectionName}
            />
            <Button
              primary
              onClick={this.addNewCollection}
              loading={this.state.isLoading}
            >
              Add
            </Button>
          </div>
        ),
      });
    }

    return <Tab panes={panes_collection} className="user_collection" />;
  }
}

export default Collections;
