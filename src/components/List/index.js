
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
    }

    componentDidMount(){
      this.getListReleaseForUser()
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
    handleClickAttach(){
      this.setState({
        AttachFlag: !this.state.AttachFlag
      })
    }

    render() {
      const ReleaseView = [];
      var searchReleases = [];
      var resultRelease = [];
      if(!this.props.type || this.props.type == 'all')
        {
          searchReleases = this.state.Releases
        }else{
          for(let i=0; i<this.state.Releases.length; i++)
          {
            if(this.state.Releases[i].authorizationKind == this.props.type)
            {
              searchReleases.push(this.state.Releases[i])
            }
          }
        }
      if(this.props.searchKey)
      {
        for(let j=0; j < searchReleases.length; j++)
        {
          if(searchReleases[j].caption.includes(this.props.searchKey))
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
                <Button onClick={this.handleClickAttach}>{this.state.AttachFlag ? "Attach" : "Attached"}</Button>
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
