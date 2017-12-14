import React, { Component } from 'react';
import { connect } from  'react-redux';

class StockRowComponent extends Component {
    render() {

        let lVal = (parseFloat(this.props.stock.value)*this.props.rate).toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            { minimumFractionDigits: 2, maximumFractionDigits:2 }
        );
        let totalVal = (this.props.stock.totalValue*this.props.rate).toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            { minimumFractionDigits: 2, maximumFractionDigits:2 }
        );
        return (
            <div className="stockrow table-row">
                <div className="table-cell col1">
                    <p>{this.props.stock.symbol}</p>
                </div>
                <div className="table-cell col2">
                    <p>{lVal}</p>
                </div>
                <div className="table-cell col3">
                    <p>{this.props.stock.amount}</p>
                </div>
                <div className="table-cell col4">
                    <p>{totalVal}</p>
                </div>
                <div className="table-cell col5">
                    <input type="checkbox" checked={this.props.stock.selected} onClick={this.props.handleSelection}></input>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleSelection: () => ownProps.onSelectStock(ownProps.stock.id, !ownProps.stock.selected)
    }
}
const StockRow = connect(
    null,
    mapDispatchToProps
)(StockRowComponent);

export default StockRow;