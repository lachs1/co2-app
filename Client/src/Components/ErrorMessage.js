/* Author: Vincent Eurasto */

import React from 'react';

const ErrorMessage = (props) => {
    return (
        <div className="error-message align-justify-center-row" onClick={props.closeErrorWindow}>
            <span>{props.errorMessageText} (Click this to close)</span>
        </div>

    )
}

export default ErrorMessage;