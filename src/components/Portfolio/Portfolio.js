import React, { Component } from 'react';
import "./portfolio.css";
import PortfolioHeader from  "./components/PortfolioHeader";
import StockList from "./components/StockList/StockList";
import Toolbar from "./components/Toolbar";
import ModalPopup from "../ModalPopup";

class Portfolio extends Component {
    constructor(props){
        super(props);
        this.state={
            asksForTicket:false
        }
        this.addStock = this.addStock.bind(this);
        this.closeStockModal = this.closeStockModal.bind(this);
        this.handleAddStock = this.handleAddStock.bind(this);
        this.handlePerfGraph = this.handlePerfGraph.bind(this);
        this.removeSelected = this.removeSelected.bind(this);
    }
    render() {
        const closeBtnStyle = {
            position:'realative',
            float:'right',
            right:'2px',
            top:'2px'
        }
        return (
            <div className='portfolio'>
                <div className={'closeBtn'} style={closeBtnStyle}>X</div>
                <div className="vbox">
                    <PortfolioHeader name={this.props.name}></PortfolioHeader>
                    <StockList ref={"sl_"+this.props.name}/>
                    <Toolbar onAddStock={this.handleAddStock} onPerfGraph={this.handlePerfGraph} onRemove={this.removeSelected}/>
                </div>
                <ModalPopup show={this.state.asksForTicket} onAcceptVal={this.addStock}
                             msg= {"Please enter ticker for the stock you would like to add"}
                            header={"New stock"} okText={'Add stock'} onCancel={this.closeStockModal}>
                    <div className="vflex">
                        <div className="hflex"><div className="label">Ticker:</div><input type={"text"} name={"ticker"} /></div>
                        <div className="hflex"><div className="label">Amount:</div><input type={"text"} name={"amount"} /></div>
                    </div>
                </ModalPopup>
            </div>
        )
    }
    handleAddStock(){
        this.setState({ asksForTicket:true});

    }
    handlePerfGraph(){

    }
    removeSelected(){

    }
    closeStockModal(){
        this.setState({asksForTicket:false});

    }
    addStock(retVal){
        this.closeStockModal();
        var stockList=this.refs["sl_"+this.props.name];
       stockList.addItem(retVal.ticker, retVal.amount);

    }
}

export default Portfolio;
