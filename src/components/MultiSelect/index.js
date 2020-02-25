import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'


class MultiSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }

    }

    componentDidMount(){
        this.setState({
            options: this.props.options
        })
    }
  handleAddition = (e, { value }) => {
    this.setState((prevState) => ({
      options: [{ text: value, value }, ...prevState.options],
    }))
  }

  handleChange = (e, { value }) => this.setState({ currentValues: value })

  render() {
    const { currentValues } = this.state
    return (
      <Dropdown
        options={this.state.options}
        placeholder='Choose Languages'
        search
        selection
        fluid
        multiple
        allowAdditions
        value={currentValues}
        onAddItem={this.handleAddition}
        onChange={this.handleChange}
      />
    )
  }
}

export default MultiSelect
