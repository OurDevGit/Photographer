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
    this.handleImageClick =  this.handleImageClick.bind(this)
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
  }

  componentDidUpdate(nextProps) {}

  handleImageClick(e){
    this.props.handleImageClick(e);
  }
  removeBasket() {
    this.props.removeBasket(this.props.basketId);
  }

  render() {
    console.log("dddd",this.props.user)
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
          type={this.props.type}
          onClickImage={this.handleImageClick}
          addToBucket={this.addToBucket}
          activePage={this.state.activePage}
          totalPages={5}
          quickView={this.quickView}
          basketId={this.props.basketId}
          username={this.props.user.username}
        />
      </div>
    );
  }
}

export default Myphotos;
