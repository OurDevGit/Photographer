import React, {Component} from 'react';
import './style.less';
import {Image , Grid, Checkbox} from 'semantic-ui-react'
import {Radio, Button} from 'antd';

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
        this.state.isChecked = !this.state.isChecked;
        console.log(this.state.isChecked)
        this.setState({
            isChecked: this.state.isChecked
        })
        this.props.onClick(this.props, this.state.isChecked)
    }

    render() {
        const {active, index, photo} = this.props;
        return (
            <div className={(this.state.isChecked )? 'photo-content active': 'photo-content'}>
                <div className="photo-header">
                    {/* link: {this.props.address} */}
                    <Checkbox value={this.state.isChecked} className="ddd"  checked={this.state.isChecked}  />
                </div>
                <img onClick={this.handleCheck} src={photo.url_fr} id={index}  value={photo} />
            </div>

        );
    }
}

export default Photo;