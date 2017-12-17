import React, { Component } from 'react';
import "./portfolio.css";
import PortfolioHeader from  "./components/PortfolioHeader";
import StockList from "./components/StockList/StockList";
import Toolbar from "./components/Toolbar";
import ModalPopup from "../ModalPopup";
import {addStock, pages, showPage,fetchCurrency, deleteSelectedStock } from "../../actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import GraphPopup from "./components/GraphPopup";

class PortfolioComponent extends Component {
    componentDidMount() {

    }

    render() {
        return (
            <div className='portfolio'>
                <div className="vflex">
                    <PortfolioHeader pId={this.props.id} name={this.props.name} currency={this.props.currency} onDelete={this.props.onDelete} onCurrencyChange={this.props.handleCurrencyChange}/>
                    <StockList ref={"sl_"+this.props.name} pId={this.props.id} rate={this.props.currency==="EUR"?this.props.exchangeRateUSD:1} stockList={this.props.stockList}/>
                    <Toolbar onAddStock={this.props.handleAddStock} onPerfGraph={this.props.handlePerfGraph} onRemove={this.props.removeSelected}/>
                </div>
                <ModalPopup show={this.props.asksForTicker} onAcceptVal={this.props.addStock}
                            msg= {"Please enter ticker for the stock you would like to add"}
                            header={"New stock"} okText={'Add stock'} onCancel={this.props.closeStockModal}
                            pId={this.props.id}>
                    <div className="vflex">
                        <div className="hflex"><div className="label" style={{minWidth:"7ch"}}>Ticker:</div><input type={"text"} name={"symbol"} /></div>
                        <div className="hflex"><div className="label" style={{minWidth:"7ch"}}>Amount:</div><input type={"text"} name={"amount"} /></div>
                    </div>
                </ModalPopup>
                <GraphPopup show={this.props.showGraph} onCancel={this.props.closeStockModal} stocks={this.props.stockList}/>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    let portfolio = state.dataReducers.portfolio.portfolios.find(function (p) {
        return p.id === ownProps.id;
    });
    return {
        showGraph: state.uiReducers.visiblePage===pages.SHOW_HISTORY && state.uiReducers.requester===ownProps.id,
        asksForTicker: state.uiReducers.visiblePage===pages.SHOW_ASK_T_NAME && state.uiReducers.requester===ownProps.id,
        exchangeRateUSD: state.dataReducers.portfolio.exchangeRate,
        exchangeRateFetched: state.dataReducers.current.e_rate_last_updated || 0,
        stockList:portfolio.stocks
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleAddStock: () =>  dispatch(showPage(pages.SHOW_ASK_T_NAME,ownProps.id)),
        handlePerfGraph: () =>  dispatch(showPage(pages.SHOW_HISTORY,ownProps.id)),
        removeSelected: () => dispatch (deleteSelectedStock(ownProps.id)),
        closeStockModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        addStock: (stock) => { dispatch(addStock(stock.pId, stock.symbol, stock.amount))},
        handleCurrencyChange: (e) => { e.target.value!==ownProps.currency?dispatch(fetchCurrency(ownProps.id, e.target.value, Date.now()-ownProps.exchangeRateFetched>7200000)):null},

    }
};

const Portfolio = connect(
    mapStateToProps,
    mapDispatchToProps
)(PortfolioComponent);

Portfolio.propTypes = {
    name:PropTypes.string.isRequired,
    id:PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    onDelete:PropTypes.func.isRequired

}

export default Portfolio;