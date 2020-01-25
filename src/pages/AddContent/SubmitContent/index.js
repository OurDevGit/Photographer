import React, { Component } from 'react'
import { Grid, GridColumn, Image, Divider, Menu, Dropdown, Icon, Message, Form, Button, TextArea, Select , Accordion, Checkbox} from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'
import MetaTags from 'react-meta-tags'
import { getCurrentUser, getAllCategories } from '../../../util/APIUtils';
import { ACCESS_TOKEN } from '../../../constants';
import { HomeHeader, PhotoList, AvatarImage } from '../../../components'
import Footer from '../Footer'
import './style.less'
import {notification} from 'antd'

const style = {
  noPaddingStyle: {
    padding: 0,
  },
}

class SubmitContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: false,
      categories: [],
      activeIndex: 1
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  loadCurrentUser() {
    this.setState({
      isLoading: true
    });
    getCurrentUser()
    .then(response => {
      this.setState({
        currentUser: response,
        isAuthenticated: true,
        isLoading: false
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  loadAllCategories() {
    getAllCategories()
    .then(response => {
      this.setState({
        categories: response.categories,
      });
      console.log("categories",this.state.categories);
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false
    });

    this.props.history.push(redirectTo);
    
    notification[notificationType]({
      message: 'Photoing App',
      description: description,
    });
  }

  handleLogin() {
    notification.success({
      message: 'Photoing App',
      description: "You're successfully logged in.",
    });
    this.loadCurrentUser();
    this.props.history.push("/");
  }

  handleAccordionClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    return (
      <>
        <MetaTags>
          <title>Photographer - Image Platform</title>
        </MetaTags>
        <HomeHeader 
          isAuthenticated={this.state.isAuthenticated} 
          currentUser={this.state.currentUser} 
          onLogout={this.handleLogout}
        />
        <Grid className="pages page-index submit_page">
          <Grid.Row>
            <h2 class='content_title'>Submit Content</h2>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10} className='image_section'>
              <Grid.Row>
                <Grid.Column>
                  <Menu borderless className="desktop-menu-style">
                    <Menu.Item position="left" style={style.noPaddingStyle}>
                      <Menu.Item as={NavLink} to="/">
                        To submit(2)
                      </Menu.Item>
                      <Menu.Item as={NavLink} to="/">
                        Pending(0)
                      </Menu.Item>
                      <Menu.Item className='ReviewedMenu' as={NavLink} to="/">
                        Reviewed(0)
                      </Menu.Item>
                      <Dropdown item text="Images">
                        <Dropdown.Menu>
                          <Dropdown.Item as={NavLink} to='/'>Images</Dropdown.Item>
                          <Dropdown.Item as={NavLink} to='/'>Videos</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Menu.Item>
                      <Menu.Item position='right'>
                        <Dropdown item text="Newest">
                          <Dropdown.Menu>
                            <Dropdown.Item as={NavLink} to='/'>Newest</Dropdown.Item>
                            <Dropdown.Item as={NavLink} to='/'>Oldest</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </Menu.Item>
                  </Menu>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Message attached='top' className='welcomeMessage' positive >
                  <Icon name='check circle' />
                    Welcome! Let's get your content approved. Select an item to add details and submit for review&nbsp;<a href='#'>Learn more</a>&nbsp;
                </Message>
                <div ></div>
              </Grid.Row>                 
            </Grid.Column>
            <Grid.Column width={6} className="image_options">
              <Grid.Row>
                <Form>              
                <Grid.Column className="image_option" width={3}>
                  <div class="column avatarImage">
                    <AvatarImage url="https://react.semantic-ui.com/images/wireframe/square-image.png" name="Image.jpg"/>
                    <a target="blank" href="https://react.semantic-ui.com/images/wireframe/square-image.png"><Icon name='search plus' className="center" size="large"/></a>
                  </div>
                  <div class="column">
                    <Form.Field>
                      <label>Image type<Icon name='question circle' size="large"/></label>
                      <Button type='submit'>Photo</Button>
                      <Button type='submit'>Illustration</Button>
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                      <label>Usage <Icon name='question circle' size="large"/></label>
                      <Button type='submit'>Commercial</Button>
                      <Button type='submit'>Editorial</Button>
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                      <TextArea rows={1} placeholder="Descriptions" />
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                    <div class="label">Category 1</div>
                      <Select placeholder='Category 1'  />
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                    <div class="label">Category 2(optional)</div>
                      <Select placeholder='Category 2(optional)'  />
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                    <div class="label">Location(optional)</div>
                      <input type="text" placeholder='Location(optional)'  />
                      <Icon name='question circle' className="bottom" size="large"/>
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                    <Accordion fluid styled>
                      <Accordion.Title
                        className="label"
                        active={activeIndex === 0}
                        index={0}
                        onClick={this.handleAccordionClick}
                      > More options(as needed)
                        <Icon name='angle down' />
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === 0}>
                        <Select placeholder='Notes for reviewer' className="left fullwidth"  />
                        <div class="check">
                          <Checkbox className="left fullwidth" label="Mature content"/>
                          <Icon name='question circle' className="center" size="large"/>
                        </div>
                      </Accordion.Content>
                    </Accordion>
                    </Form.Field>
                  </div>
                  <div class="column">
                    <Form.Field>
                      <div class="Releases left">
                        <h5>Releases<Icon name="plus" /></h5>
                        <p>For recognizable people or property.</p>
                        <a href="#">Download a release form</a>
                      </div>
                    </Form.Field>
                  </div>
                </Grid.Column>
                <Grid.Column className="image_option" width={3}>
                </Grid.Column>
                </Form>
              </Grid.Row>
              <Grid.Column>
                <Button className="submitButton" fluid negative>Submit</Button>
              </Grid.Column>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}

export default SubmitContent
