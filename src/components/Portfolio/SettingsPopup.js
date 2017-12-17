import React, {Component} from 'react';
import Rcslider from 'rc-slider';
import PropTypes from 'prop-types';


class SettingsPopup extends Component {
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
        var textFields=React.Children.map(this.props.children, (textInput) =>
        {
            return React.cloneElement(textInput,{
                style: fieldStyle,
                onChange: this.handleChange
            });
        });

        return (
            <div className='backdrop'>
                <div className='modal' style={modalStyle}>
                    <div className='hflex'>
                        <div style={headerStyle}>{this.props.header}</div>
                        <div className='close-btn'  onClick={this.props.onCancel}>X</div>
                    </div>
                    <div style={contentsStyle}>
                        <div style={fieldStyle}>{this.props.msg}</div>
                        <div class="vflex">
                            <Rcslider/>
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
}

SettingsPopup.propTypes = {};
SettingsPopup.defaultProps = {};

export default SettingsPopup;
