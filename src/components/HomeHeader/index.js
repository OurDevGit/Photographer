/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
import React from "react";
import { Menu, Grid, Image, Button, Dropdown, Icon } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import Avatar from "../Avatar";
import mobileMenuPng from "../../assets/images/mobile-menu.png";
import mobileCloseMenuPng from "../../assets/images/cross.png";
import logo from "../../assets/images/OpenShoots.gif";
import { PaperPlaneIcon, StarIcon } from "../../assets/icons";
import SearchBar from "../SearchBar";
import "./header.less";

const style = {
  noPaddingStyle: {
    padding: 0,
  },
};

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
  }
  state = {
    mobileMenuOpen: false,
  };

  openMobileMenu = (status) => {
    this.setState({ mobileMenuOpen: status });
  };

  openContactUsModal = () => {
    window.Intercom("showNewMessage");
  };

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

  clickSearch(e) {
    this.props.clickSearch(e);
  }

  render() {
    const { mobileMenuOpen } = this.state;
    const { currentUser } = this.props;
    let menuItems;
    if (currentUser) {
      if (currentUser.authorities.length == 2) {
        menuItems = [
          <Menu.Item key="1" as={NavLink} to="/admin">
            <StarIcon className="star-icon" />
            AdminDashboard
          </Menu.Item>,
          <Menu.Item key="2">
            <StarIcon className="star-icon" />
            <Dropdown text="My contributions" icon="">
              <Dropdown.Menu>
                <Dropdown.Item
                  text="Add content"
                  as={NavLink}
                  to="/addContent"
                />
                <Dropdown.Item
                  text="Submission Manager"
                  as={NavLink}
                  to="/submitContent"
                />
                <Dropdown.Item
                  text="Published Photos"
                  as={NavLink}
                  to="/photomodify"
                />
                <Dropdown.Item text="Analyse" as={NavLink} to="/analyse" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>,
          <Menu.Item key="3">
            <PaperPlaneIcon className="paper-plane-icon" />
            <Dropdown text="My usage" icon="">
              <Dropdown.Menu>
                <Dropdown.Item
                  text="My Downloaded Photo"
                  as={NavLink}
                  to="/downloadedPhotos"
                />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>,
          <Menu.Item key="4">
            <PaperPlaneIcon className="paper-plane-icon" />
            <Dropdown text="My Community" icon="">
              <Dropdown.Menu>
                <Dropdown.Item text="My Follows" as={NavLink} to="/follows" />
                <Dropdown.Item text="Messages" as={NavLink} to="/messages" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>,
          <Menu.Item key="5" as={NavLink} to="/">
            <Icon name="alarm" />
          </Menu.Item>,
          <Menu.Item key="6" className="myAccount">
            <Avatar fullname={currentUser.username} avartarUrl={currentUser.avatar} status="online" />
            <Dropdown item>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={NavLink}
                  to={"/user/profile/" + currentUser.id}
                >
                  My account
                </Dropdown.Item>
                <Dropdown.Item>
                  <a onClick={this.props.onLogout}>Logout</a>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>,
        ];
      } else {
        if (currentUser.authorities[0].authority == "ROLE_USER") {
          menuItems = [
            <Menu.Item key="2">
              <StarIcon className="star-icon" />
              <Dropdown text="My contributions" icon="">
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="Add content"
                    as={NavLink}
                    to="/addContent"
                  />
                  <Dropdown.Item
                    text="Submission Manager"
                    as={NavLink}
                    to="/submitContent"
                  />
                  <Dropdown.Item
                    text="Published Photos"
                    as={NavLink}
                    to="/photomodify"
                  />
                  <Dropdown.Item text="Analyse" as={NavLink} to="/analyse" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>,
            <Menu.Item key="3">
              <PaperPlaneIcon className="paper-plane-icon" />
              <Dropdown text="My usage" icon="">
                <Dropdown.Menu>
                  <Dropdown.Item
                    text="My Downloaded Photo"
                    as={NavLink}
                    to="/downloadedPhotos"
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>,
            <Menu.Item key="4">
              <PaperPlaneIcon className="paper-plane-icon" />
              <Dropdown text="My Community" icon="">
                <Dropdown.Menu>
                  <Dropdown.Item text="My Follows" as={NavLink} to="/follows" />
                  <Dropdown.Item text="Messages" as={NavLink} to="/messages" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>,
            <Menu.Item key="5" as={NavLink} to="/">
              <Icon name="alarm" />
            </Menu.Item>,
            <Menu.Item key="6" className="myAccount">
              <Avatar fullname={currentUser.username} status="online" />
              <Dropdown item>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={NavLink}
                    to={"/user/profile/" + currentUser.id}
                  >
                    My account
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <a onClick={this.props.onLogout}>Logout</a>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>,
          ];
        } else if (currentUser.authorities[0].authority == "ROLE_ADMIN") {
          menuItems = [
            <Menu.Item key="1" as={NavLink} to="/admin">
              <StarIcon className="star-icon" />
              AdminDashboard
            </Menu.Item>,
            <Menu.Item key="6" className="myAccount">
              <Avatar fullname={currentUser.username} status="online" />
              <Dropdown item>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={NavLink}
                    to={"/user/profile/" + currentUser.id}
                  >
                    My account
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <a onClick={this.props.onLogout}>Logout</a>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>,
          ];
        }
      }
    } else {
      menuItems = [
        <Button
          key="1"
          as="a"
          href="/user/LoginAndSignUp"
          className="investBtnStyle login-btn"
        >
          Login or SignUp
        </Button>,
        // <Button
        //   as="a"
        //   href="/user/signUp"
        //   primary
        //   basic
        //   className="investBtnStyle login-btn"
        // >
        //   Sign Up
        // </Button>
      ];
    }
    return (
      <div className="home-header">
        <Grid container>
          <Grid.Row only="computer">
            <Grid.Column>
              <Menu borderless className="desktop-menu-style">
                {this.props.Back ? (
                  <Menu.Item
                    as="a"
                    className="BackIcon"
                    style={style.noPaddingStyle}
                  >
                    <Icon
                      name="arrow left"
                      size="large"
                      onClick={this.props.Back}
                    />
                  </Menu.Item>
                ) : null}
                <NavLink to="/">
                  <Image src={logo} className="logo" />
                </NavLink>
                <Menu.Item position="right" style={style.noPaddingStyle}>
                  {menuItems}
                </Menu.Item>
                <SearchBar
                  clickSearch={this.clickSearch}
                  handleSearchTag={this.props.handleSearchTag}
                />
              </Menu>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            only="mobile tablet"
            className={mobileMenuOpen ? "mobile-navbar open" : "mobile-navbar"}
          >
            <Grid.Column width={16}>
              <Menu borderless className="mobile-navmenu">
                <Menu.Item header as={NavLink} to="/">
                  <Image src={logo} style={{ width: 130 }} />
                </Menu.Item>
                <Menu.Item position="right" style={style.noPaddingStyle}>
                  {currentUser ? (
                    <Menu.Item className="myAccountMobile">
                      <Avatar fullname={currentUser.username} status="online" />
                      <Dropdown item floating>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            as={NavLink}
                            to={"/user/profile/" + currentUser.id}
                          >
                            My account
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <a onClick={this.props.onLogout}>Logout</a>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                  ) : null}
                  <Menu.Item
                    onClick={() => this.openMobileMenu(!mobileMenuOpen)}
                  >
                    {!mobileMenuOpen && (
                      <Image src={mobileMenuPng} style={{ width: 36 }} />
                    )}
                    {mobileMenuOpen && (
                      <Image src={mobileCloseMenuPng} style={{ width: 36 }} />
                    )}
                  </Menu.Item>
                </Menu.Item>
              </Menu>
              <SearchBar
                clickSearch={this.clickSearch}
                handleSearchTag={this.props.handleSearchTag}
              />
            </Grid.Column>
            {mobileMenuOpen && (
              <Grid.Column
                width={16}
                onClick={() => this.openMobileMenu(false)}
              >
                <Menu borderless vertical>
                  {menuItems}
                </Menu>
              </Grid.Column>
            )}
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default HomeHeader;
