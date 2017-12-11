import {
    REQUEST_CURRENT,
    REQUEST_HISTORY,
    CHECK_SYMBOL,
    RECEIVE_CURRENT,
    RECEIVE_HISTORY,
    CREATE_PORTFOLIO,
    DELETE_PORTFOLIO,
    CREATE_STOCK,
    DELETE_STOCK, CURRENCY_CHANGED
} from "../actions";
import { combineReducers } from 'redux';

const initialState = {
    nextPortfolioId:1,
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
                            id: state.nextPortfolioId+1,
                            currency: "EUR",
                            nextStockId:0,
                            stocks: []

                        } ]
                }:state;
        case DELETE_PORTFOLIO:
            return {
                state,
                portfolios: [
                    ...state.portfolios.slice(0,action.id),
                    ...state.portfolios.slice(action.id+1)
                ]
            };
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
            case CHECK_SYMBOL:
                return action.checkTicker;
        case CREATE_STOCK:
            return {
                ...state,
                portfolios: state.portfolios.map(function(portfolio){
                    if (portfolio.id===action.stock.portfolioId) {
                        var newPortfolio = Object.assign({},
                            portfolio, {
                                stocks: [...portfolio.stocks,
                                    {
                                        ...action.stock,
                                        id: ++portfolio.nextStockId,
                                        history: []
                                    }
                                ]
                            });
                        return newPortfolio;
                    }
                    return portfolio;
                })
            };
        default:
            return state;
    }
}


const current = (state = {
    isFetching: false,
    pId:0,
    didInvalidate: false,
    items: []
}, action) => {
    switch (action.type) {
        case REQUEST_CURRENT:
            return {
                ...state,
                pId: action.stock.portfolioId,
                isFetching: true,
                didInvalidate: false
            }
        case RECEIVE_CURRENT:
            return {
                ...state,
                isFetching:false,
                pId:0,
                didInvalidate:false,
                items: action.tickerData,
                last_updated: action.receivedAt
            }
        default:return state
    }
}
const uiReducers = combineReducers({
    portfolio,
    current
})

export default uiReducers;