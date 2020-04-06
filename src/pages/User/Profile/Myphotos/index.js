import React, { Component } from "react";
import { PhotoList } from "../../../../components";

class Myphotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true
    };
  }

  componentDidMount() {
    this.setState({
      user: this.props.user
    });
  }

  componentDidUpdate(nextProps) {}

  render() {
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
  }
}

export default Myphotos;
