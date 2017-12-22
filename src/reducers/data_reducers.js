/* Standard react reducer for changing the apps state
 *
 * Author: Dan Björkgren 2017
 *
 * Rudimentary switch statements, could probably be done in a more
 * "compartmentalized" manner. This seems to be the standard react way
 * of doing them however, so I won't spend extra energy on refining it
 * at the moment.
 * There are two plus one reducers here, portfolio handles all data related to
 * application data state, current (which btw is somewhat of a misnomer) handles
 * asynchronous (fetching data) state.
 * The +1 is a dummy reducer necessary for the version property to be included in state.
 * The real functionality is in index.js.
 * A version string is compared to previously persisted data. If the structure has changed
 * so that reading it would result in an invalid state the persisted state is wiped.
 * Be sure to update the version if the app state is changed in a non- backwards compatible way.
 * */
import {
    REQUEST_CURRENT,
    REQUEST_HISTORY,
    CHECK_SYMBOL,
    RECEIVE_CURRENT,
    RECEIVE_HISTORY,
    CREATE_PORTFOLIO,
    DELETE_PORTFOLIO,
    CREATE_STOCK,
    DELETE_STOCK,
    CURRENCY_CHANGED,
    RECEIVE_ERROR,
    UPDATE_STOCK,
    UPDATE_HISTORY,
    SELECT_STOCK,
    REQUEST_CURRENCY,
    RECEIVE_CURRENCY,
    CHANGE_RATE_USD_TO_EUR,
    SAVE_SETTINGS,
    TIME_SERIES,
    CLEAR_ERROR, CLEAR_JSON_ERRORS
} from "../actions/data_actions";
import { combineReducers } from 'redux';

const initialState = {
    nextPortfolioId:0,
    portfolios: [],
}

const portfolio = (state = initialState, action) => {
    // No break needed since we always return immediately
    switch (action.type){
        case CREATE_PORTFOLIO:
            let moment=require('moment');
            // Only allow a maximum of 10 portfolios
            return state.portfolios.length<10?
                {
                    ...state,
                    nextPortfolioId:state.nextPortfolioId+1,
                    portfolios: [
                        ...state.portfolios,
                        { // Append a new portfolio
                            name: action.name,
                            id: ++state.nextPortfolioId,
                            currency: "EUR",
                            nextStockId:0,
                            stocks: [],
                            settings: { //Default portfolio settings
                                frequency:TIME_SERIES.TS_INTRADAY_60,
                                historyFrequency:TIME_SERIES.TS_DAILY,
                                historyStart:moment().subtract(100, 'days'),
                                historyEnd:moment(),
                                isLongFormat:false

                            }

                        } ]
                }:state;
        case DELETE_PORTFOLIO:
            return {
                ...state,
                portfolios: state.portfolios.reduce((newArray, p) => { //Filter out the portfolio to be deleted
                    if (p.id !== action.id) newArray.push(Object.assign({}, p));
                    return newArray;
                },[])
            };
        case CHECK_SYMBOL: //This is not used atm, Alphavantage has no api to check the validity of a symbol
            //TODO: Find an API to check the symbol for validity
            //TODO: Find an API that returns what stock exchange a stock is traded on. (Portfolios should not mix exchanges since the historical data returned differs)
            return action.checkTicker;
        case CREATE_STOCK:
            return {
                ...state,
                portfolios: state.portfolios.map(function (portfolio) {
                    if (portfolio.id === action.stock.portfolioId) {
                        const exists = portfolio.stocks.find((s)=>{ return s.symbol===action.stock.symbol});
                        if (exists ){
                            throw new Error("You can only add a stock once!\n(Delete and re-add if you want to change the amount")
                        }
                        if (portfolio.stocks.length > 49) {
                            throw new Error("Only 50 stocks allowed for each portfolio.\nAdd another portfolio if you need more");
                        }
                        return Object.assign({},
                            portfolio, {
                                stocks: [...portfolio.stocks,
                                    {
                                        ...action.stock, //Append a new stock and assign it an id
                                        id: ++portfolio.nextStockId,
                                    }
                                ]
                            });
                    }
                    return portfolio;
                })
            };
        case UPDATE_STOCK:
        case UPDATE_HISTORY:
            return {
                ...state,
                portfolios: state.portfolios.map(function (portfolio) {
                    if (portfolio.id === action.stock.portfolioId) { //Find the right portfolio
                        return Object.assign({},
                            {
                                ...portfolio,
                                stocks: portfolio.stocks.map((s) => {
                                    if (s.id === action.stock.id) {// Find the right stock
                                        return action.type === UPDATE_STOCK ?
                                            {//Update current values
                                                ...s,
                                                value: action.stock.value,
                                                totalValue: action.stock.totalValue
                                            } : {//Update history
                                                ...s,
                                                history: action.stock.history
                                            };
                                    }
                                    return s;
                                })
                            });
                    }
                    return portfolio;
                })
            };
        case DELETE_STOCK:
            return {
                ...state,
                portfolios: state.portfolios.map(function(portfolio){
                    if (portfolio.id===action.portfolioId) {
                        var newPortfolio = Object.assign({},
                            { ...portfolio,
                                stocks: portfolio.stocks.reduce((newArr, s) => { //Filter the list, remove this stock
                                    if (!s.selected) {
                                        newArr.push(s);
                                    }
                                    return newArr;
                                }, [])
                            });
                        return newPortfolio;
                    }
                    return portfolio;
                })
            };
        case SELECT_STOCK: //TODO: candidate for moving to ui reducer
            return {
                ...state,
                portfolios: state.portfolios.map((p)=>{
                    if (p.id === action.portfolioId){
                        const newStockList = { ...p,
                            stocks: p.stocks.map((s)=>{
                                if (s.id===action.stockId){
                                    return {...s, selected:action.selected};
                                }
                                return s;
                            })}
                        return newStockList;
                    }
                    return p;
                })

            }
        case CURRENCY_CHANGED: //TODO: candidate for moving to ui reducer
            return {
                ...state,
                portfolios:
                    state.portfolios.map(function(portfolio) {
                        if (portfolio.id === action.pId) {
                            portfolio.currency = action.newCurrency;
                        }
                        return portfolio
                    })
            }
        case CHANGE_RATE_USD_TO_EUR://TODO: Possible candidate for moving to ui reducer(?)
            return {
                ...state,
                exchangeRate:action.rate
            }
        case SAVE_SETTINGS://Even though this is mainly a ui thing, it updates the persistent data, should not be moved.
            return {
                ...state,
                portfolios:
                    state.portfolios.map((portfolio)=>{
                        if (portfolio.id === action.pId) {
                            const settings=Object.assign({}, portfolio.settings, action.settings);
                            return Object.assign({}, {
                                ...portfolio,
                                settings:settings
                            })}
                        return portfolio;
                    })
            }
        default:
            return state;
    }
}

