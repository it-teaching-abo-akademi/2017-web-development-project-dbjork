import React, { Component } from 'react';
import HeaderRow from './components/HeaderRow';
import StockRow from "./components/StockRow";
import './stocklist.css';
import { connect } from 'react-redux';


class StockListComponent extends Component{

    render() {
        var listItems=this.props.stockList.map((stockrow) =>
        {
            return <StockRow name={stockrow.symbol} uVal={stockrow.value} totalValue={stockrow.totalValue} quantity={stockrow.amount}  key={stockrow.symbol}/>
        });
        return (
            <div className="stocklist">
                <HeaderRow />
                <div ref="stock-rows">
                    {listItems}
                </div>
            </div>
        );
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
const mapDispatchToProps = state => {
    return {};
}

const StockList = connect(
    mapStateToProps,
    null
)(StockListComponent);
export default StockList;