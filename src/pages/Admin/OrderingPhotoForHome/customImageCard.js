import React, {Component} from "react";
import {Button, Icon, Label} from 'semantic-ui-react'
import data from "./data.json";
import "./style.less";
import Board from "react-trello";

export default class customImageCard extends Component {

    render(){
        const {id, title, description, url} =  this.props;
        return (
            <div className='ImageContent'>
                <div className='Image'>
                <img src={url} /> 
                </div>
                <Button as='div' className='view ImageButton' labelPosition='right'>
                  <Button color='gray'>
                    <Icon name='eye' />
                    
                  </Button>
                  <Label as='a' basic color='gray' pointing='left'>
                    10
                  </Label>
                </Button>
                <Button as='div' className='love ImageButton' labelPosition='right'>
                  <Button color='red'>
                    <Icon name='heart' />
                    {/* Like */}
                  </Button>
                  <Label as='a' basic color='red' pointing='left'>
                    20
                  </Label>
                </Button>
                <Button as='div' className='download ImageButton' labelPosition='right'>
                  <Button color='blue'>
                    <Icon name='download' />
                    
                  </Button>
                  <Label as='a' basic color='blue' pointing='left'>
                    10
                  </Label>
                </Button>
            </div>

          );
    }
}


