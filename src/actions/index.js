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
export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const UPDATE_STOCK = 'UPDATE_STOCK';
export const SELECT_STOCK = 'SELECT_STOCK';
export const CHANGE_RATE_USD_TO_EUR = 'CHANGE_RATE_USD_TO_EUR';
export const RECEIVE_CURRENCY = 'RECEIVE_CURRENCY';
export const REQUEST_CURRENCY = 'REQUEST_CURRENCY';

const API_KEY='D1XU3PX9Y03RG502';

export const changeCurrency = (pId, newCurrency) => {
    return {
        type:CURRENCY_CHANGED,
        pId,
        newCurrency
    }
};

export const requestCurrent = stock => ({
    type: REQUEST_CURRENT,
    stock
});

export const requestCurrency= () =>  {
    return {
        type: REQUEST_CURRENCY
    }
}

export const fetchCurrent = stock => dispatch => {
    dispatch (requestCurrent(stock))
    return fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stock.symbol}&interval=60min&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(json=>dispatch(receiveCurrent(stock,json)))
        .then((stock)=>dispatch(currentReceived(stock)))
    };

export const fetchCurrency = (pId, newCurrency, fetchNew) => dispatch => {
    dispatch (changeCurrency(pId, newCurrency))
    if (!(fetchNew)) return null
    dispatch (requestCurrency())
    return fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(json=>dispatch(receiveCurrency(json)))
        .then((rate)=>dispatch(currencyReceived(rate)))
}


export const currentReceived = (stock) => (
    {
        type: RECEIVE_CURRENT,
        pId: stock.id,
        receivedAt: Date.now()
    });

export const currencyReceived = (rate) => {
    return {
        type:RECEIVE_CURRENCY,
        rate,
        receivedAt: Date.now()
    }
}
// export const currencyReceived = (rate) => {
//     return {
//         type:CHANGE_RATE_USD_TO_EUR,
//         rate
//     }
// }
export const jsonError = (stock, json) => dispatch=> {
return dispatch ({
    type: RECEIVE_ERROR,
    errorMessage: "Unable to extract stock data from response",
    detailMessage: "Possible cause: " + stock.symbol + " is not a valid stock ticker",
    source:json
})
};

export const receiveCurrent = (stock, json) => dispatch => {
    try {
        const interval = json["Meta Data"]["4. Interval"];
        const tSeries = json["Time Series ("+ interval + ")"];
        const value = tSeries[Object.keys(tSeries)[0]]["4. close"];
        const totalValue = value * stock.amount;
        const history = tSeries[Object.keys(tSeries)];
        const stockWValues =  {
                ...stock,
                value,
                totalValue,
                interval,
                history
            }
        return stock.id === 0 ? dispatch(createStock(stockWValues)):dispatch(updateStock(stockWValues));
    } catch (e) {
        return dispatch(jsonError(stock,json))
    }
};

export const receiveCurrency = (json) => {
    const rate=parseFloat(json["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
    return {
        type: CHANGE_RATE_USD_TO_EUR,
        rate
    }
}


export const updateStock = (stock) => {
    return { type:UPDATE_STOCK, stock };
}


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
        id:0,
        portfolioId,
        symbol,
        amount,
        value: 0,
        totalValue:0
    };
    return dispatch(fetchCurrent(stock));
};
export const deleteSelectedStock = (portfolioId) => {
    return {
        type:DELETE_STOCK,
        portfolioId
    }
}
export const selectStock = (portfolioId, stockId, selected) => {
    return {
        type:SELECT_STOCK,
        portfolioId,
        stockId,
        selected
    }
}
export const createStock = (stock) => ({
    type: CREATE_STOCK,
    stock
});
