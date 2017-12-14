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


const loggerMiddleware = createLogger();

const loadState = () => {
    try {
        const oldState = localStorage.getItem(STORE_KEY);
        if (!(oldState)) {
            return undefined;
        }
        return JSON.parse(oldState);
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
