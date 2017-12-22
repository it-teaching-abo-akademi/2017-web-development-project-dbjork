/* Simple header row component for the StockList component
*  Author: Dan Björkgren 2017
*  TODO: List sorting that is hinted at by the arrows in the divs
* */
import React, { Component } from 'react';
import '../stocklist.css';
const ORDER_ASCENDING = true;
const ORDER_DESCENDING = false;

class HeaderRow extends Component {
    constructor(props){
        super(props);
        this.state={column:'none', order:ORDER_ASCENDING}
        this.sortRows=this.sortRows.bind(this);
    }
    render() {
        return (
            <div className="hflex">
                <div className="sl-header table-row">
                    <div className="table-cell col1" onClick={this.sortRows} id={"symbol"}>
                        <p>Name {this.state.column!=="symbol"?"\u2b0d":this.state.order===ORDER_ASCENDING?"\u2b06":"\u2b07"}</p>
                    </div>
                    <div className="table-cell col2" onClick={this.sortRows} id={"value"}>
                        <p>Unit Value {this.state.column!=="value"?"\u2b0d":this.state.order===ORDER_ASCENDING?"\u2b06":"\u2b07"}</p>
                    </div>
                    <div className="table-cell col3" onClick={this.sortRows} id={"amount"}>
                        <p>Quantity {this.state.column!=="amount"?"\u2b0d":this.state.order===ORDER_ASCENDING?"\u2b06":"\u2b07"}</p>
                    </div>
                    <div className="table-cell col4" onClick={this.sortRows} id={"totalValue"}>
                        <p>Total Value {this.state.column!=="totalValue"?"\u2b0d":this.state.order===ORDER_ASCENDING?"\u2b06":"\u2b07"}</p>
                    </div>
                    <div className="table-cell col5" onClick={this.sortRows} id={"selected"}>
                        <p>Select {this.state.column!=="selected"?"\u2b0d":this.state.order===ORDER_ASCENDING?"\u2b06":"\u2b07"}</p>
                    </div>
                </div>
            </div>
        );
    }
    sortRows(e){
        let column = e.target.id;
        if (!column){
            column=e.target.parentNode.id;
        }
        const order = column===this.state.column?!this.state.order:ORDER_ASCENDING;
        this.setState({column, order})
        this.props.onSortClick(column, order);
    }
}

export default HeaderRow;