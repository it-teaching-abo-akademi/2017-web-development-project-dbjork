import React, { Component } from 'react';
import loading from "../../../resources/loading.svg";
import {connect} from "react-redux";

class PortfolioHeaderComponent extends Component {

    render() {
        const fsStyle = {
            border:"none",
            marginLeft:"3em"
        }
        const rbStyle = {
            padding:"5px",
            marginRight:"1em"
        }
        const iconStyle = {
            height:"1em",
            display:this.props.loading?"flex":"none",
            marginRight:"0.5em",
            marginLeft:"auto",
        }
        return (
            <div>
            <div className="hflex fullwidth" >
                <div>{"id:"}{this.props.pId}</div>
                <div>{this.props.name}</div>
                <div><fieldset style={fsStyle} >
                    €<input type="radio" name={"currency"} value={"EUR"} checked={this.props.currency==="EUR"} onClick={this.props.onCurrencyChange} style={rbStyle}/>
                    $<input type="radio" name={"currency"} value={"USD"} checked={this.props.currency==="USD"} onClick={this.props.onCurrencyChange} />
                </fieldset></div>
                <img src={loading} style={iconStyle} className="vcenter"  alt="logo" />
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    if (!(state.dataReducers.current)) return { loading:false };
    return {
        loading: state.dataReducers.current.isFetching && state.dataReducers.current.pId===ownProps.pId
    }
};
const PortfolioHeader= connect(
    mapStateToProps,
    null
)(PortfolioHeaderComponent);
export default PortfolioHeader;