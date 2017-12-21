/* The heart of the application, this is the portfolio component
 * Renders a list of stocks and allows the user to add more or delete
 * unwanted stocks. Pretty slick looking if I may say so myself.
 *
 * Author: Dan Björkgren 2017
 *
 * */
import React, { Component } from 'react';
import "./portfolio.css";
import PortfolioHeader from  "./components/PortfolioHeader";
import StockList from "./components/StockList/StockList";
import Toolbar from "./components/Toolbar";
import ModalPopup from "../ModalPopup";
import {addStock, pages, showPage,fetchCurrency, deleteSelectedStock, saveSettings, fetchAllCurrent } from "../../actions/data_actions";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import GraphPopup from "./GraphPopup";
import SettingsPopup from "./SettingsPopup";

class PortfolioComponent extends Component {
    constructor(props){
        super(props);
        //Ensure "this" is available
        this.handleSaveSettings = this.handleSaveSettings.bind(this);

    }
    render() {
        // Disable the "Performance Graph" button if we are still loading
        const graphCanBeShown = this.props.stockList.length>0  && this.props.stockList.every((s)=>s.value>0);
        // Disable the Delete button if nothing is selected.
        const hasSelected = this.props.stockList.some((s)=> s.selected === true);
        return (
            <div className='portfolio'>
                <div className="vflex">
                    <PortfolioHeader pId={this.props.id} name={this.props.name} currency={this.props.currency} onDelete={this.props.onDelete} onCurrencyChange={this.props.handleCurrencyChange} onShowSettings={this.props.handleSettings}/>
                    <StockList ref={"sl_"+this.props.name} pId={this.props.id} rate={this.props.currency==="EUR"?this.props.exchangeRateUSD:1} stockList={this.props.stockList}/>
                    <Toolbar onAddStock={this.props.handleAddStock} onPerfGraph={this.props.handlePerfGraph} onRemove={this.props.removeSelected} graphCanBeShown={graphCanBeShown} hasSelected={hasSelected}/>
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
                <SettingsPopup show={this.props.showSettings} settings={this.props.settings} onAcceptVal={this.handleSaveSettings} onCancel={this.props.closeStockModal}/>
                <GraphPopup show={this.props.showGraph} onCancel={this.props.closeStockModal} stocks={this.props.stockList} pId={this.props.id}/>
            </div>
        )
    }

    handleSaveSettings(settings){
        //TODO: When (If) adding more settings, consider enabling the newSettings line to prevent overwriting
        // On the other hand, likely not needed, since the settings popup should send its complete
        // data set anyway, which would simply replace the old settings.
        //const newSettings = Object.assign({}, this.props.settings, settings);
        this.props.saveSettings(settings);
        this.props.fetchAllValues(this.props.stockList);
    }
    componentDidMount(){
        // Trigger a fetch for current values for all stocks
        this.props.fetchAllValues(this.props.stockList);

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
        stockList:portfolio.stocks,
        settings:portfolio.settings,
        showSettings:state.uiReducers.visiblePage===pages.SHOW_SETTINGS && state.uiReducers.requester===ownProps.id,
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleAddStock: () =>  dispatch(showPage(pages.SHOW_ASK_T_NAME,ownProps.id)),
        handleSettings: () =>  dispatch(showPage(pages.SHOW_SETTINGS,ownProps.id)),
        handlePerfGraph: () =>  dispatch(showPage(pages.SHOW_HISTORY,ownProps.id)),
        removeSelected: () => dispatch (deleteSelectedStock(ownProps.id)),
        closeStockModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        addStock: (stock) => { dispatch(addStock(stock.pId, stock.symbol, stock.amount))},
        handleCurrencyChange: (e) => { e.target.value!==ownProps.currency?dispatch(fetchCurrency(ownProps.id, e.target.value, Date.now()-ownProps.exchangeRateFetched>7200000)):null},
        saveSettings: (settings) => {dispatch(saveSettings(settings, ownProps.id))},
        fetchAllValues: (stockList) => dispatch(fetchAllCurrent(stockList, ownProps.id)),
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
