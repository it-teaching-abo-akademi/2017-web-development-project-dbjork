import React, {Component} from 'react';
import Slider from 'rc-slider';
import './settings.css';
import 'rc-slider/assets/index.css';
import PropTypes from 'prop-types';

const MARKS_TO_MS = {0:60000, 60:300000,120:900000,200:1800000,300:3600000,  600:86400000, 900:604800000, 1300:2629822966};

const msToMarks = (ms) => Object.keys(MARKS_TO_MS).find(key => MARKS_TO_MS[key] === ms);
class SettingsPopup extends Component {
    constructor(props) {
        super(props);
        const preset = props.settings?props.settings.frequency:3600000;
        this.state={frequency:preset};
        this.handleChange=this.handleChange.bind(this);
        this.accept=this.accept.bind(this);
    }

    render() {
        if (!this.props.show){
            return null;
        }

        // The modal "window"
        const modalStyle = {
            maxWidth: this.props.maxWidth,
            minHeight: this.props.minHeight,
        };
        const contentsStyle = {
            padding:28
        }
        const headerStyle= {
            flexGrow:1
        }
        const fieldStyle = {
            padding:6,
            margin:4
        }
        const railStyle = {
            height:"10px",
            background:"blue",
            borderRadius:"4px"
        }
        const dotStyle = {
            background:"black",
            width:"4px",
            height:"6px",
            color:"red"
        }
        const handleStyle = [
            {
                height:"20px",
                width:"16px",
                background:"black"
            }
        ]

        const marks={0:"1 min", 60:"5 min", 120:"15 min", 200:"30 min", 300:"Hourly", 600:"Daily", 900:"Weekly", 1300:"Monthly" };
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
                            <Slider min={0} max={1300} marks={marks} value={6} onChange={this.handleChange} value={msToMarks(this.state.frequency)} step={null} />
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
        this.setState()
        this.props.onAcceptVal(this.state);
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
