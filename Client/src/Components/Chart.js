/* Author: Vincent Eurasto */

import React, {Component} from 'react';
import {Line, Pie} from 'react-chartjs-2';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded : false,
            years : [],
            yearSelected : null,
            minYear : null,
            maxYear : null,
            darkModeEnabled : true
        }
    }

    componentWillReceiveProps(props) {
        let data = [];
        if (props.type === "Pie") {
            
            let datasets = props.chartData.datasets.map(element => {
                return element.data[0]
            });
            
            let labels = props.chartData.datasets.map(element => {
                return element.label
            });

            let borderColors = props.chartData.datasets.map(element => {
                return element.borderColor
            });

            let backgroundColors = props.chartData.datasets.map(element => {
                return element.borderColor
            });

            data = {
                datasets: [{
                  data: datasets,
                  backgroundColor: borderColors,
                  borderColor: backgroundColors
                  
              }],
              labels: labels,
              }
        } else {
            data = props.chartData
        }
        this.setState({
            allCountryData : props.chartData,
            chartData : data,
            years : props.chartData.labels,
            yearSelected : parseInt(props.chartData.labels[0]),
            minYear : parseInt(props.chartData.labels[0]), 
            maxYear : parseInt(props.chartData.labels[props.chartData.labels.length - 1]),
            isLoaded : props.isLoaded,
            type : props.type,
            active : props.active,
            darkModeEnabled : props.darkModeEnabled,
            shouldRedraw : props.shouldRedraw
        });
    }

    //change the year. Only used for the Pie chart
    changeYear = (value) => {
        let yearSelected  = value;
        let index = this.state.years.indexOf(yearSelected.toString())
        let datasets = this.state.allCountryData.datasets.map(element => {
            return element.data[index]
        });
        
        let labels = this.state.allCountryData.datasets.map(element => {
            return element.label
        });

        this.setState({
            yearSelected : yearSelected,
            chartData : {
                datasets: [{
                  data: datasets,
                  backgroundColor : this.state.chartData.datasets[0].backgroundColor,
                  borderColor: this.state.chartData.datasets[0].borderColor
                  
              }],
              labels: labels,
            }
        });
    }

    render() {
        //chart options for Line chart
        let chartOptions = {
            legend : {
                position: 'bottom',
                labels: {
                    fontColor: this.state.darkModeEnabled ? 'white' : '#666'
                   }
            },
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Years',
                        fontColor: this.state.darkModeEnabled ? 'white' : '#666'
                    },
                    ticks: {

                        fontColor: this.state.darkModeEnabled ? 'white' : '#666'
                    },
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'CO2 emissions (kilotons)',
                        fontColor: this.state.darkModeEnabled ? 'white' : '#666'
                    },
                    ticks: {
                        fontColor: this.state.darkModeEnabled ? 'white' : '#666'
                    },
                    gridLines: {
                        display:false
                    }   
                }]
            }
        };
        let type = this.state.type
        let chart;
        if (type === "Line" && this.state.active.length > 0 && this.state.isLoaded) {
            chart = <div className="align-justify-center-column">
                        <h3>Emissions in a line chart (kilotons)</h3>
                        <Line data = {this.state.chartData} options ={chartOptions} redraw={this.state.shouldRedraw}/> 
                    </div>
        } else if (type === "Pie" && this.state.active.length > 0 && this.state.isLoaded) {
            let countryDataTable = this.state.chartData.labels.map((element, index) => {
                let value = this.state.chartData.datasets[0].data[index];
                let color = this.state.chartData.datasets[0].backgroundColor[index];
                let style = {
                    "backgroundColor": color
                }
                return (
                    <tr style={style} key={index}><td>{element}</td><td>{value === null ? '-' : value}</td></tr>
                )
            });
            chart = <div className="align-justify-center-column">
                        <h3>Emissions in a pie chart (kilotons)</h3>
                        <Pie data = {this.state.chartData} />
                        <p>Year selected: {this.state.yearSelected}</p>
                        <Slider 
                            value = {this.state.yearSelected}
                            orientation = "horizontal"
                            onChange= {this.changeYear}
                            min = {this.state.minYear}
                            max = {this.state.maxYear}
                        />
                        <table className="pie-chart-table border-shadow-round">
                            <tbody>
                                <tr><th>Country</th><th>Emission (kilotons)</th></tr>
                                {countryDataTable}
                            </tbody>
                        </table>
                        
                    </div>
        } else if (!this.state.isLoaded) {
            chart = <div className="align-justify-center-column">
                        <p>Loading... Please wait.</p>
                    </div>
        } else {
            chart = <div className="align-justify-center-column">
                        <p>No country selected. Please select countries from the panel.</p>
                    </div>
        }
        return (
            <div className="chart align-justify-center-column border-shadow-round">
                {chart}
            </div>
        )
    }

}

export default Chart;