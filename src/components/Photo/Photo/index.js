import React, {Component} from 'react';
import './style.less';
import {Image , Grid, Checkbox} from 'semantic-ui-react'
import {Radio, Button} from 'antd';
import { PaperPlaneIcon, StarIcon, Heart_Icon, Plus_Icon, Zoom_Icon} from '../../../assets/icons'

const RadioGroup = Radio.Group;



class Photo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
        }
        this.handleCheck = this.handleCheck.bind(this);
        this.addToBucket =  this.addToBucket.bind(this);
    }

    componentDidUpdate(prevProps) {
        if(this.props.action != prevProps.action)
        {
            if(this.props.active == this.props.index){
                this.props.onClick(this.props, this.props.index, this.props.total);
            }
        }
        if(this.props.publish != prevProps.publish)
        {
            if(this.props.active + 1  == this.props.index){
                this.props.onClick(this.props, this.props.active, this.props.total -1);
            }
            if(this.props.total ==  this.props.active  + 1 && this.props.index == 0)
            {
                this.props.onClick(this.props, this.props.index, this.props.total -1);
            }
            
        }
    }
    onClickImage = () => {

        this.props.onClick(this.props)
    }

    handleCheck(){
        if(this.props.type == 'Submit_operation'){
            this.state.isChecked = !this.state.isChecked;
            this.setState({
                isChecked: this.state.isChecked
            })
            this.props.onClick(this.props, this.state.isChecked)
        }else if(this.props.type == 'home_list'){
            this.props.onClick(this.props.photo);
        }else if(this.props.type == 'admin_photolist')
        {
            this.props.onClick(this.props, this.props.index, this.props.total);
        }
    }

    addToBucket(){
        this.props.addToBucket(this.props.photo, true)
    }

    render() {
        const {active, index, photo, type} = this.props;
        return (
                <div className={(this.state.isChecked )? 'photo-content active': 'photo-content'}  id={index == active ? 'active' : ''}>
                    <div className="photo-header">
                        {
                            type == 'Submit_operation' ? (
                                <Checkbox value={this.state.isChecked} className="ddd" onClick={this.handleCheck}  checked={this.state.isChecked}  />  
                            ) : null
                        }
                        {
                            type == 'home_list' ? (
                                <div>
                                    <a target='blank' href={photo.url_fr}><Zoom_Icon className="detail_Icon Zoom-icon" /></a>
                                    <Heart_Icon className="detail_Icon Heart-icon" />
                                    <a onClick={this.addToBucket}><Plus_Icon className="detail_Icon Plus-icon" /></a>
                                    <p className="owner_content">{photo.owner}</p>    
                                </div>    
                            ) : null
                        }
                        
                    </div>
                    <img onClick={this.handleCheck} src={photo.url_fr} id={index}  value={photo} />
                </div>
        );
    }
}

export default Photo;