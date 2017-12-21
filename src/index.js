/* "Landing page" javascript.
 *
 * Author: Dan Björkgren 40072, 2017
 *
 * Loads previously stored state from local storage on app startup
 * and saves it whenever changed
 * Uses redux to simplify handling of state and thunk middleware for asynchronous calls
 * redux-logger is only used for debugging.
 * Uses */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reducer from './reducers';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
const STORE_KEY = 'smpsState';
export const VERSION_STRING = "0.0.2";

/*
 Used for debugging, displays pre-action state, action and post-action
 state for each dispatched action in the console.
*/
const loggerMiddleware = createLogger();

const loadState = () => { //Read a previously stored state from local storage,
                          // Returning undefined will let the reducers create a new state.
    try {
        const jsonParser = require('moment-json-parser'); //Allows for parsing moment objects from JSON
        const oldState = localStorage.getItem(STORE_KEY);
        if (!oldState) { //No previous state, let the reducers create a new
            return undefined;
        }
        const stateObj= jsonParser(oldState);
        if (!stateObj.dataReducers.version || stateObj.dataReducers.version !== VERSION_STRING) {
            alert("The format for storing your portfolios has changed. \nUnfortunately this means we can not" +
                " read the stored portfolios back into the application. \nIf you by happenstance have chosen" +
                " to rely on this application for your real world managing of stock portfolios please send" +
                " me a note and I will do my best to avoid this inconvenience in the future.");
            return undefined;

        }
        return stateObj;
    } catch (err) {
        return undefined;
    }



}

const store = createStore(
    reducer,
    loadState(),
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)

const saveState = (state) => {

    try {
        const saveableState = { //We do not save all of the state, only the portfolio portion, without value data
            dataReducers: {
                version: VERSION_STRING,
                portfolio: {
                    ...state.dataReducers.portfolio,
                    portfolios: state.dataReducers.portfolio.portfolios.map((portfolio) => {
                        return {
                            ...portfolio,
                            stocks: portfolio.stocks.map((stock) => {
                                return {
                                    ...stock,
                                    value: 0,
                                    totalValue: 0,
                                    history: []
                                }
                            })
                        }
                    })
                }
            }
        }
        const jsonState = JSON.stringify(saveableState);
        localStorage.setItem(STORE_KEY, jsonState);
    } catch (err) { console.log(err)}
};

store.subscribe(() => { // Store the state whenever changed
    saveState(store.getState());
})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
