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
        const dummyStyle = {
            height:"1em",
            display:this.props.loading?"none":"flex",
            marginRight:"0.5em",
            marginLeft:"auto",
        }
        const closeBtnStyle = {
            width:"22px",
            height:"22px",
            position:'relative',
            float:'right',
            border:"1px solid black",
            borderRadius:"12px"
        };
        return (
            <div>
                <div className="hflex fullwidth title-pane">
                    <div className="portfolio-name">{this.props.name}</div>
                    <div className={'close-btn'} style={closeBtnStyle} onClick={this.props.handleDelete}>X</div>
                </div>
                <div className="hflex fullwidth p-header" >
                    <div><fieldset style={fsStyle} >
                        Show in €<input type="radio" name={"currency"+this.props.pId} value={"EUR"} checked={this.props.currency==="EUR"} onClick={this.props.onCurrencyChange} style={rbStyle}/>
                        Show in $<input type="radio" name={"currency"+this.props.pId} value={"USD"} checked={this.props.currency==="USD"} onClick={this.props.onCurrencyChange} />
                    </fieldset></div>
                    <img src={loading} style={iconStyle} className="vcenter load-icon"  alt="Updating..." />
                    <div style={dummyStyle} className="vcenter load-icon"  />
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (state, ownProps ) => {
    return {
        handleDelete: () => ownProps.onDelete(ownProps.pId)
    }
};
const mapStateToProps = (state, ownProps) => {
    if (!(state.dataReducers.current)) return { loading:false };
    return {
        loading: state.dataReducers.current.isFetching>0
    }
};
const PortfolioHeader= connect(
    mapStateToProps,
    mapDispatchToProps
)(PortfolioHeaderComponent);
export default PortfolioHeader;