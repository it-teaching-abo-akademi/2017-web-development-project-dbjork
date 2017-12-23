/* Redux actions that are called when the app requests a state change
 * These are mainly pure data retrieval functions along with create/delete
 * functions. (There are some stray ones that on closer inspection probably
 * would fit better in the ui-actions file)
 * Author: Dan Björkgren 2017
 * TODO: consider moving some of the more ui-related actions to ui_actions
 */

export * from './ui_actions';
export const REQUEST_CURRENT= 'REQUEST_CURRENT';
export const REQUEST_HISTORY= 'REQUEST_HISTORY';
export const REQUEST_CURRENCY = 'REQUEST_CURRENCY';
export const CHECK_SYMBOL= 'CHECK_SYMBOL'; // This is not used in practice, there is no api function
                                            // to reliably check if a stock symbol (ticker) is valid.
export const RECEIVE_CURRENT = 'RECEIVE_CURRENT';
export const RECEIVE_HISTORY = 'RECEIVE_HISTORY';
export const RECEIVE_CURRENCY = 'RECEIVE_CURRENCY';
export const CREATE_PORTFOLIO = 'CREATE_PORTFOLIO';
export const DELETE_PORTFOLIO = 'DELETE_PORTFOLIO';
export const CREATE_STOCK = 'CREATE_STOCK';
export const DELETE_STOCK = 'DELETE_STOCK';
export const UPDATE_STOCK = 'UPDATE_STOCK';
export const UPDATE_HISTORY = 'UPDATE_HISTORY';
export const CURRENCY_CHANGED='CURRENCY_CHANGED';
export const SELECT_STOCK = 'SELECT_STOCK';
export const RECEIVE_ERROR = 'RECEIVE_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const CLEAR_JSON_ERRORS = 'CLEAR_JSON_ERRORS';
export const CHANGE_RATE_USD_TO_EUR = 'CHANGE_RATE_USD_TO_EUR';
export const SAVE_SETTINGS = 'SAVE_SETTINGS';

// This is the api key used to access the Alphavantage API.
// Probably should be hidden away somewhere else...
const API_KEY='D1XU3PX9Y03RG502';

/* Maps the API functions to time durations
 * in milliseconds. Needed to calculate if
 * the commpact format is sufficient and to
 * periodically fetch new intraday data. */
