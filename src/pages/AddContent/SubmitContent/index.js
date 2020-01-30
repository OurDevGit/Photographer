import React, { Component, a } from 'react'
import { Grid, GridColumn, Image, Divider, Menu, Dropdown, Icon, Message, Form, Button, TextArea, Select , Accordion, Checkbox, Popup} from 'semantic-ui-react'
import { NavLink, Redirect } from 'react-router-dom'
import MetaTags from 'react-meta-tags'
import { getCurrentUser, getAllCategories, getAllTags, getNumberOfPhotos ,updateMultiplePhoto} from '../../../util/APIUtils';
import { ACCESS_TOKEN } from '../../../constants';
import { HomeHeader, PhotoList, AvatarImage, MultiSelect } from '../../../components'
import Footer from '../Footer'
import './style.less'
import {notification} from 'antd'
import LoadingIndicator  from '../../../common/LoadingIndicator';
const style = {
  noPaddingStyle: {
    padding: 0,
  },
}
const arr_options = {};
const isChecked = false;

class SubmitContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthenticated: false,
      isLoading: true,
      categories: [],
      tags: [],
      activeIndex: 1,
      showOptions: ["unvisible", "visible"],
      selImage: [],
      pageStatus: '',
      photoOptions:{"idd":1},
      submit_status: 'TO_BE_SUBMITTED',
      activeMenuItem: "TO_BE_SUBMITTED",
      total: {},
      currentTagValues: [],
      loginStatus: true
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.loadCurrentUser = this.loadCurrentUser.bind(this);
    this.loadAllCategories = this.loadAllCategories.bind(this);
    this.loadAllTags = this.loadAllTags.bind(this);
    this.getTotalNumberOfPhotos = this.getTotalNumberOfPhotos.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleImageClick =  this.handleImageClick.bind(this)
    this.handleSetPhotoOption = this.handleSetPhotoOption.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
      let categorylist = response.categories.map((category)=>{
        return{
          key: category.id,
          value: category.value,
          text: category.value
        }
      });
      this.setState({
        categories: categorylist,
      });
      console.log("categories",this.state.categories);
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  loadAllTags() {
    getAllTags()
    .then(response => {
      let taglist = response.tags.map((tag)=>{
        return{
          key: tag.id,
          value: tag.value,
          text: tag.value
        }
      });
      this.setState({
        tags: taglist,
      });
      console.log("tags",this.state.tags);
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  getTotalNumberOfPhotos() {
    getNumberOfPhotos()
    .then(response => {
      this.setState({
        total: response,
      });
    }).catch(error => {
      this.setState({
        isLoading: false
      });  
    });
  }

  componentDidMount() {
    this.loadCurrentUser();
    this.loadAllCategories();
    this.loadAllTags();
    this.getTotalNumberOfPhotos();
  }

  handleLogout(redirectTo="/", notificationType="success", description="You're successfully logged out.") {
    localStorage.removeItem(ACCESS_TOKEN);

    this.setState({
      currentUser: null,
      isAuthenticated: false,
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

  handleMultiSelectAddition = (e, { value }) => {
    this.setState((prevState) => ({
      tags: [{ text: value, value }, ...prevState.tags],
    }))
  }

  handleMultiSelectChange = (e, { value }) => this.setState({ currentTagValues: value })

  handleImageClick(e){
    console.log(e)
    this.setState({
      showOptions: ["visible", "unvisible"],
    })
    this.setState({
      selImage: e.photo
    })
  }

  handleMenuItemClick = (e, { name }) => {
    this.setState({ activeMenuItem: name }); 
  }

  handleSetPhotoOption = (e, { name, value }) => {
    this.arr_options = this.state.photoOptions;
    this.arr_options[name] = value; 
    this.setState({ 
      photoOptions : this.arr_options,
    })
  }

  handleCheck = (e, {name, value}) => {
    this.isChecked =  !this.isChecked;
    this.state.photoOptions[name] = this.isChecked; 
    this.arr_options = this.state.photoOptions;
    this.setState({ 
      photoOptions : this.arr_options,
    })
  }

  handleSubmit(){
    const updateRequest = {"photos": []};
    const temp_options = this.state.selImage;
    temp_options.submitStatus = "Submitted";
    temp_options.description = this.state.photoOptions['Description'];
    temp_options.categories = [];
    temp_options.categories.push(this.state.photoOptions['Category1']);
    temp_options.categories.push(this.state.photoOptions['Category2']);
    temp_options.tags = this.state.currentTagValues;
    this.setState({selImage: temp_options})
    updateRequest.photos.push(temp_options);
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",updateRequest)

    updateMultiplePhoto(updateRequest)
      .then(response => {
        console.log("....................................................",response);
      }).catch(error => {
        this.setState({
          isLoading: false
        });  
      });

  }

  render() {
    const { activeIndex, activeItem } = this.state
    console.log("aaaa",this.state.activeMenuItem)
    if(this.state.isLoading){
      return(
          <LoadingIndicator /> 
      )
    }else{
      if(!this.state.currentUser)
      {
        return(
          <Redirect to='/' />
        )
      }
    }
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
                      <Menu.Item name='TO_BE_SUBMITTED' active={this.state.activeMenuItem === 'TO_BE_SUBMITTED'} onClick={this.handleMenuItemClick}>
                        To submit({this.state.total.toBeSubmitted})
                      </Menu.Item>
                      <Menu.Item name='SUBMITTED' active={this.state.activeMenuItem === 'SUBMITTED'} onClick={this.handleMenuItemClick}>
                        Pending({this.state.total.submitted})
                      </Menu.Item>
                      <Menu.Item className='' name='ACCEPTED' active={this.state.activeMenuItem === 'ACCEPTED'} onClick={this.handleMenuItemClick}>
                        Accepted({this.state.total.accepted})
                      </Menu.Item>
                      <Menu.Item className='ReviewedMenu' name='REJECTED' active={this.state.activeMenuItem === 'REJECTED'} onClick={this.handleMenuItemClick}>
                        Rejected({this.state.total.rejected})
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
              <Grid.Row>
                <PhotoList 
                    onClickImage={this.handleImageClick} 
                    active={this.state.selImage.id} 
                    username ={this.state.currentUser.username} 
                    type="Submit_operation" 
                    status={this.state.activeMenuItem} 
                    subfun = {() => this.subfun()}
                    />
              </Grid.Row>                   
            </Grid.Column>
            <Grid.Column width={6} className="image_options">
              <div className={this.state.showOptions[0]}>
                <Grid.Row>
                  <Form>              
                  <Grid.Column className="image_option" width={3}>
                    <div class="column avatarImage">
                      <AvatarImage url={this.state.selImage.url_fr} name="Image.jpg"/>
                      <a target="blank" href={this.state.selImage.url_fr}><Icon name='search plus' className="center" size="large"/></a>
                    </div>
                    <div class="column">
                      <Form.Field>
                        <label>Image type
                          <Popup
                            trigger={<Icon name='question circle' size="large"/>}
                            content='Illustrations include scanned artwork, digitally produced illustrations, 3d renderings, and composites'
                            position='bottom center'
                          />
                        </label>
                        <Button id={this.state.photoOptions['ImageType'] == 'Photo' ? 'activate' : ''} type='button' name='ImageType' value="Photo" onClick={this.handleSetPhotoOption} >Photo</Button>
                        <Button id={this.state.photoOptions['ImageType'] == 'Illustration' ? 'activate' : ''} type='button' name='ImageType' value='Illustration' onClick={this.handleSetPhotoOption}>Illustration</Button>
                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                        <label>Usage 
                          <Popup
                            trigger={<Icon name='question circle' size="large"/>}
                            content='Editorial content is newsworthy or of public interest'
                            position='bottom center'
                          />
                        </label>
                        <Button id={this.state.photoOptions['Usage'] == 'Commercial' ? 'activate' : ''} type='button' name='Usage' value="Commercial" onClick={this.handleSetPhotoOption} >Commercial</Button>
                        <Button id={this.state.photoOptions['Usage'] == 'Editorial' ? 'activate' : ''} type='button' name='Usage' value='Editorial' onClick={this.handleSetPhotoOption}>Editorial</Button>

                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                        <TextArea rows={1} placeholder="Descriptions" name='Description' value={this.state.photoOptions['Description']} onChange={this.handleSetPhotoOption} />
                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                      <div class="label">Category 1</div>
                        <Select placeholder='Category 1' options={this.state.categories} name="Category1" value={this.state.photoOptions['Category1']} onChange={this.handleSetPhotoOption}/>
                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                      <div class="label">Category 2(optional)</div>
                        <Select placeholder='Category 2(optional)' options={this.state.categories} name="Category2" value={this.state.photoOptions['Category2']} onChange={this.handleSetPhotoOption}/>
                      </Form.Field>
                    </div>
                    <div class="column">
                      <Form.Field>
                      <div class="label">Location(optional)</div>
                        <input type="text" placeholder='Location(optional)' name="Location" value={this.state.photoOptions['Location']} onChange={this.handleSetPhotoOption}  />
                        <Popup
                          trigger={<Icon name='question circle' className="bottom" size="large"/>}
                          content={<span>Select the geographic location shown in your photo. Be specific: select neighborhoods, towns, or cities. In the future, location data will power new search and filtering options for customers. <a href="#">Learn more</a></span>}
                          position='bottom center'
                          on='click'
                        />
                        
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
                          <Select placeholder='Notes for reviewer' className="left fullwidth" name="NotesForReviewer" value={this.state.photoOptions['NotesForReviewer']} onChange={this.handleSetPhotoOption} />
                          <div class="check">
                            <Checkbox className="left fullwidth" label="Mature content" name="MatureContent" value={this.state.photoOptions['MatureContent']} onChange={this.handleCheck}/>
                            <Popup
                              trigger={<Icon name='question circle' className="center" size="large"/>}
                              content='Mature content contains nudity. sexual or suggestive content, or offensive language.'
                              position='bottom center'
                            />
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
                  <Form.Field>
                      <div class="label">Keywords</div>
                      
                  </Form.Field>
                  <Dropdown
                    options={this.state.tags}
                    placeholder='Choose Keywords'
                    search
                    selection
                    fluid
                    multiple
                    allowAdditions
                    value={this.state.currentTagValues}
                    onAddItem={this.handleMultiSelectAddition}
                    onChange={this.handleMultiSelectChange}
                  />
                  </Grid.Column>
                  </Form>
                </Grid.Row>
                <Grid.Column>
                <Button className="submitButton" onClick={this.handleSubmit} fluid negative>Submit</Button>
              </Grid.Column>
              </div>
              <div className={this.state.showOptions[1]}>
                <Grid.Row className="imageOption_Blank">
                  <h3>Select an item to add details</h3>
                  <p>Tip: Select multiple items by holding "Shift" or</p>
                  <p> "Command/Control".</p>
                </Grid.Row>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    )
  }
}

export default SubmitContent
