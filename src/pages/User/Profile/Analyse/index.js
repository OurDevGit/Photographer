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
          label: 'Series 1',
          data: [["down", 10], [1, 2], [2, 4], [3, 2], [4, 7]]
        },
        {
          label: 'Series 2',
          data: [["down", 3], [1, 1], [2, 5], [3, 6], [4, 4]]
        },
        {
          label: 'Series 3',
          data: [['down', 3], [1, 5], [2, 5], [3, 6], [4, 4]]
        }
      ]
        const axes = [
          { primary: true, type: 'ordinal', position: 'bottom' },
          { type: 'linear', position: 'left', stacked: false}
        ]

        const series = {
          type: 'bar'
        }

      console.log(data)
        return (
            <>
            <Chart data={data} axes={axes} series={series} />

            </>
        );
    }
}

export default Analyse;