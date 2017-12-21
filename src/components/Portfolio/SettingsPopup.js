/* Settings popup for the portfolio component. At the moment only sets the
 * data request type for the portfolio current values.
 * (Always intraday, settable between 1 and 60 min.)
 *
 * Author Dan Björkgren 2017
 * Uses rc-slider library
 *
 * TODO: Add functionality to enable/disable automatic updating when implemented
 * TODO: Add props type checking
 * TODO: The ui/ux is not to my satisfaction.
 * */
import React, {Component} from 'react';
import Slider from 'rc-slider';
import './settings.css';
import 'rc-slider/assets/index.css';

import PropTypes from 'prop-types';

/* using milliseconds as slider scale is inconvenient at best, the component does not like
 * values that are greater than the amount of pixels available.
 * Conversion table and function for converting between milliseconds and slider scale */
const MARKS_TO_MS = {0:60000, 60:300000,120:900000,200:1800000,300:3600000};
const msToMarks = (ms) => Object.keys(MARKS_TO_MS).find(key => MARKS_TO_MS[key] === ms);

class SettingsPopup extends Component {
    constructor(props) {
        super(props);
        // We need to handle the state of the slider internally, otherwise it will
        // be impossible to change (re-rendering resets the value)
        const preset = props.settings?props.settings.frequency:3600000;
        this.state={frequency:preset};

        // Ensure "this" is available to these functions
        this.handleChange=this.handleChange.bind(this);
        this.accept=this.accept.bind(this);
    }

    render() {
        if (!this.props.show){// No need for rendering if hidden
            return null;
        }

        // The modal "window"
        const modalStyle = {
            maxWidth: this.props.maxWidth,
            minHeight: this.props.minHeight,
        };
        // Inline styles for the slider
        const contentsStyle = {
            padding:28
        };
        const headerStyle= {
            flexGrow:1
        };
        const fieldStyle = {
            padding:6,
            margin:4
        };

        // define the slider stops and labels.
        const marks={0:"1 min", 60:"5 min", 120:"15 min", 200:"30 min", 300:"Hourly" };
        return (

            <div className='backdrop'>
                <div className='modal' style={modalStyle}>
                    <div className='hflex'>
                        <div style={headerStyle}>{this.props.header}</div>
                        <div className='close-btn'  onClick={this.props.onCancel}>X</div>
                    </div>
                    <div className="settings-container" style={contentsStyle}>
                        <div style={fieldStyle}>{this.props.msg}</div>
                        <div className="vflex">
                            <div className={"slider-container"}>
                                <p>History and update frequency</p>
                            <Slider min={0} max={300} marks={marks}  onChange={this.handleChange} value={msToMarks(this.state.frequency)} step={null} />
                            </div>
                        </div>
                        <div className="button-row hflex" >
                            <button onClick={this.props.onCancel}>Cancel</button>
                            <button onClick={this.accept}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    handleChange(e){
        const val=Number.isInteger(e)?MARKS_TO_MS[e]:e.target.value
        this.setState(Number.isInteger(e)?{frequency:val}:{[e.target.name]: val })
    }
    accept(){
        this.props.onAcceptVal(this.state);// Send the settings to parent compnent on accept
        this.props.onCancel();
    }
}

SettingsPopup.propTypes = {};
SettingsPopup.defaultProps = {
    header:"Settings",
    maxWidth:1000,
    minHeight:300
};

export default SettingsPopup;
