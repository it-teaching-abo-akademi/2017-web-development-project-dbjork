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
export const SAVE_SETTINGS = 'SAVE_SETTINGS';

const API_KEY='D1XU3PX9Y03RG502';

export const TIME_SERIES = {
    60000: {
        milliSeconds:60000,
        function: "TIME_SERIES_INTRADAY",
        interval: "1min"
    },
    300000: {
        milliSeconds:300000,
        function: "TIME_SERIES_INTRADAY",
        interval: "5min"
    },
    900000: {
        milliSeconds:900000,
        function: "TIME_SERIES_INTRADAY",
        interval: "15min"
    },
    1800000: {
        milliSeconds:1800000,
        function: "TIME_SERIES_INTRADAY",
        interval: "30min"
    },
    3600000: {
        milliSeconds:3600000,
        function: "TIME_SERIES_INTRADAY",
        interval: "60min"
    },
    86400000: {
        milliSeconds:86400000,
        function: "TIME_SERIES_DAILY_ADJUSTED",
        data_set_id_string:"Time Series (Daily)"
    },
    604800000: {
        milliSeconds:604800000,
        function: "TIME_SERIES_WEEKLY_ADJUSTED",
        data_set_id_string:"Weekly Adjusted Time Series"
    },
    2629822966: {
        milliSeconds:2629822966,
        function: "TIME_SERIES_MONTHLY_ADJUSTED",
        data_set_id_string:"Monthly Adjusted Time Series"
    }
};


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

export const fetchCurrent = (stock, pId) => (dispatch, getState) => {
    dispatch (requestCurrent(stock))
    const s = getState().dataReducers
    const ts = s.portfolio.portfolios.find(function (p){
        return p.id===pId
    }).settings.frequency
    const func=TIME_SERIES[ts].function
    const interval = TIME_SERIES[ts].interval?"interval="+TIME_SERIES[ts].interval+"&":""
    return fetch(`https://www.alphavantage.co/query?function=${func}&symbol=${stock.symbol}&${interval}apikey=${API_KEY}`)
        .then(response => {
            if (!response.ok) throw response;
            return response;
        })
        .then(response => response.json())
        .then(json=>dispatch(receiveCurrent(stock,json, TIME_SERIES[ts])))
        .then((stock)=>dispatch(currentReceived(stock))).catch((reason)=>{
            const test = 1;
        })
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

export const receiveCurrent = (stock, json, timeSeries) => dispatch => {
    try {
          let interval=null;
          let tSeries=null;
          if (timeSeries.function==='TIME_SERIES_INTRADAY') {
              interval = json["Meta Data"]["4. Interval"];
              tSeries = json["Time Series (" + interval + ")"];
          } else {
              tSeries = json[timeSeries.data_set_id_string];
          }
        const value = tSeries[Object.keys(tSeries)[0]]["4. close"];
        const totalValue = value * stock.amount;
        const history = tSeries;
        const stockWValues =  {
                ...stock,
                value,
                totalValue,
                interval,
                history
            }
        return stock.id === 0 ? dispatch(createStock(stockWValues)):dispatch(updateStock(stockWValues));
    } catch (e) {
        console.log(json);
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
    return dispatch(fetchCurrent(stock, portfolioId));
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

export const saveSettings = (settings, pId) => ({
    type:SAVE_SETTINGS,
    settings,
    pId
})