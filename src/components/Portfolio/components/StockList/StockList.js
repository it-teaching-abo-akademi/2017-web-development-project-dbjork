import React, { Component } from 'react';
import HeaderRow from './components/HeaderRow';
import StockRow from "./components/StockRow";
import './stocklist.css';
import { connect } from 'react-redux';
import { fetchCurrent, selectStock} from "../../../../actions";


class StockListComponent extends Component{

    render() {
        const totalRowStyle={
            marginRight:"1em",
            marginLeft:"auto"
        }
       const portfolioTotal = (this.props.rate*this.props.stockList.reduce((total, stock) => total+stock.totalValue,0))
           .toLocaleString(undefined, {minimumFractionDigits:2,maximumFractionDigits:2});
        var listItems=this.props.stockList.map((stockrow) =>
        {
            return <StockRow stock={stockrow} key={stockrow.symbol} rate={this.props.rate} onSelectStock={this.props.selectStock}/>
        });
        return (
            <div className="stocklist">
                <HeaderRow />
                <div ref="stock-rows">
                    {listItems}
                </div>
                {parseFloat(portfolioTotal) === parseFloat(0.00) ? null :
                    <div className="hflex">
                        <div style={totalRowStyle}>Total portfolio value:</div>
                        <div style={totalRowStyle}>{portfolioTotal}</div>
                    </div>
                }
            </div>
        );
    }
    componentDidMount(){
        this.props.fetchAllValues(this.props.stockList);
    }
}
const mapStateToProps = (state, ownProps) => {
    if (state) {
        let portfolio = state.dataReducers.portfolio.portfolios.find(function (p) {
            return p.id === ownProps.pId;
        });
    return {stockList:portfolio.stocks};
    }
    return null;
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        fetchAllValues: (stockList) => {
            stockList.forEach((stock) => {
                dispatch(fetchCurrent(stock))
            });
        },
        selectStock: (stockId, selected) => dispatch(selectStock(ownProps.pId, stockId, selected))
    }
}

const StockList = connect(
    mapStateToProps,
    mapDispatchToProps
)(StockListComponent);
export default StockList;