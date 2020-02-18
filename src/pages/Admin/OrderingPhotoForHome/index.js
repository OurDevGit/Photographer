import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Button} from 'semantic-ui-react'
import data from "./data.json";
import "./style.less";
import Board from "react-trello";
import customImageCard from "./customImageCard"
import {getAdminPublicationPhotoList} from '../../../util/APIUtils' 
export default class OrderingPhotoForHome extends Component {

  imageData = data
    constructor(props)
    {

      super(props);
      this.state = {
        publicated_photos:[]
      }
      this.loadPublicatedPhotosList =  this.loadPublicatedPhotosList.bind(this)
    }

    componentDidMount(){
      
      this.loadPublicatedPhotosList();
    }

    componentDidUpdate(prevProps){
      console.log("ddddddddddddddddddddddddddddddd")
      if(this.props.visible == false)
      {

      }
    }

    loadPublicatedPhotosList(){
      getAdminPublicationPhotoList("list_accepted_photos")
      .then(response=>{
        var i=0;
        response.forEach(photo => {
          i++;
          var card = {
            'id': i,
            // 'photoid':photo.id + '',
            'title': photo.title,
            'description': photo.description,
            'url': photo.url_lr,
            'laneId': "PLANNED"
          }
          this.imageData.lanes[0].cards.push(card)
        });
        this.setState({
          publicated_photos: response
        })

      })
      .catch(error=>{
        console.log("eror", error)
      })
    }

    datachange(newData){
      console.log("Change__+________________________", newData)
    }

    render(){
      const {visible} =  this.props;
      console.log("____________", this.imageData)
        return (
          <div>
            <div className={visible ? 'visible': 'disable'} id='order_list_home'>
              <Button content='Save' icon='save' labelPosition='left' positive size='large' />
              <Board data={this.imageData} draggable components={{Card: customImageCard}} onDataChange={this.datachange} />
            </div>
          </div>
        );
    }
}


