import React, {Component} from "react";
import {Button, Icon, Label} from 'semantic-ui-react'
import data from "./data.json";
import "./style.less";
import Board from "react-trello";

export default class customImageCard extends Component {

    render(){
        const {id, likes, views, url, downloads} =  this.props;
        return (
            <div className='ImageContent'>
                <div className='Image'>
                <img src={url} /> 
                </div>
                <Button as='div' className='view ImageButton' labelPosition='right'>
                  <Button color='grey'>
                    <Icon name='eye' />
                    
                  </Button>
                  <Label as='a' basic color='grey' pointing='left'>
                    {/* {photo.viewed} */}{views}
                  </Label>
                </Button>
                <Button as='div' className='love ImageButton' labelPosition='right'>
                  <Button color='red'>
                    <Icon name='heart' />
                    {/* Like */}
                  </Button>
                  <Label as='a' basic color='red' pointing='left'>
                    {likes}
                  </Label>
                </Button>
                <Button as='div' className='download ImageButton' labelPosition='right'>
                  <Button color='blue'>
                    <Icon name='download' />
                    
                  </Button>
                  <Label as='a' basic color='blue' pointing='left'>
                    {downloads}
                  </Label>
                </Button>
            </div>

          );
    }
}


