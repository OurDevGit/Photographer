import React, {Component} from 'react';
import './style.less';

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
                    link: {this.props.address}
                </div>

            </div>

        );
    }
}

export default Photo;