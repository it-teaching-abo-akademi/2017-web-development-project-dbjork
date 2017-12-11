export const pages = {
    SHOW_PORTFOLIOS: 'SHOW_PORTFOLIOS',
    SHOW_ASK_P_NAME: 'SHOW_ASK_FOR_PORTFOLIO_NAME',
    SHOW_ASK_T_NAME: 'SHOW_ASK_FOR_TICKER_NAME',
    SHOW_HISTORY: 'SHOW_HISTORY'
};
export const SET_VISIBLE_PAGE='SET_VISIBLE_PAGE';

export const showPage = (newPage, id=0) => {
    return {
        type: SET_VISIBLE_PAGE,
        newPage,
        id
    };
};
