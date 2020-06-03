import React, { Component } from "react";
import { Icon, Label, Menu, Table, Image } from "semantic-ui-react";
import { getUsers } from "../../../util/APIUtils";
import "./style.less";
import { get } from "animejs";
import { AvatarDefault } from "../../../assets/images/homepage";
import LoadingIndicator from "../../../common/LoadingIndicator";
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      visible: "",
      users: [],
    };

    this.loadUsers = this.loadUsers.bind(this);
  }
  componentDidMount() {
    this.loadUsers();
  }

  loadUsers() {
    this.setState({
      isLoading: true
    })
    getUsers(0, 20)
      .then((response) => {
        console.log(response);
        this.setState({
          users: response.content,
          isLoading:false
        });
      })
      .catch((error) => {
        console.log("error", error);
        this.setState({
          isLoading:false
        })
      });
  }
  render() {
    var arr_users = [];
    if (this.state.users.length > 0) {
      this.state.users.forEach((user, userIndex) => {
        arr_users.push(
          <Table.Row key={userIndex} onClick={this.handleGoUserProfile}>
            <Table.Cell>
              <Label ribbon>{userIndex + 1}</Label>
            </Table.Cell>
            <Table.Cell>
              <Image avatar src={user.avatar ? user.avatar : AvatarDefault} />
              <a href={"/user/profile/" + user.id}>{user.name}</a>
            </Table.Cell>
            <Table.Cell>{user.username}</Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>
              {user.roles.length == 2
                ? "Admin & User"
                : user.roles.length == 1 && user.roles[0].name == "ROLE_ADMIN"
                ? "Admin"
                : "User"}
            </Table.Cell>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
        );
      });
    }
    const { visible } = this.props;
    if(this.state.isLoading){
      return <LoadingIndicator />
    }
    return (
      <Table className={visible ? "visible" : "disable"} celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>no</Table.HeaderCell>
            <Table.HeaderCell>FullName</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>loginStatus</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{arr_users}</Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="6">
              <Menu floated="right" pagination>
                <Menu.Item as="a" icon>
                  <Icon name="chevron left" />
                </Menu.Item>
                <Menu.Item as="a">1</Menu.Item>
                <Menu.Item as="a">2</Menu.Item>
                <Menu.Item as="a">3</Menu.Item>
                <Menu.Item as="a">4</Menu.Item>
                <Menu.Item as="a" icon>
                  <Icon name="chevron right" />
                </Menu.Item>
              </Menu>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}

export default Users;
