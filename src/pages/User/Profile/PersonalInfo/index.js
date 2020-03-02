import React, { Component } from 'react';
import { Form, Input, Select, TextArea, Button} from 'semantic-ui-react'

class PersonalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
        }
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
    }

    componentDidUpdate(nextProps) {
 
    }

    render() {
        return (
            <Form>
              <Form.Group widths='equal'>
                <Form.Field
                  id='form-input-control-first-name'
                  control={Input}
                  label='First name'
                  placeholder='First name'
                  value= {this.state.user ? this.state.user.username : null}
                />
                <Form.Field
                  id='form-input-control-last-name'
                  control={Input}
                  label='Last name'
                  placeholder='Last name'
                  value= {this.state.user ?  this.state.user.surname : null}
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
                    error={{
                      content: 'Please enter a valid email address',
                      pointing: 'below',
                    }}
                    value= {this.state.user ? this.state.user.email : null}
                />
                <Form.Field
                  id='form-textarea-control-opinion'
                  control={TextArea}
                  label='About me'
                  placeholder='About me'
                />
                <Form.Field
                  id='form-button-control-public'
                  control={Button}
                  content='Save'
                />
              </Form>            
        );
    }
}

export default PersonalInfo;