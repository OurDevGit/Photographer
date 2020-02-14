import React, {Component} from "react";

import data from "./data.json";
import "./style.less";
import Board from "react-trello";

export default class customImageCard extends Component {

    render(){
        const {id, title, description, url} =  this.props;
        return (
            <div className='Image'>
             <img src={url} /> 
            </div>
          );
    }
}


