/* Author: Vincent Eurasto */

import React, { Component } from 'react';
import './App.css';
import Chart from './Components/Chart';
import CountryNavBar from './Components/CountryNavBar';
import ErrorMessage from './Components/ErrorMessage';
import OptionPenel from './Components/OptionPanel';
import Footer from './Components/Footer';

class App extends Component {
  constructor(props) {
    super(props);
    this.closeErrorWindow = this.closeErrorWindow.bind(this);
    this.switchChartData = this.switchChartData.bind(this);
    this.state = {
      isLoaded : false,
      active : [],
      switchable_data : [],
      initialCountryData : [],
      countrySearchResult : [],
      perPersonSelected : false,
      errorMessageOpen : false,
      darkModeEnabled : false,
      errorMessagetext : "",
      shouldRedraw : false,
      windowWidth : window.innerWidth,
      mobileMenuBarOpen : false,
      chartData : {
        labels: [],
        datasets : []
      },
    }
  }

  handleResize = (e) => {
    this.setState({
      windowWidth: window.innerWidth
    });
  }

  componentDidMount() {
  //get country names and ids for the navigation bar
  window.addEventListener('resize', this.handleResize);
  fetch("/api/countries/names")
  .then(res => res.json())
  .then(
    (result) => {
      this.setState({
        isLoaded: true,
        initialCountryData : result,
        countrySearchResult : result
      });
    },
    (error) => {
      this.setState({
        isLoaded: true,
        error
      });
    }
  )
}

//random RGBA color for different countries in the chart
randomRgba() {

  let r = Math.floor(Math.random()*256);
  let g = Math.floor(Math.random()*256); 
  let b = Math.floor(Math.random()*256);

  let border = 'rgba(' + r + ',' + g + ',' + b + ', 0.7)';
  let fill ='rgba(' + r + ',' + g + ',' + b + ', 0.4)';  

  return [border, fill];
}

//search function for countries in navigation bar
filterCountryList = (event) => {
  let updatedList = this.state.initialCountryData

  updatedList = updatedList.filter(function(item){
    return item.name.toLowerCase().search(
      event.target.value.toLowerCase()) !== -1;
  });

  this.setState({
    countrySearchResult: updatedList,
    shouldRedraw: false
  });
}

//this function adds countries
addChartData = (result, id) => {
      let randomColor = this.randomRgba()
      let labels = []
      let datasets = []
     if (this.state.chartData.datasets.length > 0) {
        labels = result.data.length > this.state.chartData.labels ? result.data.map(element => element.year).reverse() : this.state.chartData.labels
        datasets = [...this.state.chartData.datasets, {
          id: id,
          switchable_data : result.data.map(element => element.per_capita).reverse(),
          label: result.name,
          data:  this.state.perPersonSelected ? result.data.map(element => element.per_capita).reverse() : result.data.map(element => element.emission).reverse(),
          borderColor: randomColor[0],
          backgroundColor: randomColor[1],
          fill: true
        }];
      } else {
        labels = result.data.map(element => element.year).reverse()
        datasets = [
              {
                id: id,
                label: result.name,
                switchable_data : result.data.map(element => element.per_capita).reverse(),
                data:  this.state.perPersonSelected ? result.data.map(element => element.per_capita).reverse() : result.data.map(element => element.emission).reverse(),
                borderColor: randomColor[0],
                backgroundColor: randomColor[1],
                fill: true
              }
          ]
      }
      this.setState({
        chartData: {
          labels : labels,
          datasets: datasets
        },
        isLoaded : true,
        active : [...this.state.active, id],
      });
  }

//delete chart data from state
deleteChartData = (id) => {
  let datasets = this.state.chartData.datasets.filter(dataset => {
    return dataset.id !== id
  });
  let active = this.state.active.filter(element => {
    return element !== id
  });
  let labels = []
  if (active.length > 0) {
    labels = this.state.chartData.labels;
  }
  
  this.setState({
    chartData : {
      datasets : datasets,
      labels : labels
    },
    active : active,
    isLoaded : true,
    shouldRedraw : true
  });
}

//changes the chart data (adds and removes)
changeChartData = (id) => {
  if (this.state.isLoaded) {
    this.setState({
      isLoaded : false
    })
    if (this.state.active.includes(id)) {
      this.deleteChartData(id);
    } else {
      fetch("/api/countries/?id=" + id)
      .then(res => res.json())
      .then(
        (result) => {
          if (result.error) {
            this.setState({
              isLoaded: true,
              errorMessageText : result.error,
              errorMessageOpen : true
            })
          } else {
            
            this.addChartData(result, id);
          }
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
    }
  }
}

//change between dark and light theme
changeMode = () => {
  let newState = this.state.darkModeEnabled ? false : true

  document.getElementById("App").className = newState ? "App dark-mode" : "App light-mode";

  this.setState({
    darkModeEnabled : newState,
    shouldRedraw : true
  });
}

//close error window
closeErrorWindow = (e) => {
  this.setState({
    errorMessageText : "",
    errorMessageOpen : false,
    shouldRedraw : false
  })
}

//opens and closes menubar when on mobile
openCloseMenuBar = () => {
  let state = this.state.mobileMenuBarOpen ? false : true
  this.setState({
    mobileMenuBarOpen : state
  })
}

//switch between emissions and emissions per capita
switchChartData = () => {

  let placeholder = {...this.state.chartData}
  
  placeholder.datasets.forEach(element => {
    let holder2 = [...element.switchable_data];
    element.switchable_data = [...element.data];
    element.data = holder2;
  });

  this.setState({
    chartData : placeholder,
    shouldRedraw : true,
    perPersonSelected : this.state.perPersonSelected ? false : true
  })
}

render() {
    let menuBarButtonStyle = {
      display : this.state.mobileMenuBarOpen && this.state.windowWidth <= 600 ? 'block' : 'none'
    }
    return (
      <div className="App light-mode" id="App">
      {this.state.errorMessageOpen && <ErrorMessage closeErrorWindow={this.closeErrorWindow} errorMessageText={this.state.errorMessageText}/>}
        <div className="content-wrapper">
          <div className="responsive-navbar-closer" onClick={this.openCloseMenuBar} style={menuBarButtonStyle}>
            <span>&#10003; Ok</span>
          </div>
          <CountryNavBar
            mobileMenuBarOpen = {this.state.mobileMenuBarOpen}
            windowWidth = {this.state.windowWidth}
            countrySearchResult = {this.state.countrySearchResult} 
            changeChartData= {this.changeChartData}
            filterCountryList = {this.filterCountryList}
            active = {this.state.active}
          />
          <div className="chart-wrapper align-justify-center-column">
            <OptionPenel 
              perPersonSelected={this.state.perPersonSelected}
              switchChartData = {this.switchChartData}
              darkModeEnabled={this.state.darkModeEnabled}
              changeMode = {this.changeMode}
              openMenuBar = {this.openCloseMenuBar}
            />
            <Chart 
              type = "Line"
              darkModeEnabled = {this.state.darkModeEnabled}
              isLoaded = {this.state.isLoaded}
              chartData = {this.state.chartData}
              active = {this.state.active}
              shouldRedraw = {this.state.shouldRedraw}
              />
            <Chart
              type = "Pie"
              darkModeEnabled = {this.state.darkModeEnabled}
              active = {this.state.active}
              isLoaded = {this.state.isLoaded}
              chartData = {this.state.chartData}
              />
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;