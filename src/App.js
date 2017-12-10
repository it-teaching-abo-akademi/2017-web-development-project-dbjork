import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo1.svg';
import './App.css';
import './base.css';
import  ModalPopup  from './components/ModalPopup';
import  { type }  from './components/ModalPopup';
import Portfolio from './components/Portfolio/Portfolio';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            asksForPortfolioName: false,
            portfolios: []
        }
        this.askForPortfolioName = this.askForPortfolioName.bind(this);
        this.createPortfolio = this.createPortfolio.bind(this);
        this.closePortfolioModal=this.closePortfolioModal.bind(this);
    }
    render() {
        return (
            <div className="App">
                <header className="App-header hflex">
                    <img src={logo} className="App-logo vcenter" alt="logo" />
                    <button id="add-portfolio" className="vcenter" onClick={this.askForPortfolioName}>
                        Add new portfolio
                    </button>
                    <h1 className="App-title vcenter">Stock Portfolio Management System</h1>
                </header>
                <div className="contents">
                        <ModalPopup show={this.state.asksForPortfolioName} onAcceptVal={this.createPortfolio}
                                    msg= {"Please enter a name for your new portfolio"}
                        header={"New Portfolio"} okText={'Create Portfolio'} onCancel={this.closePortfolioModal}>
                            <input type={"text"} name={"returnValue"}></input>
                        </ModalPopup>
                    <div>
                        {this.state.portfolios}
                    </div>
                </div>
                <div className="footer">
                    <div>Icons made by
                        <a href="http://www.freepik.com" title="Freepik">Freepik</a>
                        from
                        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        is licensed by
                        <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
                    </div>
                </div>
            </div>
        );
    }
    askForPortfolioName(){
        this.setState({ asksForPortfolioName: true});
    }
    createPortfolio(newPortfolio){
        this.setState({asksForPortfolioName: false});
        this.state.portfolios.push(<Portfolio name={newPortfolio.returnValue} key={newPortfolio.returnValue}/>);
    }
    closePortfolioModal(){
        this.setState({asksForPortfolioName:false});
    }

}

export default App;
