import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button } from "semantic-ui-react";
import data from "./data.json";
import "./style.less";
import Board from "react-trello";
import customImageCard from "./customImageCard";
import InfiniteScroll from "react-infinite-scroller";
import {
  updateChoosedForHome,
  getNotChoosenForHome,
  getPhotoLists,
} from "../../../util/APIUtils";
import { PHOTO_LIST_SIZE } from "../../../constants";
import { notification } from "antd";
import { compose } from "redux";

export default class OrderingPhotoForHome extends Component {
  imageData = {
    lanes: [
      {
        id: "PLANNED",
        title: "Publicated Photos",
        label: "",
        style: {
          width: 400,
          "border-right": "1px solid",
        },
        cards: [],
      },
      {
        id: "HOMELIST",
        title: "First",
        label: "",
        style: {
          width: 400,
        },
        cards: [],
      },
    ],
  };

  total_page = -1;

  constructor(props) {
    super(props);
    this.state = {
      NotChoosenForHome: [],
      photosForHome: [],
      presentData: {},
    };
    this.loadNotChoosenForHome = this.loadNotChoosenForHome.bind(this);
    this.loadHomeList = this.loadHomeList.bind(this);
    this.datachange = this.datachange.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.loadFunc = this.loadFunc.bind(this);
  }

  componentDidMount() {
    this.imageData = {
      lanes: [
        {
          id: "PLANNED",
          title: "Publicated Photos",
          label: "",
          style: {
            width: 400,
            "border-right": "1px solid",
          },
          cards: [],
        },
        {
          id: "HOMELIST",
          title: "First",
          label: "",
          style: {
            width: 400,
          },
          cards: [],
        },
      ],
    };
    this.loadNotChoosenForHome(0, PHOTO_LIST_SIZE);
    this.loadHomeList(0, PHOTO_LIST_SIZE);
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible == false) {
    }
  }

  loadNotChoosenForHome(page, size) {
    getNotChoosenForHome(page, size)
      .then((response) => {
        console.log(response);
        response.content.forEach((photo) => {
          var card = {
            id: photo.id,
            photoid: photo.id + "",
            title: photo.title,
            description: photo.description,
            url: photo.url_lr,
            laneId: "PLANNED",
            views: photo.viewed ? photo.viewed : 0,
            likes: photo.likes ? photo.likes : 0,
            downloads: photo.downloads ? photo.downloads : 0,
          };
          this.imageData.lanes[0].cards.push(card);
        });
        this.imageData.lanes[0].label = response.totalElements;

        this.setState({
          NotChoosenForHome: response.content,
        });
        // if(!this.state.totalPages ){
        //   this.setState({
        //     totalPages: response.totalPages
        //   })
        //   console.log("b")
        // }else
        // {
        //   console.log("bb")
        //   if(this.state.totalPages < response.totalPages)
        //   {
        //     this.setState({
        //       totalPages: response.totalPages
        //     })
        //   }
        //   this.setState({
        //       hasMore: true
        //   })
        // }
        if (this.total_page == -1) {
          this.total_page = response.totalPages;
          console.log("b");
        } else {
          console.log("bb");
          if (this.total_page < response.totalPages) {
            this.total_page = response.totalPages;
          }
          this.setState({
            hasMore: true,
          });
        }
      })
      .catch((error) => {
        console.log("eror", error);
      });
  }

  loadHomeList(page, size) {
    getPhotoLists(page, size)
      .then((response) => {
        console.log(response);
        response.content.forEach((photo) => {
          var card = {
            id: photo.id,
            photoid: photo.id + "",
            title: photo.title,
            description: photo.description,
            url: photo.url_lr,
            laneId: "HOMELIST",
            views: photo.viewed ? photo.viewed : 0,
            likes: photo.likes ? photo.likes : 0,
            downloads: photo.downloads ? photo.downloads : 0,
          };
          this.imageData.lanes[1].cards.push(card);
        });
        this.imageData.lanes[1].label = response.totalElements + "";
        this.setState({
          photosForHome: response.content,
        });

        // if(!this.state.totalPages ){
        //   this.setState({
        //     totalPages: response.totalPages
        //   })
        //   console.log("a")
        // }else
        // {
        //   console.log("aa")
        //   if(this.state.totalPages < response.totalPages)
        //   {
        //     this.setState({
        //       totalPages: response.totalPages
        //     })
        //   }
        //   this.setState({
        //       hasMore: true
        //   })
        // }
        if (this.total_page == -1) {
          this.total_page = response.totalPages;
          console.log("a");
        } else {
          console.log("aa");
          if (this.total_page < response.totalPages) {
            this.total_page = response.totalPages;
          }
          this.setState({
            hasMore: true,
          });
        }
      })
      .catch((error) => {
        console.log("eror", error);
      });
  }

  datachange(newData) {
    newData.lanes[0].label = newData.lanes[0].cards.length;
    newData.lanes[1].label = newData.lanes[1].cards.length;
    this.setState({
      presentData: newData,
    });
  }

  handleSave() {
    var NotChoosed = [];
    var HomeList = [];
    for (let i = 0; i < 2; i++) {
      if (this.state.presentData.lanes[i].id == "PLANNED") {
        for (let j = 0; j < this.state.presentData.lanes[i].cards.length; j++) {
          NotChoosed.push({
            photoId: this.state.presentData.lanes[i].cards[j].photoid,
          });
        }
      } else {
        for (let j = 0; j < this.state.presentData.lanes[i].cards.length; j++) {
          HomeList.push({
            photoId: this.state.presentData.lanes[i].cards[j].photoid,
          });
        }
      }
    }
    console.log(HomeList);
    updateChoosedForHome(HomeList)
      .then((response) => {
        console.log(response);
        notification.success({
          message: "Photoing App",
          description: "Success to updates photos for home!",
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }

  loadFunc(page) {
    this.setState({
      page: page,
    });
    if (page >= this.total_page) {
      this.setState({
        hasMore: false,
      });
    } else {
      this.loadHomeList(page, PHOTO_LIST_SIZE);
      this.loadNotChoosenForHome(page, PHOTO_LIST_SIZE);
    }
    console.log("page", page);

    // this.loadNotChoosenForHome(page, PHOTO_LIST_SIZE)
  }

  render() {
    const { visible } = this.props;
    console.log("total", this.state.totalPages);
    console.log("total", this.imageData);
    return (
      <div>
        <div className={visible ? "visible" : "disable"} id="order_list_home">
          <Button
            content="Save"
            icon="save"
            labelPosition="left"
            positive
            size="large"
            className='saveButton'
            onClick={this.handleSave}
          />
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadFunc}
            hasMore={this.state.hasMore}
            loader={<div className="loader">Loading ...</div>}
          >
            <Board
              data={this.imageData}
              draggable
              components={{ Card: customImageCard }}
              onDataChange={this.datachange}
            />
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}
