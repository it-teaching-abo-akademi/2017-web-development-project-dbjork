import React, { Component } from 'react';
import logo from './resources/logo1.svg';
import './App.css';
import './base.css';
import  ModalPopup  from './components/ModalPopup';
import Portfolio from './components/Portfolio/Portfolio';
import { connect } from 'react-redux';
import {showPage, pages, createPortfolio, deletePortfolio} from "./actions";

class AppComponent
    extends Component {
    render() {
        const deleteFunc=this.props.deletePortfolio
        var portfolios= this.props.portfolios.map(function(p){
            return <Portfolio name={p.name} key={p.name} id={p.id} currency={p.currency} onDelete={deleteFunc}/>
        });
        this.props.error && alert(this.props.error.errorMessage + "\n" + this.props.error.detailMessage + "\n" + (this.props.error.source['Error Message'] || ""));
        return (
            <div className="App">
                <header className="App-header hflex">
                    <div className="logo-div">
                        <img src={logo} className="App-logo vcenter" alt="logo" />
                    </div>
                    <div className="hflex add-div">
                        <button id="add-portfolio" className="vcenter" onClick={this.props.askForPortfolioName}>
                            Add new portfolio
                        </button>
                        <h1 className="App-title vcenter">Stock Portfolio Management System</h1>
                    </div>
                </header>
                <div className="contents">
                    <div>

                        <ModalPopup show={this.props.asksForPortfolioName} onAcceptVal={this.props.createPortfolio}
                                    msg= {"Please enter a name for your new portfolio"}
                                    header={"New Portfolio"} okText={'Create Portfolio'} onCancel={this.props.closePortfolioModal}>
                            <div className="hflex">
                                <div className="label" style={{minWidth:"6ch"}}>Name:</div>
                                <input type={"text"} name={"returnValue"} maxLength={32}/>
                            </div>
                        </ModalPopup>
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
        portfolios: state.dataReducers.portfolio.portfolios,
        error: state.dataReducers.current.error
    }
};
const mapDispatchToProps = dispatch => {
    return {
        askForPortfolioName: () => { dispatch(showPage(pages.SHOW_ASK_P_NAME))},
        closePortfolioModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        createPortfolio: (newPortfolio) => { dispatch(createPortfolio(newPortfolio.returnValue))},
        deletePortfolio: (portfolioId) => { window.confirm("This will delete this portfolio. The action can not be undone\n Are you certain?") && dispatch(deletePortfolio(portfolioId))}
    }
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppComponent);
export default App;
