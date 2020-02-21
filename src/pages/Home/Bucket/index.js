import _ from 'lodash'
import React, {Component} from 'react';
import { Button, Header, Icon, Image, Modal, Label, Dropdown, Input } from 'semantic-ui-react'
import { Heart_Icon, Plus_Icon, Zoom_Icon, CloseIcon} from '../../../assets/icons'
import {getListOfBaskets, addNewBasketForUser, addToBasketForPhoto} from '../../../util/APIUtils'
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
            baskets:[],
            currentBucketValues:[]
        }
        this.loadBasketsForUser =  this.loadBasketsForUser.bind(this)
        this.handleClose = this.handleClose.bind(this);
        this.addToPreferred =  this.addToPreferred.bind(this);
        this.handleMultiSelectAddition = this.handleMultiSelectAddition.bind(this);
        this.handleMultiSelectChange = this.handleMultiSelectChange.bind(this);
        this.addNewBasket = this.addNewBasket.bind(this)
        this.addToBasket = this.addToBasket.bind(this)
    }

    componentDidMount(){
      console.log(
        "sfdf"
      )
      this.loadBasketsForUser();
    }

    loadBasketsForUser() {
      getListOfBaskets()
      .then(response => {
        
        let basketlist = response.map((basket)=>{
          return{
            key: basket.id,
            value: basket.value,
            text: basket.value
          }
        });
        console.log("_+_+_+_+_", basketlist)
        this.setState({
          baskets: basketlist,
          isLoading:false
        });
      }).catch(error => {
        console.log("error", error)
        this.setState({
          isLoading: false
        });  
      });
    }

    handleClose(){
      this.props.handleClose(false)
    }

    addToPreferred(){
      this.setState({
        rating: this.state.rating + 1
      })
    }

    addNewBasket(newBasket){
      console.log("newBasket", newBasket)
      addNewBasketForUser(newBasket)
        .then(response=>{
          console.log("ADDBASket",response)
        })
        .catch(error=>{
          console.log('error', error)
        })
    }

    handleMultiSelectAddition = (e, { value }) => {
        this.setState((prevState) => ({
          baskets: [{ text: value, value }, ...prevState.baskets],
        }))
      }
    
    handleMultiSelectChange = (e, { value }) => {
      if(value.length > this.state.currentBucketValues.length)
      {
        let i=0;
        for(i=0; i<this.state.baskets.length; i++)
        {
          if(this.state.baskets[i].value == value[value.length-1]){
            i = this.state.baskets.length + 10
          }
        }
        if(i == this.state.baskets.length){
          this.addNewBasket(value[value.length-1]);
        }
        console.log("^^^^^^^^^^^^^^",i)
      }
        this.state.currentBucketValues = value;
        this.setState({ 
          currentBucketValues: value,
        })
        console.log(this.state.currentBucketValues)
    }

    addToBasket(){
      
      var Request={
        "photoId": this.props.photo.id,
        "baskets": this.state.currentBucketValues
      }
      console.log(Request)
      addToBasketForPhoto(Request)
        .then(response=>{
          console.log("add_to_basket_for User", response)
        })
        .catch(error=>{
          console.log(error)
        })
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
                    options={this.state.baskets}
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
            <Button primary onClick={this.addToBasket}>
              Save <Icon name='chevron right' />
            </Button>
          </Modal.Actions>
        </Modal>
      )
      
  }
}

export default Bucket;