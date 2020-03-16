import React, { Component } from 'react';
import { Form, Input, Select, TextArea, Button, Icon} from 'semantic-ui-react'
import LoadingIndicator  from '../../../../common/LoadingIndicator';
class PersonalInfo extends Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null,
        isLoading: true,
      }
      this.handleInputChange =  this.handleInputChange.bind(this)    
      this.handleSave =  this.handleSave.bind(this)
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
    }

    componentDidUpdate(nextProps) {
        console.log("update")
    }

    handleInputChange(e, {name, value}){
      console.log(name, this.state.user)
      this.state.user[name] =  value;
      this.setState({
        user: this.state.user
      })
    }

    handleSave()
    {
      this.props.update_userData(this.state.user)
    }

    render() {
      if(this.props.isUpdateLoading)
      {
        return(
          <LoadingIndicator />
        )
        
      }
        return (
          <>
            {
              this.state.user ? 
                <Form>
                  <Form.Group widths='equal'>
                    <Form.Field
                      id='form-input-control-first-name'
                      control={Input}
                      label='First name'
                      placeholder='First name'
                      name="name"
                      value= {this.state.user ? this.state.user.name : ''}
                      onChange = {this.handleInputChange}
                    />
                    <Form.Field
                      id='form-input-control-last-name'
                      control={Input}
                      label='Last name'
                      name='surname'
                      placeholder='Last name'
                      value= {this.state.user ?  this.state.user.surname : ''}
                      onChange = {this.handleInputChange}
                    />
                    <Form.Field
                      control={Select}
                      // options={genderOptions}
                      label={{ children: 'Gender', htmlFor: 'form-select-control-gender' }}
                      placeholder='Gender'
                      search
                      searchInput={{ id: 'form-select-control-gender' }}
                    />
                  </Form.Group>
                    <Form.Field
                      id='form-input-control-error-email'
                        control={Input}
                        label='Email'
                        placeholder='joe@schmoe.com'
                        name='email'
                        // error={{
                        //   content: 'Please enter a valid email address',
                        //   pointing: 'below',
                        // }}
                        value= {this.state.user ? this.state.user.email : null}
                        onChange = {this.handleInputChange}
                    />
                    <Form.Field
                      id='form-textarea-control-opinion'
                      control={TextArea}
                      label='About me'
                      placeholder='About me'
                      name='description'
                      value={this.state.user.description}
                      onChange = {this.handleInputChange}
                    />
                  <Form.Group widths="equal">
                    <Form.Field
                      id='form-input-control-fb'
                      control={Input}
                      label={<span className="social fblabel"><Icon name="facebook official" />Facebook</span>}
                      placeholder='Facebook link'
                      name='facebook'
                      value={this.state.user.facebook}
                      onChange = {this.handleInputChange}
                    />
                    <Form.Field
                      id='form-input-control-IG'
                      control={Input}
                      label={<span className="social instalabel"><Icon name="instagram official" />Facebook</span>}
                      placeholder='Instagram Link'
                      name='instagram'
                      value={this.state.user.instagram}
                      onChange = {this.handleInputChange}
                    />
                  </Form.Group>
                    <Form.Field
                      id='form-button-control-public'
                      control={Button}
                      content='Save'
                      onClick={this.handleSave}
                    />
                </Form> 
              : null
            }
                 
          </>      
        );
    }
}

export default PersonalInfo;