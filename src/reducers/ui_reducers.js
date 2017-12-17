import {pages, SET_VISIBLE_PAGE} from "../actions/ui_actions";
import {CURRENCY_CHANGED} from "../actions";

const initalState = {
    visiblePage: pages.SHOW_PORTFOLIOS,
    portfolios: []
}

function spmsApp(state = initalState, action){
    switch (action.type) {
        case SET_VISIBLE_PAGE:
            return Object.assign({}, state, { visiblePage: action.newPage, requester:action.id})
        default:
            return state;

    }
}

export default spmsApp;