import React, { Component } from "react";
import { PhotoList } from "../../../../components";
import { Tab, Input, Button } from "semantic-ui-react";
import Myphotos from "../Myphotos";
import { addNewBasketForUser, removeBasketForUser } from "../../../../util/APIUtils";
import { notification } from "antd";
class Baskets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: false,
      basketName: "",
    };
    this.handleChangeBasketName = this.handleChangeBasketName.bind(this);
    this.addNewBasket = this.addNewBasket.bind(this);
    this.removeBasket = this.removeBasket.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
  }

  componentDidUpdate(nextProps) {}

  ShowBasketTab = (id) => {
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

  handleChangeBasketName(e, { value }) {
    this.setState({
      basketName: value,
    });
  }

  addNewBasket() {
    if (this.state.basketName === "") {
      notification.error({
        message: "Photoing App",
        description: "Please put new Basket name!",
      });
    } else {
      this.setState({
        isLoading: true,
      });
      addNewBasketForUser(this.state.basketName)
        .then((response) => {
          response.json().then((json) => {
            if (!response.ok) {
              this.setState({
                isLoading: false,
              });
              notification.success({
                message: "Photoing App",
                description: "Something went worng. Please try again",
              });
            }
            console.log(json);
            this.state.user.baskets = json;
            this.setState({
              isLoading: false,
              user: this.state.user,
            });
            notification.success({
              message: "Photoing App",
              description: "Successfully add your new basket",
            });
          });
        })
        .catch((error) => {
          console.log(error);
          this.setState({
            isLoading: false,
          });
          notification.error({
            message: "Photoing App",
            description: "Something went worng. Please try again",
          });
        });
    }
  }

  removeBasket(e){
    this.setState({
      isLoading: true
    })
    removeBasketForUser(e)
    .then(response=>{
      if(response.ok){
        notification.success({
          message: "Photoing App",
          description: "",
        });
        var temp = this.state.user.baskets;
        this.state.user.baskets = [];
        temp.forEach(t=>{
          if(t.id !== e){
            this.state.user.baskets.push(t);
          }
        });
        this.setState({
          user: this.state.user,
          isLoading: false
        })
      }else{
        notification.error({
          message: "Photoing App",
          description: "Something went worng. Please try again",
        });
        this.setState({
          isLoading: false
        })
      }
      
    })
    .catch(error=>{
      console.log(error)
      notification.error({
        message: "Photoing App",
        description: "Something went worng. Please try again",
      });
      this.setState({
        isLoading: false
      })
    })
  }

  render() {
    const panes_basket = [];
    if (this.state.user) {
      this.props.user.baskets.forEach((basket) => {
        console.log(basket.value);
        panes_basket.push({
          menuItem: basket.value,
          render: () => (
            <Tab.Pane>
              <>
              <Myphotos user={this.state.user} removeBasket={this.removeBasket} basketId={basket.id} type="basket" isLoading={this.state.isLoading} />
              </>
            </Tab.Pane>
          ),
        });
      });
      panes_basket.push({
        menuItem: "+",
        render: () => (
          <div className="AddBasketDiv">
            <Input
              value={this.state.basketName}
              placeholder="Basket Name"
              onChange={this.handleChangeBasketName}
            />
            <Button
              primary
              onClick={this.addNewBasket}
              loading={this.state.isLoading}
            >
              Add
            </Button>
          </div>
        ),
      });
    }

    return <Tab panes={panes_basket} className="user_baskets" />;
  }
}

export default Baskets;
