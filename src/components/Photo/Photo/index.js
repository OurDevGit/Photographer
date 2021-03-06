import React, { Component } from "react";
import "./style.less";
import { Checkbox, List } from "semantic-ui-react";
import { Radio } from "antd";
import { Heart_Icon, Plus_Icon, Zoom_Icon } from "../../../assets/icons";

const RadioGroup = Radio.Group;

class Photo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
    };
    this.handleCheck = this.handleCheck.bind(this);
    this.addToBucket = this.addToBucket.bind(this);
    this.quickView = this.quickView.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.action !== prevProps.action) {
      if (this.props.active === this.props.index) {
        this.props.onClick(this.props, this.props.index, this.props.total);
      }
    }
    if (this.props.publish !== prevProps.publish) {
      if (this.props.active + 1 === this.props.index) {
        this.props.onClick(this.props, this.props.active, this.props.total - 1);
      }
      if (this.props.total === this.props.active + 1 && this.props.index === 0) {
        this.props.onClick(this.props, this.props.index, this.props.total - 1);
      }
    }
  }
  onClickImage = () => {
    this.props.onClick(this.props);
  };

  quickView() {
    this.props.quickView(this.props.photo);
  }

  handleCheck() {
    if (this.props.type === "Submit_operation" || this.props.type === "userPhoto") {
      this.state.isChecked = !this.state.isChecked;
      this.setState({
        isChecked: this.state.isChecked,
      });
      this.props.onClick(this.props, this.state.isChecked);
    } else if (this.props.type === "home_list") {
      this.props.onClick(this.props.photo);
    } else if (this.props.type === "admin_photolist") {
      this.props.onClick(this.props, this.props.index, this.props.total);
    }
  }

  addToBucket() {
    this.props.addToBucket(this.props.photo, true);
  }

  render() {
    const { active, index, photo, type, status } = this.props;
    const rejectingMotives = [];
    if (photo.rejectingMotives) {
      photo.rejectingMotives.forEach((motive, motiveIndex) => {
        rejectingMotives.push(<List.Item>{motive.value}</List.Item>);
      });
    }

    return (
      <div className={status === "REJECTED" ? "rejectedPhoto" : "photo_div"}>
        <div
          className={
            this.state.isChecked ? "photo-content active" : "photo-content"
          }
          id={index === active ? "active" : ""}
        >
          {/* <div className="photo-header"> */}
          {(type === "Submit_operation" || type === 'userPhoto') ? (
            <Checkbox
              value={this.state.isChecked}
              className="ddd"
              onClick={this.handleCheck}
              checked={this.state.isChecked}
            />
          ) : null}
          {type === "home_list" ? (
            <div>
              <a target="blank" onClick={this.quickView}>
                <Zoom_Icon className="detail_Icon Zoom-icon" />
              </a>
              <Heart_Icon className="detail_Icon Heart-icon" />
              <a onClick={this.addToBucket}>
                <Plus_Icon className="detail_Icon Plus-icon" />
              </a>
              <p className="owner_content">{photo.owner}</p>
            </div>
          ) : null}

          {/* </div> */}
          <img
            onClick={this.handleCheck}
            src={photo.url_lr}
            id={index}
            value={photo}
          />
          <List className="rejectingMotives">{rejectingMotives}</List>
        </div>
      </div>
    );
  }
}

export default Photo;
