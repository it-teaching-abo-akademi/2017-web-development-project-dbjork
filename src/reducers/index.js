import { combineReducers } from 'redux';
import dataReducers from './data_reducers';
import uiReducers from './ui_reducers';

const rootReducer = combineReducers ({
    dataReducers,
    uiReducers
})

export default rootReducer;