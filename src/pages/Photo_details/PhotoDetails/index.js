import _ from "lodash";
import React, { Component } from "react";
import { Button, Header, Icon, Image, Modal, Label } from "semantic-ui-react";
import {
  Heart_Icon,
  Plus_Icon,
  Zoom_Icon,
  CloseIcon,
} from "../../../assets/icons";
import "./style.less";

class PhotoDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: 108,
    };
    this.handleClose = this.handleClose.bind(this);
    this.addToPreferred = this.addToPreferred.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
  }
  handleClose() {
    this.props.handleClose(false);
  }

  addToPreferred() {
    this.setState({
      rating: this.state.rating + 1,
    });
  }

  addToBucket() {
    this.props.addToBucket(this.props.photo, true);
  }

  render() {
    const { show, photo } = this.props;
    const keywords = [];
    const tags = ["people", "paper"];
    tags.forEach((tag, tagIndex) => {
      keywords.push(<button>{tag}</button>);
    });
    var url = photo.url_fr + "";
    var releaseNum = photo.authorizations ? photo.authorizations.length : 0;
    return (
      <Modal
        open={show}
        closeOnEscape={false}
        closeOnDimmerClick={true}
        onClose={this.handleClose}
        className="PhotoDetailModal"
      >
        <Modal.Header>
          {photo.title}
          <a onClick={this.handleClose}>
            <CloseIcon className="close_icon" />
          </a>
        </Modal.Header>
        <Modal.Content className="modal_content" scrolling>
          <Modal.Description>
            <div className="image">
              <Image src={photo.url_mr} wrapped />
            </div>
            <Header></Header>
            <p>
              <b> Has {releaseNum} model release</b>
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button primary>
            <a href={"/Photo_details/" + photo.id}>
              View Details <Icon name="chevron right" />
            </a>
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default PhotoDetails;
