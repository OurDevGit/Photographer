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
            isChecked: false
        }
        this.handleCheck = this.handleCheck.bind(this);
    }

    onClickImage = () => {
        this.props.onClick(this.props)
    }

    handleCheck(){
        if(this.props.type == 'submit_operation'){
            this.state.isChecked = !this.state.isChecked;
            this.setState({
                isChecked: this.state.isChecked
            })
            this.props.onClick(this.props, this.state.isChecked)
        }

    }

    render() {
        console.log("~~~~~~~~~~", this.props.photo)
        const {active, index, photo, type} = this.props;
        return (
            <div className={(this.state.isChecked )? 'photo-content active': 'photo-content'}>
                <div className="photo-header">
                    {
                        type == 'Submit_operation' ? (
                            <Checkbox value={this.state.isChecked} className="ddd"  checked={this.state.isChecked}  />  
                        ) : null
                    }
                <Heart_Icon className="detail_Icon Heart-icon" />
                <Plus_Icon className="detail_Icon Plus-icon" />   
                <Zoom_Icon className="detail_Icon Zoom-icon" />
                    <p className="owner_content">{photo.owner}</p>        
                </div>
                <img onClick={this.handleCheck} src={photo.url_fr} id={index}  value={photo} />
            </div>

        );
    }
}

export default Photo;