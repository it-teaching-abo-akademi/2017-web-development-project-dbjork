import React, { Component } from 'react';
import loading from "../../../resources/loading.svg";
import settings from "../../../resources/settings.svg";
import {connect} from "react-redux";

class PortfolioHeaderComponent extends Component {

    render() {
        const fsStyle = {
            border:"none",
            marginLeft:"1em"
        }
        const rbStyle = {
            padding:"5px",
            marginRight:"1em"
        }
        const iconStyle = {
            height:"1em",
            marginLeft:"0.5em",
            marginRight:"auto"
        }
        const lIconStyle = {
            ...iconStyle,
            marginRight:"0.5em",
            marginLeft:"auto",
            display:this.props.loading?"flex":"none",
        }
        const dummyStyle = {
            ...iconStyle,
            display:this.props.loading?"none":"flex",

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
                    <img src={settings} className="vcenter" style={iconStyle} alt={"Settings"} onClick={this.props.showSettings}/>
                    <div>
                        <fieldset style={fsStyle} >
                            Show in €<input type="radio" name={"currency"+this.props.pId} value={"EUR"} checked={this.props.currency==="EUR"} onClick={this.props.onCurrencyChange} style={rbStyle}/>
                            Show in $<input type="radio" name={"currency"+this.props.pId} value={"USD"} checked={this.props.currency==="USD"} onClick={this.props.onCurrencyChange} />
                        </fieldset>
                    </div>
                    <img src={loading} style={lIconStyle} className="vcenter load-icon"  alt="Updating..." />
                    <div style={dummyStyle} className="vcenter load-icon"  />
                </div>
            </div>
        )
    }

}
const mapDispatchToProps = (state, ownProps ) => {
    return {
        handleDelete: () => ownProps.onDelete(ownProps.pId),
        showSettings: () => ownProps.onShowSettings(ownProps.pId)
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