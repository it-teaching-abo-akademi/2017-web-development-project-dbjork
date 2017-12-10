import React, { Component } from 'react';



export const type = {
    input: 'input',
    warning: 'warning',
    error: 'error'
};

class ModalPopup extends Component {

    constructor(props){
        super(props);
        this.state={};
        this.handleChange=this.handleChange.bind(this);
        this.accept=this.accept.bind(this);
    }

    render() {
        if (!this.props.show){
            return null;
        }
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50
        };

        // The modal "window"
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 500,
            minHeight: 300,
            margin: '0 auto',
            padding: 4
        };
        const closeBtnStyle = {
            position:'relative',
            float:'right',
            right:'2px',
            top:'2px'
        }
        const contentsStyle = {
            padding:28
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
            <div className='backdrop' style={backdropStyle}>
                <div className='modal' style={modalStyle}>
                    <div className='closeBtn' style={closeBtnStyle} onClick={this.props.onCancel}>X</div>
                    <div style={contentsStyle}>
                        <div className='hflex'>
                            <div style={fieldStyle}>{this.props.header}</div>
                        </div>
                        <div style={fieldStyle}>{this.props.msg}</div>
                        {textFields}
                        <div className="buttonrow hflex" style={fieldStyle}>
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
    }

}

ModalPopup.defaultProps =  {okText: "OK"};

export default ModalPopup;