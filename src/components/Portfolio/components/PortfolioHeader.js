import React, { Component } from 'react';


class PortfolioHeader extends Component {

    render() {
        const fsStyle = {
            border:"none",
            marginLeft:"3em"
        }
        const rbStyle = {
            padding:"5px",
            marginRight:"1em"
        }
        return (
            <div>
            <div className="hflex">
                <div>{this.props.name}</div>
                <div><fieldset style={fsStyle}>
                    €<input type="radio" name={"currency"} value={"EUR"} style={rbStyle}/>
                    $<input type="radio" name={"currency"} value={"USD"} />
                </fieldset></div>
            </div>
            </div>
        )
    }
}
export default PortfolioHeader;