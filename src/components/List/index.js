
import React, {Component} from 'react';
import './style.less';
import {List, Button} from 'semantic-ui-react'

class ListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecked: false,
            AttachFlag: true
        }
        this.handleClickAttach = this.handleClickAttach.bind(this)
    }
    handleClickAttach(){
      this.setState({
        AttachFlag: !this.state.AttachFlag
      })
    }

    render() {
        return ( 
          <List divided relaxed className="ListComponent">
            <List.Item>
              <List.Icon name='home' size='large' verticalAlign='middle' />
              <List.Content>
        <Button onClick={this.handleClickAttach}>{this.state.AttachFlag ? "Attach" : "Attached"}</Button>
                <List.Header as='a'>Passport</List.Header>
                <List.Description as='a'>Property release</List.Description>
              </List.Content>
            </List.Item>
          </List>
        );
    }
}

export default ListComponent;
