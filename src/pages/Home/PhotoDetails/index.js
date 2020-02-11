import _ from 'lodash'
import React, {Component} from 'react';
import { Button, Header, Icon, Image, Modal, Label } from 'semantic-ui-react'
import { Heart_Icon, Plus_Icon, Zoom_Icon, CloseIcon} from '../../../assets/icons'
import './style.less'

class PhotoDetails extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rating: 108
        }
        this.handleClose = this.handleClose.bind(this);
        this.addToPreferred =  this.addToPreferred.bind(this);
        this.addToBucket = this.addToBucket.bind(this)
    }
    handleClose(){
      this.props.handleClose(false)
    }

    addToPreferred(){
      this.setState({
        rating: this.state.rating + 1
      })
    }

    addToBucket(){
      this.props.addToBucket(this.props.photo, true)
    }

    render() {
      const {show, photo} = this.props;
      const keywords = [];
      const tags = ["people", "paper"];
      tags.forEach((tag, tagIndex) => {
        keywords.push(<button>{tag}</button>)
      });
      var url = photo.url_fr + ''
      return(
        <Modal open={show} className='PhotoDetailModal'>
          <Modal.Header>
            {photo.title}
            <a onClick={this.handleClose}><CloseIcon className='close_icon' /></a>
          </Modal.Header>
          <Modal.Content className="modal_content" >
            <Modal.Description>
              <div className='image'>
                <Image src={photo.url_fr} wrapped />
                <a target='blank' href={photo.url_fr}><Zoom_Icon className="detail_Icon Zoom-icon" /></a>
                <a onClick={this.addToPreferred}><Heart_Icon className="detail_Icon Heart-icon"/></a>
                <a onClick={this.addToBucket}><Plus_Icon className="detail_Icon Plus-icon" /></a>   
                <Button as='div' className='loveImageButton' labelPosition='right'>
                  <Button color='red'>
                    <Icon name='heart' />
                    Like
                  </Button>
                  <Label as='a' basic color='red' pointing='left'>
                    {this.state.rating}
                  </Label>
                </Button>
              </div>
              
              <Header></Header>
              <p>
                This Content is created by <a href=""><b>{photo.owner}</b></a>.
              </p>
              <p>
                Image# <a href=""><b>{url.split('/')[url.split('/').length-1]}</b></a>.
              </p>
              <p>
                uploaded: <b> June 18, 2018 11:14 AM</b>
              </p>
              <p>
                Releases: <b> Has 1 model release</b>
              </p>
              <p>
                Descriptions: <b> {photo.description}</b>
              </p>
              <div className='keywords'>
                <p>Keywords</p>
                {keywords}
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button primary>
              <a href={'/Photo_details/' +  photo.id}>
                View Details <Icon name='chevron right' />
              </a>
            </Button>
          </Modal.Actions>
        </Modal>
      )
      
  }
}

export default PhotoDetails;