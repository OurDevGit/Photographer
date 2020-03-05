import React, { Component } from 'react';
import { Form, Input, Select, Icon, Button} from 'semantic-ui-react'
import { Chart } from 'react-charts'

class Analyse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            InputType:{
              old: false,
              new: false,
              confirm:false
            }
        }
        this.showPassword =  this.showPassword.bind(this)
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
      // this.MyChart();
    }

    showPassword(e, {value}){
      this.state.InputType[value] = !this.state.InputType[value]
      this.setState({
        InputType: this.state.InputType
      })
    }

    componentDidUpdate(nextProps) {
 
    }

    render() {
      const data = [
        {
          label: 'downloads',
          data: [[1, 2], [2, 4], [3, 2], [4, 7],[5, 10], [6, 2], [7, 4], [8, 2], [9, 7],[10, 15], [11, 12], [12, 7]]
        },
        {
          label: 'views',
          data: [[1, 6], [2, 14], [3, 5], [4, 21],[5, 19], [6, 5], [7, 8], [8, 12], [9, 9],[10, 16], [11, 19], [12, 16]]
        },
        {
          data:[[1,0]]        }
      ]
        const axes = [
          { primary: true, type: 'ordinal', position: 'bottom' },
          { type: 'linear', position: 'left', min:10
          }
        ]

        const series = {
          type: 'bar'
        }

        const ViewMode = [
          { key: 'day', value: 'day', text: 'Daily' },
          { key: 'week', value: 'week', text: 'Weekly' },
          { key: 'month', value: 'month', text: 'Monthly' },
        ]

      console.log(data)
        return (
            <>
            {/* <Select placeholder='Select view mode' options={ViewMode} /> */}
            <a>ViewMode:</a> <Select placeholder='Select view mode' options={ViewMode} />
            <div>
            <Chart data={data} axes={axes} tooltip/>
            </div>
            </>
        );
    }
}

export default Analyse;