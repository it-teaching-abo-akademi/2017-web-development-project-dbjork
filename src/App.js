/** Main app component.
 * Displays a grid of "portfolios" two by two if space allows
 * Allows for adding portfolios
 *
 * Author Dan Björkgren, 40072, 2017
 *
 * TODO: Add credits page
 * */
import React, { Component } from 'react';
import logo from './resources/logo1.svg';
import warning from './resources/warning.svg';
import './App.css';
import './base.css';
import Credits from './components/Credits';
import  ModalPopup  from './components/ModalPopup';
import Portfolio from './components/Portfolio/Portfolio';
import NotificationBadge from 'react-notification-badge';
import { connect } from 'react-redux';
import {showPage, pages, createPortfolio, deletePortfolio, fetchCurrency, clearError, clearJSONErrors} from "./actions/data_actions";

class AppComponent
    extends Component {
    constructor(props){
        super(props);
        this.state={hovering:false,x:0,y:0,stayOpen:false}
        this.handleErrorHover = this.handleErrorHover.bind(this);
        this.handleErrorListHover=this.handleErrorListHover.bind(this);
    }
    componentDidMount() {
        this.props.fetchCurrencyExchangeValue();
    }
    render() {
        const errorListStyle = {
            position:"absolute",
            left:(this.state.x-250)+"px",
            top:this.state.y+"px",
            display:this.state.hovering||this.state.stayOpen?"inline":"none",
            zIndex:120

        };
        const clearBtnStyle = {
            fontSize:"95%",
            padding:"2px",
            paddingLeft:"0.5em",
            paddingRight:"0.5em",
            color:"black",
            backgroundColor:"white",
            borderRadius:"2px",
        }
         const errorComponents =   this.props.errorList.map((e)=>{
                return (<div className={"error-item"}>
                    <div className={"error-msg"}><p>{e.errorMessage}</p></div>
                    <div className={"error-detail"}><p>{e.detailMessage}</p></div>
                    <div className={"error-source"}><p>{Object.keys(e.json)[0]+": "+e.json[Object.keys(e.json)[0]]}</p></div>
                </div>);
            });
        const deleteFunc=this.props.deletePortfolio
        const portfolios= this.props.portfolios.map(function(p){//Create a Portfolio component for every portfolio in the array
            return <Portfolio name={p.name} key={p.name} id={p.id} currency={p.currency} onDelete={deleteFunc}/>
        });
        return (
            <div className="App">
                <header className="App-header hflex">
                    <div className="logo-div">
                        <img src={logo} className="App-logo vcenter" alt="logo" />
                    </div>
                    <div className="hflex add-div">
                        <button disabled={portfolios.length>9} id="add-portfolio" className="vcenter" onClick={this.props.askForPortfolioName}>
                            Add new portfolio
                        </button>
                        <h1 className="App-title vcenter">Stock Portfolio Management System</h1>
                    </div>
                    <div>
                        <NotificationBadge count={this.props.errorCount}/>
                        <img src={warning}
                             style={{display:this.props.errorCount>0?"inline":"none",width:"6vw"}}
                             onMouseEnter={this.handleErrorHover} onMouseLeave={this.handleErrorHover}/>
                        <div className={"error-list"} style={errorListStyle} onMouseEnter={this.handleErrorListHover} onMouseLeave={this.handleErrorListHover}>
                            <div className={"errorListTopRow error-item"}><button style={clearBtnStyle}onClick={this.props.clearErrors}>Clear</button></div>
                            {errorComponents}</div>
                    </div>
                </header>
                <div className="contents">
                    <div>
                        <ModalPopup show={this.props.asksForPortfolioName} onAcceptVal={this.props.createPortfolio}
                                    msg= {"Please enter a name for your new portfolio"}
                                    header={"New Portfolio"} okText={'Create Portfolio'} onCancel={this.props.closeModal}>
                            <div className="hflex">
                                <div className="label" style={{minWidth:"6ch"}}>Name:</div>
                                <input autoFocus={true} type={"text"} name={"returnValue"} maxLength={32}/>
                            </div>
                        </ModalPopup>
                        {portfolios}
                        <ModalPopup show={this.props.showCredits} header={"Credits"} msg={"The following resources have been used in this project"} onCancel={this.props.closeModal} onAcceptVal={this.props.closeModal}>
                            <Credits/>
                        </ModalPopup>
                    </div>
                </div>
                <div className="footer">
                    {/* TODO: Create a credits page and add a link to that instead */}
                    <div onClick={this.props.handleShowCredits}><p>Show Credits</p></div>
                    { /* <div>Icons made by
                        <a href="http://www.freepik.com" title="Freepik">Freepik</a> and  <a href="https://www.flaticon.com/authors/roundicons" title="Roundicons">Roundicons</a>
                        from
                        <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                        is licensed by
                        <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>
                    </div> */}
                </div>
            </div>
        );
    }
    componentWillReceiveProps(newProps){
        if (newProps.error){
            alert(newProps.error.errorMessage + "\n" + newProps.error.detailMessage + "\n" + (newProps.error.source['Error Message'] || ""));
            this.props.clearError();
        }
    }
    handleErrorHover(e){
        this.setState({hovering:!this.state.hovering,x:e.clientX,y:e.clientY});
    }
    handleErrorListHover(e){
        this.setState({stayOpen:!this.state.stayOpen});
    }
}

const mapStateToProps = state => {
   /* const dummyObj = Object.assign({detailMessage: "Possible cause: aapl is not a valid stock ticker",
        errorMessage:"Unable to extract stock data from response",
        json: {Information:"Please consider optimizing your API call frequency."}});
    let dummyList=new Array(20).fill(dummyObj);*/
    return {
        asksForPortfolioName: state.uiReducers.visiblePage===pages.SHOW_ASK_P_NAME,
        showCredits:state.uiReducers.visiblePage===pages.SHOW_CREDITS,
        portfolios: state.dataReducers.portfolio.portfolios,
        error: state.dataReducers.current.error,
        errorCount:state.dataReducers.current.jsonErrorCount,
        errorList: state.dataReducers.current.jsonErrorList
    }
};
const mapDispatchToProps = dispatch => {
    return {
        fetchCurrencyExchangeValue: () => { dispatch(fetchCurrency(0,"USD",-1))},
        askForPortfolioName: () => { dispatch(showPage(pages.SHOW_ASK_P_NAME))},
        closeModal: () => { dispatch(showPage(pages.SHOW_PORTFOLIOS))},
        createPortfolio: (newPortfolio) => { return dispatch(createPortfolio(newPortfolio.returnValue))},
        deletePortfolio: (portfolioId) => { window.confirm("This will delete this portfolio. The action can not be undone\n Are you certain?") && dispatch(deletePortfolio(portfolioId))},
        clearError: ()=>{dispatch(clearError())},
        clearErrors: () => {dispatch(clearJSONErrors())},
        handleShowCredits: () => {dispatch(showPage(pages.SHOW_CREDITS))}
    }
};

const App = connect(
    mapStateToProps,
    mapDispatchToProps
)(AppComponent);
export default App;
