import React, { Component } from 'react';
import HeaderRow from './components/HeaderRow';
import StockRow from "./components/StockRow";
import './stocklist.css';


class StockList extends Component{

    constructor(props){
        super(props);
        this.state = {
            listItems: []
        }
    }

    render() {
        var listItems=React.Children.map(this.state.listItems, (stockrow) =>
        {
            return React.cloneElement(stockrow,{
                ref: "sr_"+stockrow.props.name
        });
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

    addItem(name, quantity){
        this.state.listItems.push(<StockRow name={name} uVal={"0"} totalValue={"0"} quantity={quantity}  key={name}/>);
        this.setState(this.state);
    }
}

export default StockList;