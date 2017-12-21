/* Fake "Modal" popup that covers the viewport and prevents clicking on items under it.
 * This is a generic component that can be altered by adding children directly in jsx
 * between the component start and end tags
 * Author Dan Björkgren 2017, inspired (more or less copied) by this blog post by Dave Ceddia:
 * https://daveceddia.com/open-modal-in-react/
 *
 * TODO: Use this for error and confirm messages instead of alert and confirm
 *
 * */
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
                        <form  onSubmit={(e) => this.accept(e)}>
                        {textFields}
                        <div className="button-row hflex" >
                            <button  type="button" onClick={this.props.onCancel}>Cancel</button>
                            <button type="submit">{this.props.okText}</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
    handleChange(e){
        this.setState({[e.target.name]: e.target.value })

    }
    accept(e){

        e.preventDefault();
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