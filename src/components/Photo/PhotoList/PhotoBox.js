import React, {Component, useState, useEffect } from "react";
import { Heart_Icon, Plus_Icon, Zoom_Icon} from '../../../assets/icons'
var MouseOverFlag;
class PhotoBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: [],
            photo_list: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            hasMore:true,
            isLoading: false
        };
        this.handleImageClick =  this.handleImageClick.bind(this)
        this.quickView =  this.quickView.bind(this)
        this.addToBucket = this.addToBucket.bind(this)
        this.onMouseOver =  this.onMouseOver.bind(this)
        this.onMouseOut = this.onMouseOut.bind(this)
    }

    handleImageClick(e){
        this.props.onClickImage(e)
    }

    quickView(){
        this.props.quickView(this.props.photo)
    }

    addToBucket(){
        this.props.addToBucket(this.props.photo, true)
    }
    onMouseOver(){
        this.MouseOverFlag =  setTimeout(this.quickView, 1000);
    }
    onMouseOut(){
        clearTimeout(this.MouseOverFlag);
    }

    render(){
        return(
            <div className="PhotoBox" onMouseOver = {this.onMouseOver} onMouseOut = {this.onMouseOut}>
                <a target='blank' onClick={this.quickView}><Zoom_Icon className="detail_Icon Zoom-icon" /></a>
                <Heart_Icon className="detail_Icon Heart-icon" />
                <a onClick={this.addToBucket}><Plus_Icon className="detail_Icon Plus-icon" /></a> 
                <img
                    id={this.props.photo.id}
                    src={this.props.photo.src}
                    width={this.props.photo.width}
                    height={this.props.photo.height}
                    // {...this.props.photo}
                    onClick={this.handleImageClick}
                />
            </div>
        )
    }
}

export default PhotoBox;
