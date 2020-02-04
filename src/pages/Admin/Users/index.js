import React, {Component} from 'react'
import { Icon, Label, Menu, Table } from 'semantic-ui-react'
import './style.less'
class Users extends Component 
{
    constructor(props) {
        super(props);
        this.state = {
          currentUser: null,
          isAuthenticated: false,
          isLoading: false,
          visible: ''
        }
      }
    render(){
        const {visible} =  this.props
        return(
            <Table className={visible ? 'visible': 'disable'} celled>
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>no</Table.HeaderCell>
                    <Table.HeaderCell>FullName</Table.HeaderCell>
                    <Table.HeaderCell>Username</Table.HeaderCell>
                    <Table.HeaderCell>Email</Table.HeaderCell>
                    <Table.HeaderCell>loginStatus</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                <Table.Row>
                    <Table.Cell>
                    <Label ribbon>First</Label>
                    </Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>
                    <Table.Cell>Cell</Table.Cell>

                </Table.Row>
                </Table.Body>

                <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colSpan='5'>
                    <Menu floated='right' pagination>
                        <Menu.Item as='a' icon>
                        <Icon name='chevron left' />
                        </Menu.Item>
                        <Menu.Item as='a'>1</Menu.Item>
                        <Menu.Item as='a'>2</Menu.Item>
                        <Menu.Item as='a'>3</Menu.Item>
                        <Menu.Item as='a'>4</Menu.Item>
                        <Menu.Item as='a' icon>
                        <Icon name='chevron right' />
                        </Menu.Item>
                    </Menu>
                    </Table.HeaderCell>
                </Table.Row>
                </Table.Footer>
            </Table>
        )
    }
}  

export default Users
