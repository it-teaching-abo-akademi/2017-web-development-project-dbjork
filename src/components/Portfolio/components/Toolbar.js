import React, { Component } from 'react';

class Toolbar extends Component {

    render() {
        return (
            <div className="toolbar">
                <button onClick={this.props.onAddStock}>Add stock</button>
                <button onClick={this.props.onPerfGraph}>Perf graph</button>
                <button onClick={this.props.onRemove} >Remove selected</button>
            </div>
        )
    }


}

export default Toolbar;
