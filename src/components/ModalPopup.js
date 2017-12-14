import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './modalpopup.css';



export const type = {
    input: 'input',
    warning: 'warning',
    error: 'error'
};

class ModalPopup extends Component {

    constructor(props){
        super(props);
        this.state = {pId:this.props.pId};
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
                        {textFields}
                        <div className="button-row hflex" >
                            <button onClick={this.props.onCancel}>Cancel</button>
                            <button onClick={this.accept}>{this.props.okText}</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value })

    }
    accept(){
        this.props.onAcceptVal(this.state);
        this.props.onCancel();
    }

}

ModalPopup.propTypes = {
    header:PropTypes.string.isRequired,
    msg:PropTypes.string.isRequired,
    minHeight: PropTypes.number,
    maxWidth:PropTypes.number,
    onCancel:PropTypes.func.isRequired,
    okText:PropTypes.string,
    onAcceptVal: PropTypes.func.isRequired
}
ModalPopup.defaultProps =  {
    okText: "OK",
    maxWidth:500,
    minHeight:300
};

export default ModalPopup;