import React, {Component} from 'react'
import { Button, Header, Icon, Modal } from 'semantic-ui-react'
class ConformModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // modalOpen: false
        }
    }

    render(){
        const {modalOpen, modalHeader, modalContent} =  this.props;
        return(
            <Modal open={modalOpen} basic size='small'>
                <Header icon='archive' content={modalHeader} />
                <Modal.Content>
                <p>
                    {modalContent}
                </p>
                </Modal.Content>
                <Modal.Actions>
                <Button basic color='red' onClick={this.props.modalClose} inverted>
                    <Icon name='remove' /> No
                </Button>
                <Button color='green' onClick={this.props.handleOK} inverted>
                    <Icon name='checkmark' /> Yes
                </Button>
                </Modal.Actions>
            </Modal>
        )
    }

  

}
export default ConformModal