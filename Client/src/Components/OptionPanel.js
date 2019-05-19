/* Author: Vincent Eurasto */

import React from 'react';

const OptionPenel = (props) => {
    
    return (
        <div className="option-panel align-justify-center-row border-shadow-round">
            <div className="responsive-navbar-opener margin-10" onClick={props.openMenuBar}>
                <span>&#9776;</span>
            </div>
            <div className="align-justify-center-column margin-10">
            <span>Per capita</span>
            <label htmlFor="per_capita" className="switch">
            <input 
                checked={props.perPersonSelected}
                onChange = {props.switchChartData}
                type="checkbox" 
                id="per_capita" 
                name="per_capita"
            />
            <span className="slider round"></span>
            </label>
            </div>
            <div className="align-justify-center-column margin-10">
            <span>Dark mode</span>
            <label className="switch">
            <input 
                checked={props.darkModeEnabled}
                onChange = {props.changeMode}
                type="checkbox"
            />
            <span className="slider round"></span>
            </label>
            </div>
        </div>

    )
}

export default OptionPenel;