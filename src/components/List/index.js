
import React, {Component} from 'react';
import './style.less';
import {List, Button} from 'semantic-ui-react'
import { getListAuthorizationForUser} from '../../util/APIUtils';
class ListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            AttachFlag: true,
            Releases: []
        }
        this.handleClickAttach = this.handleClickAttach.bind(this)
        this.getListReleaseForUser  =  this.getListReleaseForUser.bind(this);
        this.getCommonRelease =  this.getCommonRelease.bind(this)
    }

    componentDidMount(){
      this.getListReleaseForUser()
      // this.getCommonRelease(this.props.selImage, this.props.selImageIDs);
    }

    getListReleaseForUser(){
      this.setState({
        isLoading: true
      })
      getListAuthorizationForUser()
      .then(response => {
        this.setState({
          Releases: response.authorizationList,
          isLoading: false
        })

      }).catch(error => {
        this.setState({
          isLoading: false
        });  
      });
    }
    handleClickAttach(e, {name, value}){

      // if(name == 'attachAll')
      // {
      //   this.props.ReleaseScore[value] = 1;
      // }
      // console.log("AfsdAFsda", this.props.ReleaseScore)
      this.props.handleClickAttach(name, value);
      
    }

    getCommonRelease(images, IDs){
      var ReleaseScore = [];
      if(IDs.length == 1){
        var authorizations = images[IDs[0]].authorizations;
          for(let j=0; j<authorizations.length; j++)
          {
              ReleaseScore[authorizations[j].id] = 1;
          }
      }else{
        for(let i=0; i<IDs.length; i++)
        {
          var authorizations = images[IDs[i]].authorizations;
          for(let j=0; j<authorizations.length; j++)
          {
            if(ReleaseScore[authorizations[j].id] == i-1)
            {
              ReleaseScore[authorizations[j].id] = i;
            }else{
              ReleaseScore[authorizations[j].id] = 0;
            }
          }
          console.log("sfsdfasfsdfsafasd",ReleaseScore)
        }
      }
      this.setState({
        ReleaseScore
      })
    }

    render() {
      const {type, searchKey, ReleaseScore} =  this.props;
      const ReleaseView = [];
      var searchReleases = [];
      var resultRelease = [];
      if(!type || type == 'all')
        {
          searchReleases = this.state.Releases
        }else{
          for(let i=0; i<this.state.Releases.length; i++)
          {
            if(this.state.Releases[i].authorizationKind == type)
            {
              searchReleases.push(this.state.Releases[i])
            }
          }
        }
      if(searchKey)
      {
        for(let j=0; j < searchReleases.length; j++)
        {
          if(searchReleases[j].caption.includes(searchKey))
          {
            resultRelease.push(searchReleases[j])
          }
        }
      }else{
        resultRelease = searchReleases
      }
      resultRelease.forEach((Release, ReleaseIndex) => {
          ReleaseView.push(
            <List.Item>
              <List.Icon name='home' size='large' verticalAlign='middle' />
              <List.Content>
                {
                  ReleaseScore[Release.id] > 0 ? 
                  <div className='attachButtons'>
                    <Button name='attached' value={Release.id} onClick={this.handleClickAttach}>Attached</Button>
                  </div>
                  : null
                }
                {
                  ReleaseScore[Release.id] == 0 ? 
                  <div className='attachButtons'>
                    <Button name='attachAll' value={Release.id} onClick={this.handleClickAttach}>Attach to ALL</Button>
                    <Button name='removeAll' value={Release.id} onClick={this.handleClickAttach}>Remove from ALL</Button>
                  </div>
                  : null
                }
                {
                  !ReleaseScore[Release.id] && ReleaseScore[Release.id] != 0 ?
                  <div className='attachButtons'>
                    <Button name='attach' value={Release.id} onClick={this.handleClickAttach}>Attach</Button>
                  </div>
                  : null
                }
                {/* <Button onClick={this.handleClickAttach}>{this.state.AttachFlag ? "Attach" : "Attached"}</Button> */}
                <List.Header as='a'>{Release.caption}</List.Header>
                <List.Description as='a'>{Release.authorizationKind}</List.Description>
              </List.Content>
            </List.Item>
          )
      });
        return ( 
          <List divided relaxed className="ListComponent">
            {ReleaseView}
          </List>
        );
    }
}

export default ListComponent;
