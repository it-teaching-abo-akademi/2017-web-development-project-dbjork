import React, { Component } from 'react';
import './table.css';

class HeaderRow extends Component {
    render() {
        return (
            <div className="hflex">
                <div className="sl-header table-row">
                    <div className="table-cell col1">
                        <p>Name</p>
                    </div>
                    <div className="table-cell col2">
                        <p>Unit Value</p>
                    </div>
                    <div className="table-cell col3">
                        <p>Quantity</p>
                    </div>
                    <div className="table-cell col4">
                        <p>Total Value</p>
                    </div>
                    <div className="table-cell col5">
                        <p>Select</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default HeaderRow;