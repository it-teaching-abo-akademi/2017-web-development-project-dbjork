/* Button row for portfolio
* Author Dan Björkgren 2017
* TODO: consider inlining this in the Portfolio component, it does nothing special and the props needed take about the same space as the component itself
* */
import React, { Component } from 'react';

class Toolbar extends Component {

    render() {
        return (
            <div className="toolbar hflex">
                <button disabled={!this.props.stocksCanBeAdded} onClick={this.props.onAddStock}>Add stock</button>
                <button disabled={!this.props.graphCanBeShown} onClick={this.props.onPerfGraph}>Perf graph</button>
                <button disabled={!this.props.hasSelected} onClick={this.props.onRemove} >Remove selected</button>
            </div>
        )
    }


}

export default Toolbar;
