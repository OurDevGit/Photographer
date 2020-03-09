import React, { Component } from 'react';
import { Form, Input, Select, Icon, Button} from 'semantic-ui-react'
import { Chart } from 'react-charts'

class Analyse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: true,
            activeMode:"day"
        }
        this.handleChangeMode = this.handleChangeMode.bind(this)
    }

    componentDidMount() {
      this.setState({
        user: this.props.user
      })
      // this.MyChart();
    }

    handleChangeMode(e, {value}){
      this.setState({
        activeMode: value
      })
      console.log(value)
    }

    componentDidUpdate(nextProps) {
 
    }

    render() {
      const Daydata = [
        {
          label: 'downloads',
          data: [[1, 2], [2, 4], [3, 2], [4, 7],[5, 10], [6, 2], [7, 4], [8, 2], [9, 7],[10, 15], [11, 12], [12, 7],[13, 2], [14, 7],[15, 10], [16, 2], [17, 4], [18, 2], [19, 7],[20, 15], [21, 12], [22, 7],[23, 2], [24, 7],[25, 10], [26, 2], [27, 4], [28, 2], [29, 7],[30, 15]]
        },
        {
          label: 'views',
          data: [[1, 6], [2, 14], [3, 5], [4, 21],[5, 19], [6, 5], [7, 8], [8, 12], [9, 9],[10, 16], [11, 19], [12, 16], [13, 12], [14, 17],[15, 14], [16, 5], [17, 14], [18, 22], [19, 27],[20, 25], [21, 22], [22, 17],[23, 12], [24, 17],[25, 20], [26, 9], [27, 24], [28, 22], [29, 27],[30, 45]]
        },
        {
          data:[[1,0]]        }
      ]

      const Monthdata = [
        {
          label: 'downloads',
          data: [['Jan 2020', 2], ['Feb 2020', 4], ['Mar 2020', 2], ['Apr 2020', 7],['May 2020', 10], ['Jun 2020', 2], ['Jul 2020', 4], ['Aug 2020', 2], ['Sep 2020', 7],['Oct 2020', 15], ['Nov 2020', 12], ['Dec 2020', 7]]
        },
        {
          label: 'views',
          data: [['Jan 2020', 5], ['Feb 2020', 22], ['Mar 2020', 15], ['Apr 2020', 12],['May 2020', 15], ['Jun 2020', 6], ['Jul 2020', 8], ['Aug 2020', 10], ['Sep 2020', 12],['Oct 2020', 20], ['Nov 2020', 15], ['Dec 2020', 17]]
        },
        {
          label:'',
          data:[["Jan 2020",0]]        }
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
        return (
            <>
            {/* <Select placeholder='Select view mode' options={ViewMode} /> */}
            <a>ViewMode:</a> <Select placeholder='Select view mode' value={this.state.activeMode} options={ViewMode} onChange={this.handleChangeMode} />
            <div>
            <Chart data={this.state.activeMode ==  "day" ? Daydata : Monthdata} axes={axes} tooltip/>
            </div>
            </>
        );
    }
}

export default Analyse;