export const TIME_SERIES = {
    TS_INTRADAY_1:60000,
    60000: {
        function: "TIME_SERIES_INTRADAY",
        interval: "1min"
    },
    TS_INTRADAY_5:300000,
    300000: {
        function: "TIME_SERIES_INTRADAY",
        interval: "5min"
    },
    TS_INTRADAY_15:900000,
    900000: {
        function: "TIME_SERIES_INTRADAY",
        interval: "15min"
    },
    TS_INTRADAY_30: 1800000,
    1800000: {
        function: "TIME_SERIES_INTRADAY",
        interval: "30min"
    },
    TS_INTRADAY_60:3600000,
    3600000: {
        function: "TIME_SERIES_INTRADAY",
        interval: "60min"
    },
    TS_DAILY:86400000,
    86400000: {
        function: "TIME_SERIES_DAILY_ADJUSTED",
        data_set_id_string:"Time Series (Daily)"
    },
    TS_WEEKLY:604800000,
    604800000: {
        function: "TIME_SERIES_WEEKLY_ADJUSTED",
        data_set_id_string:"Weekly Adjusted Time Series"
    },
    TS_MONTHLY:2629822966,
    2629822966: {
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

export const requestHistory = stock => ({
    type: REQUEST_HISTORY,
    stock,
    requester:stock.portfolioId
});

export const requestCurrent = stock => ({
    type: REQUEST_CURRENT,
    stock,
    requester:stock.portfolioId
});

export const requestCurrency= () =>  {
    return {
        type: REQUEST_CURRENCY
    }
}

/* convenience functions to request data for an array of stocks */
export const fetchAllCurrent = (stocks, pId) => dispatch => {
    return Promise.all(
       stocks.map((s)=>{
           return dispatch(fetchCurrent(s,pId));
       })
    )
}
export const fetchAllHistory = (stocks, pId) => dispatch =>{
    return Promise.all(
        stocks.map((s) => {
            return dispatch(fetchHistory(s,pId));
        })
    )
}

/* Fetches current value (actually 100 but receiveCurrent will only grab the latest)
 * from the Alphavantage API
*  Restricted to intra-day functions. */
export const fetchCurrent = (stock, pId) => (dispatch, getState) => {
    dispatch (requestCurrent(stock));
    const s = getState().dataReducers;
    const ts = s.portfolio.portfolios.find(function (p){
        return p.id===pId
    }).settings.frequency;
    const func=TIME_SERIES[ts].function;
    // There should actually always be an interval here, maybe throw error if not?
    const interval = TIME_SERIES[ts].interval?"interval="+TIME_SERIES[ts].interval+"&":""
    return fetch(`https://www.alphavantage.co/query?function=${func}&symbol=${stock.symbol}&${interval}apikey=${API_KEY}`)
        .then(response => {
            if (!response.ok) { //404 and the like, this has not been tested, never triggered.
                debugger;
                throw response;
            }
            if (response.status!==200){
                debugger;
            }
            return response;
        })
        .then(response => response.json()) //Grab the json data
        .then(json=>dispatch(receiveCurrent(stock,json, TIME_SERIES[ts])))
        .then((action)=>dispatch(currentReceived(action.stock))).catch((reason)=>{
           dispatch(serverError(reason, REQUEST_CURRENT)); // Make sure this is handled.
           console.log(reason);
        })
};

/* Retrieves the history for one stock, restricted to
 * non-intra-day functions. Result will be parsed and put in
 * the history field of the stock */
export const fetchHistory = (stock, pId) => (dispatch, getState) => {
    dispatch (requestHistory(stock))
    const s = getState().dataReducers
    const settings = s.portfolio.portfolios.find(function (p){
        return p.id===pId
    }).settings
    const ts= settings.historyFrequency
    const func=TIME_SERIES[ts].function
    // There should never be an interval on these calls, maybe throw an error?
    const interval = TIME_SERIES[ts].interval?"interval="+TIME_SERIES[ts].interval+"&":""
    const format = settings.isLongFormat?"&outputsize=full&":""
    return fetch(`https://www.alphavantage.co/query?function=${func}&symbol=${stock.symbol}&${interval}${format}apikey=${API_KEY}`)
        .then(response => {
            if (!response.ok) {
                debugger;
                throw response;
            }
            if (response.status!==200){
                debugger;
            }
            return response;
        })
        .then(response => response.json())
        .then(json=>dispatch(receiveHistory(stock,json, TIME_SERIES[ts])))
        .then((stock)=>dispatch(historyReceived(stock))).catch((reason)=>{
            console.log(reason);
            dispatch(serverError(reason, REQUEST_HISTORY))
        })
};

/* Fetch the $/€ ratio (requirements only state Euro/USD, KISS) */
export const fetchCurrency = (pId, newCurrency, fetchNew) => dispatch => {
    dispatch (changeCurrency(pId, newCurrency))
    if (!(fetchNew)) return null
    dispatch (requestCurrency())
    return fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=EUR&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(json=>dispatch(receiveCurrency(json)))
        .then((rate)=>dispatch(currencyReceived(rate)))
}

/* Following are plain actions to set the loading flag */
export const currentReceived = (stock) => (
    {
        type: RECEIVE_CURRENT,
        pId: stock.id,
        requester:stock.portfolioId,
        receivedAt: Date.now()
    });

export const historyReceived = (stock) => {
    return {
        type:RECEIVE_HISTORY,
        stock,
        requester:stock.portfolioId,
        receivedAt: Date.now()
    }
};
export const currencyReceived = (rate) => {
    return {
        type:RECEIVE_CURRENCY,
        rate,
        receivedAt: Date.now()
    }
};

export const internalError = (error, requestType, requester) => dispatch => {
    return dispatch({
        type:RECEIVE_ERROR,
        requestType,
        requester,
        errorMessage:"User error",
        detailMessage:error.message,
        source:""
    })
}
/* Error handlers, will trigger an alert message in the ui */
export const serverError = (response, requestType, requester) => dispatch => {
    return dispatch({
        type: RECEIVE_ERROR,
        requestType,
        requester,
        errorMessage:"Server error",
        detailMessage:response.message,
        source:""
    })
};

export const jsonError = (stock, json, requestType) => dispatch=> {
    return dispatch ({
        type: RECEIVE_ERROR,
        requestType,
        stock,
        requester:stock.portfolioId,
        errorMessage: "Unable to extract stock data from response",
        detailMessage: "Possible cause: " + stock.symbol + " is not a valid stock ticker",
        source:json
    })
};
export const clearError = () => {
    return { type: CLEAR_ERROR };
};
export const clearJSONErrors = () => {
    return {type: CLEAR_JSON_ERRORS};
}

/* Parse the JSON data */
export const receiveHistory = (stock, json, timeSeries) => dispatch => {
    try {
        const history = json[timeSeries.data_set_id_string];
        const stockWHistory =  { // Attach history to the stock
            ...stock,
            history
        }
        dispatch(updateHistory(stockWHistory));
        return stock
    } catch (e) {
        debugger;
        console.log(json);
        return dispatch(jsonError(stock,json, REQUEST_HISTORY))
    }
};

export const receiveCurrent = (stock, json, timeSeries) => dispatch => {
    try {
        /* These json accessors should maybe be constants, on the other hand
           this is the only place they are referenced.
         */
        const interval = json["Meta Data"]["4. Interval"];
        const tSeries = json["Time Series (" + interval + ")"];
        const value = tSeries[Object.keys(tSeries)[0]]["4. close"];
        const totalValue = value * stock.amount; //Should probably be moved to the render function of StockRow
        const stockWValues =  {  // Attach the values to the stock
            ...stock,
            value,
            totalValue,
            interval
        }
        // A fresh stock outside the state, will have an id of 0. If so create it
        // (which will fetch the current value) then immediately fetch its history.
        // If it already belongs to state update it instead.
        return stock.id === 0 ? dispatch(createStock(stockWValues)).then((action) =>  dispatch(fetchHistory(action.stock,action.stock.portfolioId))):dispatch(updateStock(stockWValues));

    } catch (e) {
        // The fine API returns a valid json response even if the ticker is invalid :(
        // The best we are able to do is to catch it here and give a reasonable explanation.
        debugger;
        console.log(json);
        return dispatch(jsonError(stock,json, REQUEST_CURRENT))
    }
};

export const receiveCurrency = (json) => dispatch =>{
    try {
        const rate = parseFloat(json["Realtime Currency Exchange Rate"]["5. Exchange Rate"]);
        return {
            type: CHANGE_RATE_USD_TO_EUR,
            rate
        }
    } catch (error) {
        console.log(json);
        return dispatch(jsonError({symbol:"EUR"},json,CHANGE_RATE_USD_TO_EUR));
    }
}

/* Simple actions */
export const updateStock = (stock) => {
    return { type:UPDATE_STOCK, stock };
}
export const updateHistory = (stock) => {
    return { type: UPDATE_HISTORY, stock};
}

export const createPortfolio = (name) => dispatch => {
    if (!name || name===""){
        dispatch(internalError(new Error("Please provide a name for the portfolio"),CREATE_PORTFOLIO, 0));
        return false;
    }
    return {
    type: CREATE_PORTFOLIO,
    name
}};
export const deletePortfolio = (id) => ({
    type: DELETE_PORTFOLIO,
    id
})

//Convenience function to check if a value is numeric
export const isNumeric = (n) => { return !isNaN(parseFloat(n)) && isFinite(n); }

/* Create a new stock stub and dispatch for fetching data */
export const addStock = (portfolioId, symbol, amount) => (dispatch) => {
    const stock={
        id:0,
        portfolioId,
        symbol,
        amount,
        value: 0,
        totalValue:0,
        history:[]
    };
    if (!isNumeric(amount)) {
        dispatch(internalError(new Error("You must provide a numeric quantity of stock"), CREATE_STOCK, portfolioId));
        return false;
    }
    if ((typeof symbol) !== "string" || symbol.length===0 || symbol.length>5) {

        dispatch(internalError(new Error("You have given a malformed symbol. It must be at least one character and at most five characters long"),CREATE_STOCK,portfolioId));
        return false;
    }
    return dispatch(fetchCurrent(stock, portfolioId));
};

export const deleteSelectedStock = (portfolioId) => {
    return {
        type:DELETE_STOCK,
        portfolioId
    }
}

/* This should probably go on the ui-side instead */
export const selectStock = (portfolioId, stockId, selected) => {
    return {
        type:SELECT_STOCK,
        portfolioId,
        stockId,
        selected
    }
}
/* Return a promise so we can fetch the history immediately after creation */
export const createStock = (stock) => dispatch => (
     new Promise((resolve, reject) => {
        resolve(dispatch({
            type: CREATE_STOCK,
            stock
        }));
    }));
;

export const saveSettings = (settings, pId) => ({
    type:SAVE_SETTINGS,
    settings,
    pId
})