import React, {Component} from 'react';
import './style.less';
import {Image , Grid} from 'semantic-ui-react'
import {Radio, Button} from 'antd';

const RadioGroup = Radio.Group;



class Photo extends Component {

    constructor(props) {
        super(props);
    }

    onClickImage = () => {
        this.props.onClick(this.props)
    }

    render() {
        const {active, index, photo} = this.props;

        console.log(this.props)
        return (
            <div className={active == index ? 'photo-content active': 'photo-content'}>
                <div className="photo-header">
                    {/* link: {this.props.address} */}
                    
                </div>
                <img onClick={this.onClickImage} src={photo.url_fr} id={index}  value={photo} />
            </div>

        );
    }
}

export default Photo;