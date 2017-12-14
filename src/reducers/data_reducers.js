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
    SELECT_STOCK, REQUEST_CURRENCY, RECEIVE_CURRENCY, CHANGE_RATE_USD_TO_EUR
} from "../actions";
import { combineReducers } from 'redux';

const initialState = {
    nextPortfolioId:0,
    portfolios: []
}

const portfolio = (state = initialState, action) => {
    switch (action.type){
        case CREATE_PORTFOLIO:
            return state.portfolios.length<10?
                {
                    ...state,
                    nextPortfolioId:state.nextPortfolioId+1,
                    portfolios: [
                        ...state.portfolios,
                        {
                            name: action.name,
                            id: ++state.nextPortfolioId,
                            currency: "EUR",
                            nextStockId:0,
                            stocks: []

                        } ]
                }:state;
        case DELETE_PORTFOLIO:
            return {
                ...state,
                portfolios: state.portfolios.reduce((newArray, p) => {
                        if (p.id !== action.id) newArray.push(Object.assign({}, p));
                        return newArray;
                    },[])
            };
        case CHECK_SYMBOL:
            return action.checkTicker;
        case CREATE_STOCK:
            return {
                ...state,
                portfolios: state.portfolios.map(function(portfolio){
                    if (portfolio.id===action.stock.portfolioId) {
                        return Object.assign({},
                            portfolio, {
                                stocks: [...portfolio.stocks,
                                    {
                                        ...action.stock,
                                        id: ++portfolio.nextStockId,
                                    }
                                ]
                            });
                    }
                    return portfolio;
                })
            };
        case UPDATE_STOCK:
            return {
                ...state,
                portfolios: state.portfolios.map(function(portfolio){
                    if (portfolio.id===action.stock.portfolioId) {
                        var newPortfolio = Object.assign({},
                             { ...portfolio,
                                stocks: portfolio.stocks.map((s) => {
                                    if (s.id === action.stock.id) {
                                        return action.stock
                                    }
                                    return s;
                                })
                            });
                        return newPortfolio;
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
                                stocks: portfolio.stocks.reduce((newArr, s) => {
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
        case SELECT_STOCK:
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
        case CURRENCY_CHANGED:
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
        case CHANGE_RATE_USD_TO_EUR:
            return {
                ...state,
                exchangeRate:action.rate
            }
        default:
            return state;
    }
}


const current = (state = {
    isFetching: 0,
    didInvalidate: false,
    items: []
}, action) => {
    switch (action.type) {
        case REQUEST_CURRENT:
        case REQUEST_CURRENCY:
            return {
                ...state,
                isFetching: ++state.isFetching,
                didInvalidate: false
            }
        case RECEIVE_CURRENT:
            return {
                ...state,
                isFetching: --state.isFetching,
                didInvalidate:false,
                items: action.tickerData,
                last_updated: action.receivedAt
            }
        case RECEIVE_CURRENCY:
            return {
                ...state,
                isFetching: --state.isFetching,
                didInvalidate:false,
                items: action.tickerData,
                e_rate_last_updated: action.receivedAt
            }
        case RECEIVE_ERROR:
            return {
                ...state,
                isFetching:--state.isFetching,
                didInvalidate:false,
                isError:true,
                error:action
            }
        default:return state
    }
}
const uiReducers = combineReducers({
    portfolio,
    current
})

export default uiReducers;