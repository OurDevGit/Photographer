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
        console.log(this.props)
        return (
            <div className={this.props.active == this.props.index ? 'photo-content active': 'photo-content'}>
                <div className="photo-header">
                    {/* link: {this.props.address} */}
                    
                </div>
                <img onClick={this.props.onClick} src={this.props.photo.url_lr} id={this.props.index}  />
            </div>

        );
    }
}

export default Photo;