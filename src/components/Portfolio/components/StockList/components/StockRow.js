/* This is a subcomponent of StockList. It represents
 * a single stock. Allows the user to select that stock
 * by means of a checkbox.
 * Author Dan Björkgren 2017
 * TODO: Props type checking
 */
import React, { Component } from 'react';
import { connect } from  'react-redux';

class StockRowComponent extends Component {
    render() {
        /* Format the stock values */
        let lVal = (parseFloat(this.props.stock.value)*this.props.rate).toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            { minimumFractionDigits: 2, maximumFractionDigits:2 , style:"currency",currency:this.props.currency}
        );
        let totalVal = (this.props.stock.totalValue*this.props.rate).toLocaleString(
            undefined, // use a string like 'en-US' to override browser locale
            { minimumFractionDigits: 2, maximumFractionDigits:2, style:"currency",currency:this.props.currency}
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
                    <input type="checkbox" checked={this.props.stock.selected} onClick={this.props.handleSelection}/>
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