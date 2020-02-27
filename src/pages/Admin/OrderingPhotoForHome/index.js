import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Button} from 'semantic-ui-react'
import data from "./data.json";
import "./style.less";
import Board from "react-trello";
import customImageCard from "./customImageCard"
import {updateChoosedForHome, getNotChoosenForHome, getPhotoLists} from '../../../util/APIUtils' 
import {notification} from 'antd'

export default class OrderingPhotoForHome extends Component {

  imageData = {
    "lanes": [
      {
        "id": "PLANNED",
        "title": "Publicated Photos",
        "label": "",
        "style": {
          "width": 400,
          "border-right": "1px solid"
        },
        "cards": []
      },
      {
        "id": "HOMELIST",
        "title": "First",
        "label": "",
        "style": {
          "width": 400
        },
        "cards": []
      }
    ]
  }
  
    constructor(props)
    {

      super(props);
      this.state = {
        NotChoosenForHome:[],
        photosForHome:[],
        presentData:{}
      }
      this.loadNotChoosenForHome =  this.loadNotChoosenForHome.bind(this)
      this.loadHomeList = this.loadHomeList.bind(this)
      this.datachange = this.datachange.bind(this)
      this.handleSave =  this.handleSave.bind(this)
    }

    componentDidMount(){
      this.imageData = {
        "lanes": [
          {
            "id": "PLANNED",
            "title": "Publicated Photos",
            "label": "",
            "style": {
              "width": 400,
              "border-right": "1px solid"
            },
            "cards": []
          },
          {
            "id": "HOMELIST",
            "title": "First",
            "label": "",
            "style": {
              "width": 400
            },
            "cards": []
          }
        ]
      }
      this.loadNotChoosenForHome();
      this.loadHomeList()
    }

    componentDidUpdate(prevProps){
      if(this.props.visible == false)
      {

      }
    }

    loadNotChoosenForHome(){
      getNotChoosenForHome()
      .then(response=>{
        var i=0;
        response.content.forEach(photo => {
          i++;
          var card = {
            'id': photo.id,
            'photoid':photo.id + '',
            'title': photo.title,
            'description': photo.description,
            'url': photo.url_lr,
            'laneId': "PLANNED",
            'views': photo.viewed ? photo.viewed : 0,
            'likes': photo.likes ? photo.likes : 0,
            'downloads': photo.downloads? photo.downloads : 0
          }
          this.imageData.lanes[0].cards.push(card)
        });
        this.imageData.lanes[0].label = i
        this.setState({
          NotChoosenForHome: response.content
        })

      })
      .catch(error=>{
        console.log("eror", error)
      })
    }

    loadHomeList(){
      getPhotoLists(0, 30)
      .then(response=>{
        console.log(response)
        var i=0;
        response.content.forEach(photo => {
          i++;
          var card = {
            'id': photo.id,
            'photoid':photo.id + '',
            'title': photo.title,
            'description': photo.description,
            'url': photo.url_lr,
            'laneId': "HOMELIST",
            'views': photo.viewed ? photo.viewed : 0,
            'likes': photo.likes ? photo.likes : 0,
            'downloads': photo.downloads? photo.downloads : 0
          }
          this.imageData.lanes[1].cards.push(card)
        });
        this.imageData.lanes[1].label = i
        this.setState({
            photosForHome: response.content
        })

      })
      .catch(error=>{
        console.log("eror", error)
      })
    }

    datachange(newData){
      newData.lanes[0].label = newData.lanes[0].cards.length;
      newData.lanes[1].label = newData.lanes[1].cards.length;
      this.setState({
        presentData: newData
      })
    }

    handleSave(){
      var NotChoosed = [];
      var HomeList = [];
      for(let i=0; i<2; i++)
      {
        if(this.state.presentData.lanes[i].id == 'PLANNED'){
          for(let j=0; j<this.state.presentData.lanes[i].cards.length; j++){
            NotChoosed.push({'photoId':this.state.presentData.lanes[i].cards[j].photoid});
          }
        }else{
          for(let j=0; j<this.state.presentData.lanes[i].cards.length; j++){
            HomeList.push({'photoId':this.state.presentData.lanes[i].cards[j].photoid});
          }
        }
      }
      updateChoosedForHome(HomeList)
       .then(response => {
         console.log(response)
         notification.success({
          message: 'Photoing App',
          description: "Success to updates photos for home!"
         });     
       })
       .catch(error => {
         console.log("error", error)
       })
    }

    render(){
      const {visible} =  this.props;
        return (
          <div>
            <div className={visible ? 'visible': 'disable'} id='order_list_home'>
              <Button content='Save' icon='save' labelPosition='left' positive size='large' onClick={this.handleSave} />
              <Board data={this.imageData} draggable components={{Card: customImageCard}} onDataChange={this.datachange} />
            </div>
          </div>
        );
    }
}


