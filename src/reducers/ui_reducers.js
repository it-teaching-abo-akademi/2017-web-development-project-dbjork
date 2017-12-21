/* Redux standard style reducers that only handles ui state changes
 * Separated from the data reducers to keep a decent state tree
 * atm only handles displaying modal "windows" and selecting
 * what stocks to show in the line chart. These are NOT saved between sessions. */

import {pages, SAVE_STOCK_GRAPH_SELECTION, SET_VISIBLE_PAGE} from "../actions/ui_actions";

const initalState = {
    visiblePage: pages.SHOW_PORTFOLIOS,
    portfolios: []
}

function spmsApp(state = initalState, action){
    switch (action.type) {
        case SET_VISIBLE_PAGE:
            return Object.assign({}, state, { visiblePage: action.newPage, requester:action.id})
        case SAVE_STOCK_GRAPH_SELECTION:
            const portfolio = state.portfolios.find((p)=>{ return p.id===action.pId; });
            return portfolio?{
                ...state,
                portfolios:state.portfolios.map((p)=> { // find the right portfolio if it exists
                        if (p.id === action.pId) {//Replace the chart selection
                            return Object.assign({}, {...p, graphSelection: action.selection});
                        }
                        return p;
                    })
            }:{ //Otherwise create a new portfolio and attach the selection.
                ...state,
                portfolios:[
                    ...state.portfolios,
                    {
                        id:action.pId,
                        graphSelection:action.selection
                    }
                ]
            }
        default:
            return state;
    }
}

export default spmsApp;