const decreaseRequester = function (rqMap, requester) {
    let thisRequester = rqMap.get(requester);
    thisRequester ? rqMap.set(requester, thisRequester - 1) : null; //This should not happen, fail silently if it does
    if (rqMap.get(requester) < 1) {
        rqMap.delete(requester);
    }
    return rqMap;
};
const increaseRequester = function (rqMap, requester ){
    let thisRequester=rqMap.get(requester);
    rqMap.set(requester,thisRequester?thisRequester+1:1);
    return rqMap;
}
/* Keeps track of asynchronous state regarding fetching data */
const current = (state = {
    isFetching: 0, // Counter (several fetches can be done in parallel)
    currentRequesters: new Map(),// Map of requesting portfolios.
    historyRequesters: new Map(),// Map of requesting portfolios.
    e_rate_last_updated:0, //Tags the last time the exchange rate of USD/EUR was fetched
    jsonErrorCount:0,
    jsonErrorList:[]
}, action) => {
    switch (action.type) {
        case REQUEST_CURRENT:
            let cReq = increaseRequester(state.currentRequesters, action.requester);
            return {
                ...state,
                isFetching: ++state.isFetching,
                currentRequesters: cReq,
            }
        case REQUEST_HISTORY:
            let hReq=increaseRequester(state.historyRequesters, action.requester);
            return {
                ...state,
                isFetching: ++state.isFetching,
                historyRequesters: hReq,
            }
        case RECEIVE_CURRENT:
            let cRec = decreaseRequester(state.currentRequesters, action.requester);
            return {
                ...state,
                isFetching:--state.isFetching,
                currentRequesters: cRec,
                last_updated:action.receivedAt
            }
        case RECEIVE_HISTORY:
            let hRec = decreaseRequester(state.historyRequesters, action.requester);
            return {
                ...state,
                isFetching: --state.isFetching,
                last_updated: action.receivedAt, //Tracks when the last update was made
                historyRequesters:hRec
            }
        case RECEIVE_CURRENCY:
            return {
                ...state,
                e_rate_last_updated: action.receivedAt
            }
        case RECEIVE_ERROR: //Reset state in case fetching was unsuccessful
            let ecReq=state.currentRequesters;
            let ehReq = state.historyRequesters;
            if (action.requestType===REQUEST_CURRENT) decreaseRequester(ecReq,action.requester);
            if (action.requestType===REQUEST_HISTORY) decreaseRequester(ehReq,action.requester);
            if (!action.requestType) {
                // if request type is unset we have to be creative.
                // This is a workaround for the fact that we can't easily get hold
                // of the requesting portfolio in case of errors dispatched from the last catch
                // in the fetch promise chains. The chain would have to be rewritten to include
                // the portfolioid in all steps. TODO:rewrite fetch promise chain
                let thisERequester = ecReq.get(action.requester);
                if (thisERequester) {
                    decreaseRequester(ecReq, action.requester);
                } else {
                    thisERequester = ehReq.get(action.requester);
                    if (thisERequester) decreaseRequester(ehReq,action.requester);
                }
            }
            return {
                ...state,
                isFetching:--state.isFetching,
                currentRequesters:ecReq,
                historyRequesters:ehReq,
                jsonErrorCount:action.source!==""&&action.stock.id!==0?state.jsonErrorCount+1:state.jsonErrorCount,
                jsonErrorList: //Add a new error message to the list
                    action.source!==""&&action.stock.id!==0?addToJSONErrors(state.jsonErrorList,action):state.jsonErrorList,
                isError:action.source===""||action.stock.id===0,
                error:action.source===""||action.stock.id===0?action:null
            }
        case CLEAR_JSON_ERRORS:
            return {
                ...state,
                jsonErrorList:[],
                jsonErrorCount:0
            }
        case CLEAR_ERROR:
            return {
                ...state,
                isError:false,
                error:null
            }
        default:return state
    }
}
const addToJSONErrors = (errorList, action) =>
{
    let newArr=errorList.slice();
    newArr.push({
        json: action.source,
        errorMessage: action.errorMessage,
        detailMessage: action.detailMessage
    });
    return newArr;
}

const version = (state={version:0}, action)=> {return state}//Dummy to get the version property inserted in state
const dataReducers = combineReducers({
    version,
    portfolio,
    current
})

export default dataReducers;