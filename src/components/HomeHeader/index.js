/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-webpack-loader-syntax */
import React from 'react'
import { Menu, Grid, Image, Button, Dropdown } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import Avatar from '../Avatar'
import QuestionSVG from '-!svg-react-loader!../../assets/images/question.svg'
import logoPng from '../../assets/images/logo.PNG'
import mobileMenuPng from '../../assets/images/mobile-menu.png'
import mobileCloseMenuPng from '../../assets/images/cross.png'
import { PaperPlaneIcon, StarIcon } from '../../assets/icons'
import './header.less'

const style = {
  noPaddingStyle: {
    padding: 0,
  },
}

class HomeHeader extends React.Component {
  constructor(props) {
      super(props);   
      this.handleMenuClick = this.handleMenuClick.bind(this);   
  }
  state = {
    mobileMenuOpen: false,
  }

  openMobileMenu = (status) => {
    this.setState({ mobileMenuOpen: status })
  }

  openContactUsModal = () => {
    window.Intercom('showNewMessage')
  }

  handleMenuClick({ key }) {
    if(key === "logout") {
      this.props.onLogout();
    }
  }

  render() {
    const { mobileMenuOpen } = this.state
    let menuItems;
    if(this.props.currentUser) {
      menuItems = [
        <Menu.Item as={NavLink} to="/addContent">
        <StarIcon className="star-icon" />
        AddContent
      </Menu.Item>, 
      <Menu.Item as={NavLink} to='/dd'>
        <PaperPlaneIcon className="paper-plane-icon" />
        Photos
      </Menu.Item>,
      <Menu.Item >
        <Avatar fullname="Tatyana" status="online" />
          <Dropdown item >
            <Dropdown.Menu>
              <Dropdown.Item as={NavLink} to='/user/profile'>My account</Dropdown.Item>
              <Dropdown.Item as={NavLink} onClick={this.props.onLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
      </Menu.Item>
      ]; 
    } else {
      menuItems = [
        <Button
          as="a"
          href="/user/login"
          primary
          basic
          className="investBtnStyle login-btn"
        >
          Log in
        </Button>
      ]
    }
    return (
      <div className="home-header">
        <Grid container>
          <Grid.Row only="computer">
            <Grid.Column>
              <Menu borderless className="desktop-menu-style">
                <NavLink to="/"><Image src={logoPng} className="logo" /></NavLink>
                <Menu.Item position="right" style={style.noPaddingStyle}>
                    {menuItems}
                  
                </Menu.Item>
              </Menu>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row only="mobile tablet" className={mobileMenuOpen ? 'mobile-navbar open' : 'mobile-navbar'}>
            <Grid.Column width={16}>
              <Menu borderless className="mobile-navmenu">
                <Menu.Item header as={NavLink} to="/">
                  <Image src={logoPng} style={{ width: 130 }} />
                </Menu.Item>
                <Menu.Item position="right" style={style.noPaddingStyle}>
                  <Menu.Item onClick={() => this.openMobileMenu(!mobileMenuOpen)}>
                    {!mobileMenuOpen && <Image src={mobileMenuPng} style={{ width: 36 }} />}
                    {mobileMenuOpen && <Image src={mobileCloseMenuPng} style={{ width: 36 }} />}
                  </Menu.Item>
                </Menu.Item>
              </Menu>
            </Grid.Column>
            {mobileMenuOpen
              && (
                <Grid.Column width={16} onClick={() => this.openMobileMenu(false)}>
                  <Menu borderless vertical>
                    <Menu.Item style={style.noPaddingStyle}>
                      <Menu.Item as={NavLink} to="/founders">
                        <StarIcon className="star-icon" />
                        Images
                      </Menu.Item>
                      <Menu.Item as="a" onClick={this.openContactUsModal}>
                        <PaperPlaneIcon className="paper-plane-icon" />
                        Contact us
                      </Menu.Item>
                      <Menu.Item as="a" href="http://help.fairmint.co/en" target="_blank">
                        <QuestionSVG className="verticalMenuItemSvgStyle" />
                        Help
                      </Menu.Item>
                    </Menu.Item>
                    <Grid.Column width={16}>
                      <Button
                        as="a"
                        href="https://preview.fairmint.co/signin"
                        primary
                        basic
                        className="login-btn"
                      >
                        Log in
                      </Button>
                    </Grid.Column>
                  </Menu>
                </Grid.Column>
              )}
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default HomeHeader
