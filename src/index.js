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
export const VERSION_STRING = "0.0.1";


const loggerMiddleware = createLogger();

const loadState = () => {
    try {
        const oldState = localStorage.getItem(STORE_KEY);
        if (!(oldState)) {
            return undefined;
        }
        const stateObj= JSON.parse(oldState);
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
        const saveableState = {
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

store.subscribe(() => {
    saveState(store.getState());
})

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));
registerServiceWorker();
