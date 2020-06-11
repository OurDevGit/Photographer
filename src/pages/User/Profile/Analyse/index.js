import React, { Component } from "react";
import { Select } from "semantic-ui-react";
import { Line } from "react-chartjs-2";
import { get_data_for_user_diagram } from "../../../../util/APIUtils";
import {
  ISOFormatDate,
  formatDate,
  CalFirstDay,
  nextDay,
  nextMonth,
  DotFormatDate,
} from "../../../../util/Helpers";
import { DIAGRAM_DATA_TYPE } from "../../../../constants";
import LoadingIndicator from "../../../../common/LoadingIndicator";
class Analyse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      isLoading: true,
      activeMode: "DAY",
      data: {},
      today: new Date(),
    };
    this.handleChangeMode = this.handleChangeMode.bind(this);
    this.loadDataForUserDiagram = this.loadDataForUserDiagram.bind(this);
    this.setDiagramData = this.setDiagramData.bind(this);
  }

  componentDidMount() {
    this.setState({
      user: this.props.user,
    });
    var start = ISOFormatDate(
      CalFirstDay(this.state.activeMode, this.state.today)
    );
    var Request = {
      grouping: "DAY",
      start: start,
      end: ISOFormatDate(this.state.today),
      userId: this.props.user.id,
    };
    this.loadDataForUserDiagram(Request);
  }

  loadDataForUserDiagram(Request) {
    this.setState({
      isLoading: true,
    });
    get_data_for_user_diagram(Request)
      .then((response) => {
        this.setDiagramData(Request, response);
        this.setState({
          isLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });
      });
  }

  setDiagramData(Request, dataList) {
    var data = {
      labels: [],
      datasets: [
        {
          label: "like",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(255,0,0,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
        {
          label: "View",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(100,255,150,0.4)",
          borderColor: "rgba(100,255,150,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(100,255,150,1)",
          pointHoverBorderColor: "rgba(100,255,150,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
        {
          label: "Download",
          fill: false,
          lineTension: 0.1,
          backgroundColor: "rgba(75,192,192,0.4)",
          borderColor: "rgba(75,192,192,1)",
          borderCapStyle: "butt",
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: "miter",
          pointBorderColor: "rgba(75,192,192,1)",
          pointBackgroundColor: "#fff",
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: [],
        },
      ],
    };

    if (Request.grouping === "DAY") {
      var start = Request.start;
      for (var i = 0; i < 30; i++) {
        start = nextDay(start);
        data.labels.push(DotFormatDate("DAY", start));
        if (dataList.likedList[DotFormatDate("DAY", start)]) {
          data.datasets[0].data.push(
            dataList.likedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[0].data.push("0");
        }
        if (dataList.viewedList[DotFormatDate("DAY", start)]) {
          data.datasets[1].data.push(
            dataList.viewedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[1].data.push("0");
        }
        if (dataList.downloadedList[DotFormatDate("DAY", start)]) {
          data.datasets[2].data.push(
            dataList.downloadedList[DotFormatDate("DAY", start)]
          );
        } else {
          data.datasets[2].data.push("0");
        }
      }
    } else if (Request.grouping === "MONTH") {
      var start = Request.start;
      for (var i = 0; i < 12; i++) {
        data.labels.push(formatDate(start));
        if (dataList.likedList[DotFormatDate("MONTH", start)]) {
          data.datasets[0].data.push(
            dataList.likedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[0].data.push("0");
        }
        if (dataList.viewedList[DotFormatDate("MONTH", start)]) {
          data.datasets[1].data.push(
            dataList.viewedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[1].data.push("0");
        }
        if (dataList.downloadedList[DotFormatDate("MONTH", start)]) {
          data.datasets[2].data.push(
            dataList.downloadedList[DotFormatDate("MONTH", start)]
          );
        } else {
          data.datasets[2].data.push("0");
        }
        start = nextMonth(start);
      }
    }
    this.setState({ data: data });
  }

  handleChangeMode(e, { value }) {
    this.setState({
      activeMode: value,
    });
    var start = ISOFormatDate(CalFirstDay(value, this.state.today));
    var Request = {
      grouping: value,
      start: start,
      end: ISOFormatDate(this.state.today),
      userId: this.props.user.id,
    };
    this.loadDataForUserDiagram(Request);
  }

  componentDidUpdate(nextProps) {}

  render() {
    const ViewMode = [
      { key: "day", value: "DAY", text: "Daily" },
      // { key: 'week', value: 'WEEK', text: 'Weekly' },
      { key: "month", value: "MONTH", text: "Monthly" },
    ];
    if (this.state.isLoading) {
      return <LoadingIndicator />;
    }
    return (
      <>
        <a>ViewMode:</a>{" "}
        <Select
          placeholder="Select view mode"
          value={this.state.activeMode}
          options={ViewMode}
          onChange={this.handleChangeMode}
        />
        <div>
          {/* <Chart data={this.state.activeMode ==  "day" ? Daydata : Monthdata} axes={axes} tooltip/>
           */}
          <Line ref="chart" data={this.state.data} />
        </div>
      </>
    );
  }
}

export default Analyse;
