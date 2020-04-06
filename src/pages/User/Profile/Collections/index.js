import React, { Component } from "react";
import { PhotoList } from "../../../../components";
import { Tab } from "semantic-ui-react";
import Myphotos from "../Myphotos";
class Collections extends Component {
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

  ShowCollectionTab = id => {
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

  render() {
    const panes_collection = [];
    this.props.user.collections.forEach(collection => {
      console.log(collection.name);
      panes_collection.push({
        menuItem: collection.name,
        render: () => (
          <Tab.Pane>
            <Myphotos user={this.state.user} />
          </Tab.Pane>
        )
      });
    });

    return <Tab panes={panes_collection} className="user_photos_tab" />;
  }
}

export default Collections;
