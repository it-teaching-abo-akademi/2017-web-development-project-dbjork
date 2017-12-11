export * from './ui_actions';
export const REQUEST_CURRENT= 'REQUEST_CURRENT';
export const REQUEST_HISTORY= 'REQUEST_HISTORY';
export const CHECK_SYMBOL= 'CHECK_SYMBOL';
export const RECEIVE_CURRENT = 'RECEIVE_CURRENT';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const CREATE_PORTFOLIO = 'CREATE_PORTFOLIO';
export const DELETE_PORTFOLIO = 'DELETE_PORTFOLIO';
export const CREATE_STOCK = 'CREATE_STOCK';
export const DELETE_STOCK = 'DELETE_STOCK';
export const CURRENCY_CHANGED='CURRENCY_CHANGED';
const API_KEY='D1XU3PX9Y03RG502';


export const requestCurrent = stock => ({
    type: REQUEST_CURRENT,
    stock
});

export const fetchCurrent = stock => dispatch => {
    dispatch (requestCurrent(stock))
    return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.symbol}&interval=1min&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(json=>dispatch(receiveCurrent(stock,json)))
        .then((stock)=>dispatch(currentReceived(stock)))
};

export const createStock = (stock) => ({
    type: CREATE_STOCK,
    stock
});

export const currentReceived = (stock) => (
{
    type: RECEIVE_CURRENT,
    pId: stock.id,
    receivedAt: Date.now()
});


export const receiveCurrent = (stock, json) => {
    return dispatch => {
        let tSeries = json["Time Series (1min)"];
        let value = tSeries[Object.keys(tSeries)[0]]["1. open"];
        let totalValue = value * stock.amount;
        return dispatch(createStock(
            {
                ...stock,
                value,
                totalValue
            }));
    };
};


export const createPortfolio = (name) => {return {
    type: CREATE_PORTFOLIO,
    name
}};
export const deletePortfolio = (id) => ({
    type: DELETE_PORTFOLIO,
    id
})

export const addStock = (portfolioId, symbol, amount) => (dispatch) => {
    const stock={
        portfolioId,
        symbol,
        amount,
        value: 0,
        totalValue:0
    };
    return dispatch(fetchCurrent(stock));
//    return {type:CREATE_STOCK,valuedStock};
};
export const deleteStock = (portfolioId, id) => {
    return {
        type:DELETE_STOCK,
        portfolioId,
        id
    }
}
export const changeCurrency = (pId, newCurrency) => {
    return {
        type:CURRENCY_CHANGED,
        pId,
        newCurrency
    }
};
