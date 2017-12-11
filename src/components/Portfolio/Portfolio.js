import React, { Component } from 'react';
import "./portfolio.css";
import PortfolioHeader from  "./components/PortfolioHeader";
import StockList from "./components/StockList/StockList";
import Toolbar from "./components/Toolbar";
import ModalPopup from "../ModalPopup";
import {addStock, pages, showPage,changeCurrency } from "../../actions";
import {connect} from "react-redux";

class PortfolioComponent extends Component {
/*    constructor(props){
        super(props);
        this.state={
            asksForTicker:false
        }
        this.addStock = this.addStock.bind(this);
        this.closeStockModal = this.closeStockModal.bind(this);
        this.handleAddStock = this.handleAddStock.bind(this);
        this.handlePerfGraph = this.handlePerfGraph.bind(this);
        this.removeSelected = this.removeSelected.bind(this);
    }*/
    render() {
        const closeBtnStyle = {
            position:'relative',
            float:'right',
            right:'2px',
            top:'2px'
        }
        return (
            <div className='portfolio'>
                <div className={'closeBtn'} style={closeBtnStyle}>X</div>
                <div className="vbox">
                    <PortfolioHeader pId={this.props.id} name={this.props.name} currency={this.props.currency} onCurrencyChange={this.props.handleCurrencyChange}/>
                    <StockList ref={"sl_"+this.props.name} pId={this.props.id}/>
                    <Toolbar onAddStock={this.props.handleAddStock} onPerfGraph={this.props.handlePerfGraph} onRemove={this.props.removeSelected}/>
                </div>
                <ModalPopup show={this.props.asksForTicker} onAcceptVal={this.props.addStock}
                            msg= {"Please enter ticker for the stock you would like to add"}
                            header={"New stock"} okText={'Add stock'} onCancel={this.props.closeStockModal}
                            pId={this.props.id}>
                    <div className="vflex">
                        <div className="hflex"><div className="label">Ticker:</div><input type={"text"} name={"symbol"} /></div>
                        <div className="hflex"><div className="label">Amount:</div><input type={"text"} name={"amount"} /></div>
                    </div>
                </ModalPopup>
            </div>
        )
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        asksForTicker: state.uiReducers.visiblePage===pages.SHOW_ASK_T_NAME && state.uiReducers.requester===ownProps.id
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        handleAddStock: () => { dispatch(showPage(pages.SHOW_ASK_T_NAME,ownProps.id))},
        closeStockModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        addStock: (stock) => { dispatch(addStock(stock.pId, stock.symbol, stock.amount))},
        handleCurrencyChange: (e) => { e.target.value!==ownProps.currency?dispatch(changeCurrency(ownProps.id, e.target.value)):null}
    }
};


const Portfolio = connect(
    mapStateToProps,
    mapDispatchToProps
)(PortfolioComponent);
export default Portfolio;
