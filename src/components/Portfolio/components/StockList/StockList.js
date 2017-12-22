/* StockList component.
 * Includes calculation of total value for the portfolio
 * Author Dan Björkgren 2017
 * TODO: Props type checking. List sorting that is hinted in the header.
 * */
import React, { Component } from 'react';
import HeaderRow from './components/HeaderRow';
import StockRow from "./components/StockRow";
import { connect } from 'react-redux';
import { selectStock, isNumeric} from "../../../../actions/data_actions";


class StockListComponent extends Component{
    constructor(props){
        super(props);
        this.state={column:'none',order:0};
        this.handleSort = this.handleSort.bind(this);
    }
    render() {
        const totalRowStyle={
            marginRight:"1em",
            marginLeft:"auto"
        }
       const portfolioTotal = (this.props.rate*this.props.stockList.reduce((total, stock) => total+stock.totalValue,0))
           .toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2});
        /* Create a row item for each stock */
        let sortedList = this.props.stockList;
        if (this.state.column!=='none'){
            sortedList = this.props.stockList.sort((a,b)=>{
                const num = isNumeric(a[this.state.column]);
                const aVal = num?parseFloat(a[this.state.column]):a[this.state.column]===undefined?false:a[this.state.column];
                const bVal = num?parseFloat(b[this.state.column]):b[this.state.column]===undefined?false:b[this.state.column];
                if (this.state.order===true) {
                    return aVal> bVal? 1 : aVal < bVal ? -1 : 0;
                } else {
                    return aVal> bVal? -1 : aVal < bVal ? 1 : 0;
                }
            })
        }
        var listItems=sortedList.map((stockrow) =>
        {
            return <StockRow stock={stockrow} key={stockrow.symbol} rate={this.props.rate} onSelectStock={this.props.selectStock}/>
        });
        return (
            <div className="stocklist">
                <HeaderRow onSortClick={this.handleSort} />
                <div ref="stock-rows">
                    {listItems}
                </div>
                {parseFloat(portfolioTotal) === parseFloat(0.00) ? null :
                    <div className="hflex total-row">
                        <div style={totalRowStyle}>Total portfolio value:</div>
                        <div style={totalRowStyle}>{portfolioTotal}</div>
                    </div>
                }
            </div>
        );
    }
    handleSort(column, order){
        this.setState({column, order});
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        selectStock: (stockId, selected) => dispatch(selectStock(ownProps.pId, stockId, selected))
    }
}

const StockList = connect(
    null,
    mapDispatchToProps
)(StockListComponent);
export default StockList;