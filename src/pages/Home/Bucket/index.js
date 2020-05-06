import React, { Component } from "react";
import {
  Button,
  Header,
  Icon,
  Image,
  Modal,
  Dropdown,
} from "semantic-ui-react";
import { CloseIcon } from "../../../assets/icons";
import {
  getListOfBaskets,
  addNewBasketForUser,
  addToBasketForPhoto,
  getBasketsForPhoto,
  removePhotoFromBasket,
} from "../../../util/APIUtils";
import "./style.less";
import { notification } from "antd";

class Bucket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 108,
      baskets: [],
      Existingbasketlist: [],
      currentBucketValues: [],
    };
    this.loadBasketsForUser = this.loadBasketsForUser.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addToPreferred = this.addToPreferred.bind(this);
    this.handleMultiSelectAddition = this.handleMultiSelectAddition.bind(this);
    this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    this.addNewBasket = this.addNewBasket.bind(this);
    this.addToBasket = this.addToBasket.bind(this);
    this.removeFromBasket = this.removeFromBasket.bind(this);
  }

  componentDidMount() {
    this.loadBasketsForUser();
  }

  componentDidUpdate(prevProps) {
    if (this.props.photo !== prevProps.photo) {
      this.setState({
        Existingbasketlist: [],
      });
      this.loadBasketsForPhoto(this.props.photo.id);
    }
  }

  loadBasketsForUser() {
    var score = [];
    getListOfBaskets()
      .then((response) => {
        let basketlist = response.map((basket) => {
          return {
            key: basket.id,
            value: basket.id,
            text: basket.value,
          };
        });
        this.setState({
          baskets: basketlist,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  loadBasketsForPhoto(id) {
    getBasketsForPhoto(id)
      .then((response) => {
        let Existingbasketlist = response.map((basket) => {
          this.state.baskets = this.state.baskets.filter(
            (el) => el.key !== basket.id
          );
          return {
            key: basket.id,
            value: basket.id,
            text: basket.value,
          };
        });
        this.setState({
          Existingbasketlist: Existingbasketlist,
          baskets: this.state.baskets,
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading: false,
        });
      });
  }

  handleClose() {
    this.props.handleClose(false);
    this.setState({
      currentBucketValues: [],
    });
    this.loadBasketsForUser();
  }

  addToPreferred() {
    this.setState({
      rating: this.state.rating + 1,
    });
  }

  addNewBasket(newBasket) {
    addNewBasketForUser(newBasket)
      .then((response) => {
        console.log("ADDBASket", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  handleMultiSelectAddition = (e, { value }) => {
    this.setState((prevState) => ({
      baskets: [{ text: value, value }, ...prevState.baskets],
    }));
  };

  handleMultiSelectChange = (e, { value }) => {
    console.log("value", value);
    console.log("baskets", this.state.currentBucketValues);
    if (value.length > this.state.currentBucketValues.length) {
      let i = 0;
      for (i = 0; i < this.state.baskets.length; i++) {
        if (this.state.baskets[i].value === value[value.length - 1]) {
          i = this.state.baskets.length + 10;
        }
      }
      if (i === this.state.baskets.length) {
        this.addNewBasket(value[value.length - 1]);
      }
    }
    this.state.currentBucketValues = value;
    this.setState({
      currentBucketValues: value,
    });
  };

  addToBasket() {
    if (
      !this.state.currentBucketValues ||
      this.state.currentBucketValues.length === 0
    ) {
      this.handleClose();
    } else {
      var Request = {
        photoId: this.props.photo.id,
        baskets: this.state.currentBucketValues,
      };
      console.log(Request);
      addToBasketForPhoto(Request)
        .then((response) => {
          if (response.ok) {
            notification.success({
              message: "Openshoots",
              description: "Successfully added photo to selected baskets!",
            });
            this.handleClose();
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
  }

  removeFromBasket(e, { id }) {
    console.log(id);
    var Request = {
      photoId: this.props.photo.id,
      baskets: [this.state.Existingbasketlist[id].value],
    };
    this.state.Existingbasketlist.splice(id, 1);

    removePhotoFromBasket(Request)
      .then((response) => {
        console.log(response);
        if (response.ok) {
          this.setState({
            Existingbasketlist: this.state.Existingbasketlist,
          });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { show, photo } = this.props;
    const keywords = [];
    this.state.Existingbasketlist.forEach((bucket, bucketIndex) => {
      keywords.push(
        <button key={bucketIndex}>
          {bucket.text}
          <Icon name="close" id={bucketIndex} onClick={this.removeFromBasket} />
        </button>
      );
    });
    return (
      <Modal open={show} className="Bucket">
        <Modal.Header>
          Bucket
          <a onClick={this.handleClose}>
            <CloseIcon className="close_icon" />
          </a>
        </Modal.Header>
        <Modal.Content image scrolling className="modal_content">
          <Image size="medium" src={photo.url_fr} wrapped />
          <Modal.Description>
            <Header></Header>
            <div className="existingBuckets">
              <p>Existing Buckets:</p>
              {keywords}
            </div>
            <div className="AddBucket">
              <p>Add To Bucket</p>
              <Dropdown
                options={this.state.baskets}
                placeholder="Choose Keywords"
                search
                selection
                fluid
                multiple
                allowAdditions
                value={this.state.currentBucketValues}
                onAddItem={this.handleMultiSelectAddition}
                onChange={this.handleMultiSelectChange}
              />
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="blue" onClick={this.addToBasket}>
            Save <Icon name="chevron right" />
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default Bucket;
