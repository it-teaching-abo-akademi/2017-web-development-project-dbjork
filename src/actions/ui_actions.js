/* These are the actions that are strictly ui-centered
 * Author Dan Björkgren 2017
 * TODO: Consider moving some of the more ui-related actions from data_actions here
 */



/* Available pages (e.g. modal windows) goes here */
export const pages = {
    SHOW_PORTFOLIOS: 'SHOW_PORTFOLIOS',
    SHOW_ASK_P_NAME: 'SHOW_ASK_FOR_PORTFOLIO_NAME',
    SHOW_ASK_T_NAME: 'SHOW_ASK_FOR_TICKER_NAME',
    SHOW_HISTORY: 'SHOW_HISTORY',
    SHOW_SETTINGS: 'SHOW_SETTINGS'
};

/* Action constants */
export const SET_VISIBLE_PAGE='SET_VISIBLE_PAGE';
export const SAVE_STOCK_GRAPH_SELECTION = 'SAVE_STOCK_GRAPH_SELECTION';


/* Simple actions */
export const showPage = (newPage, id=0) => {
    return {
        type: SET_VISIBLE_PAGE,
        newPage,
        id
    };
};

export const saveStockSelection = (selection, pId) =>{
    return {
        type: SAVE_STOCK_GRAPH_SELECTION,
        selection,
        pId
    }
}

