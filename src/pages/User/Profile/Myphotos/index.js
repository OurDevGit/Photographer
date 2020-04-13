import React, { Component } from "react";
import { PhotoList } from "../../../../components";
import { Button } from "semantic-ui-react";
class Myphotos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
    };
    this.removeBasket = this.removeBasket.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
  }

  componentDidUpdate(nextProps) {}

  removeBasket() {
    this.props.removeBasket(this.props.basketId);
  }

  render() {
    return (
      <div className="Myphotos">
        {this.props.type === "basket" ? (
          <Button
            negative
            onClick={this.removeBasket}
            loading={this.props.isLoading}
          >
            Remove Basket
          </Button>
        ) : null}
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
