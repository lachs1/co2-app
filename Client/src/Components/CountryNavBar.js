/* Author: Vincent Eurasto */

import React from 'react';

const CountryNavBar = (props) => {
    let menuBarStyle = {
        display : props.mobileMenuBarOpen || props.windowWidth >= 600 ? 'block' : 'none',
      }
    const countries = props.countrySearchResult.map((country) => {
        return (
            <div
                className={props.active.includes(country.iso2Code) ? 'country-navbar-li active' : 'country-navbar-li'}
                onClick={() => {props.changeChartData(country.iso2Code)}} 
                key={country.iso2Code}>{country.name}
            </div>
        )
    });

    return (
        <div className="navbar-wrapper border-shadow-round" style={menuBarStyle}>
            <div className="input-and-button-holder">
                <span className="fa fa-search"></span>
                <input type="text" className="country-search-input" placeholder="Search for countries..." onChange={props.filterCountryList}/>
            </div>
            <div className="country-navbar">
                {countries}
            </div>
        </div>

    )
}

export default CountryNavBar;