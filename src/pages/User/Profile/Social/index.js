import React, { Component } from 'react';
import { Form, Input, Icon, TextArea, Button} from 'semantic-ui-react'

class Social extends Component {
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
                <Form.Field
                  id='form-input-control-fb'
                  control={Input}
                  inline = {true}
                  label={<span className="social fblabel"><Icon name="facebook official" />Facebook</span>}
                  placeholder='Facebook link'
                  width="80%"
                  
                />
                <Form.Field
                  id='form-input-control-IG'
                  control={Input}
                  label={<span className="social instalabel"><Icon name="instagram official" />Facebook</span>}
                  placeholder='Instagram Link'
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

export default Social;