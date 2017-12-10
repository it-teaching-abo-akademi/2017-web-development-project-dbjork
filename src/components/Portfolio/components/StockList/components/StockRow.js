import React, { Component } from 'react';

class StockRow extends Component {
    render() {
        return (
                <div className="stockrow table-row">
                    <div className="table-cell col1">
                        <p>{this.props.name}</p>
                    </div>
                    <div className="table-cell col2">
                        <p>{this.props.uVal}</p>
                    </div>
                    <div className="table-cell col3">
                        <p>{this.props.quantity}</p>
                    </div>
                    <div className="table-cell col4">
                        <p>{this.props.totalValue}</p>
                    </div>
                    <div className="table-cell col5">
                        <input type="checkbox" checked={this.props.checked}></input>
                    </div>
                </div>
        );
    }
}

export default StockRow;