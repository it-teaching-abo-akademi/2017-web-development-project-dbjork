import React, { Component } from 'react';
import logo from './resources/logo1.svg';
import './App.css';
import './base.css';
import  ModalPopup  from './components/ModalPopup';
import Portfolio from './components/Portfolio/Portfolio';
import { connect } from 'react-redux';
import { showPage, pages, createPortfolio } from "./actions";

class AppComponent
    extends Component {
    render() {
        var portfolios= this.props.portfolios.map(function(p){
            return <Portfolio name={p.name} key={p.name} id={p.id} currency={p.currency}/>
        });

        return (
            <div className="App">
                <header className="App-header hflex">
                    <img src={logo} className="App-logo vcenter" alt="logo" />
                    <button id="add-portfolio" className="vcenter" onClick={this.props.askForPortfolioName}>
                        Add new portfolio
                    </button>
                    <h1 className="App-title vcenter">Stock Portfolio Management System</h1>
                </header>
                <div className="contents">
                    <ModalPopup show={this.props.asksForPortfolioName} onAcceptVal={this.props.createPortfolio}
                                msg= {"Please enter a name for your new portfolio"}
                                header={"New Portfolio"} okText={'Create Portfolio'} onCancel={this.props.closePortfolioModal}>
                        <input type={"text"} name={"returnValue"}/>
                    </ModalPopup>
                    <div>
                        {portfolios}
                    </div>
                </div>
                <div className="footer">
                    <div>Icons made by
                        <a href="http://www.freepik.com" title="Freepik">Freepik</a> and  <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>
                        from
                        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        is licensed by
                        <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        asksForPortfolioName: state.uiReducers.visiblePage===pages.SHOW_ASK_P_NAME,
        portfolios: state.dataReducers.portfolio.portfolios
    }
};
const mapDispatchToProps = dispatch => {
    return {
        askForPortfolioName: () => { dispatch(showPage(pages.SHOW_ASK_P_NAME))},
        closePortfolioModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        createPortfolio: (newPortfolio) => { dispatch(createPortfolio(newPortfolio.returnValue))}
    }
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppComponent);
export default App;
