import _ from 'lodash'
import React, {Component} from 'react';
import { Button, Header, Icon, Image, Modal, Label, Dropdown } from 'semantic-ui-react'
import { Heart_Icon, Plus_Icon, Zoom_Icon, CloseIcon} from '../../../assets/icons'
import './style.less'

class Bucket extends Component {
    buckets = [ 
        { key: 'af', value: 'African', text: 'African' },
        { key: 'afam', value: 'African American', text: 'African American' },
        { key: 'bl', value: 'Black', text: 'Black' },
        { key: 'br', value: 'Brazilian', text: 'Brazilian' },
        { key: 'ch', value: 'Chinese', text: 'Chinese' },
        { key: 'ca', value: 'Caucasian', text: 'Caucasian' },
        { key: 'es', value: 'East Asian', text: 'East Asian' },
        { key: 'hi', value: 'Hispanic(Latin)', text: 'Hispanic(Latin)' },
        { key: 'jp', value: 'Japanese', text: 'Japanese' },
        { key: 'me', value: 'Middle Eastern', text: 'Middle Eastern' },
        { key: 'na', value: 'Native American', text: 'Native American' },
        { key: 'pi', value: 'Pacific Islander', text: 'Pacific Islander' },
        { key: 'sa', value: 'South Asian', text: 'South Asian' },
        { key: 'sea', value: 'Southeast Asian', text: 'Southeast Asian' },
      ];
    constructor(props) {
        super(props);
        this.state = {
            rating: 108,
            currentBucketValues:[]
        }
        this.handleClose = this.handleClose.bind(this);
        this.addToPreferred =  this.addToPreferred.bind(this);
        this.handleMultiSelectAddition = this.handleMultiSelectAddition.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
    }
    handleClose(){
      this.props.handleClose(false)
    }

    addToPreferred(){
      this.setState({
        rating: this.state.rating + 1
      })
    }

    handleMultiSelectAddition = (e, { value }) => {
        this.setState((prevState) => ({
          buckets: [{ text: value, value }, ...prevState.tags],
        }))
      }
    
      handleMultiSelectChange = (e, { value }) => {
        this.state.currentBucketValues = value;
        this.setState({ 
          currentBucketValues: value,
        })
        console.log(this.state.currentBucketValues)
      }

    render() {
      const {show, photo} = this.props;
      const keywords = [];
      console.log(this.buckets)
      this.buckets.forEach((bucket, bucketIndex) => {
        keywords.push(<button>{bucket.value}</button>)
      });
      return(
        <Modal open={show} className='Bucket'>
          <Modal.Header>
            Bucket
            <a onClick={this.handleClose}><CloseIcon className='close_icon' /></a>
          </Modal.Header>
          <Modal.Content image className="modal_content" >
            <Image size='medium' src={photo.url_fr} wrapped />
            <Modal.Description>
              <Header></Header>
              <div className='existingBuckets'>
                <p>Existing Buckets:</p>
                {keywords}
              </div>
              <div className='AddBucket'>
                  <p>Add To Bucket</p>
                <Dropdown
                    options={this.buckets}
                    placeholder='Choose Keywords'
                    search
                    selection
                    fluid
                    multiple
                    allowAdditions
                    value={this.state.currentBucketValues}
                    onAddItem={this.handleMultiSelectAddition}
                    onChange={this.handleMultiSelectChange}
                  />
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button primary>
              Save <Icon name='chevron right' />
            </Button>
          </Modal.Actions>
        </Modal>
      )
      
  }
}

export default Bucket;