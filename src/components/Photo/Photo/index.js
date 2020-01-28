import React, {Component} from 'react';
import './style.less';
import {Image , Grid} from 'semantic-ui-react'
import {Radio, Button} from 'antd';

const RadioGroup = Radio.Group;

class Photo extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div className="photo-content">
                <div className="photo-header">
                    {/* link: {this.props.address} */}
                    
                </div>
                <img src={this.props.photo.url_lr}/>
            </div>

        );
    }
}

export default Photo;