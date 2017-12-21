# Stock Portfolio Management System.

Created by Dan Björkgren as final project for the course *Development of Interactive Web Applications*,
Åbo Akademi University fall 2017.

Live demo: https://it-teaching-abo-akademi.github.io/2017-web-development-project-dbjork/

A react app that lets users handle stock portfolios. (No trading included)

Features:
- Add up to 10 portfolios
- Delete unwanted portfolio
- Add up to 50 stock symbols (tickers) per portfolio 
  *(note: limit not implemented yet)*
- Delete any unwanted stock from portfolio
- Shows current per stock value for each stock (depending on update frequency, defaults to hourly and can be changed in settings)
- Shows total value for each stock
- Shows total value for the portfolio
- Settings per portfolio:
    1. Update frequency (for fetching current value)
        *(note: automatic refresh not implemented yet)*
    2. Currency (display values in USD or €)
- Display line chart showing a valuation graph of all (or selected) stocks in a portfolio.
- Settings for chart window:
    1. Restrict the chart to the time period of choice
    2. Select daily, weekly or monthly data points
    3. Select stocks to be included in the chart
- Portfolios including their stock base data is automatically saved on your computer between sessions


"Requested" features not implemented yet
- There is currently no way to refresh the stock value other than reloading the page
    - Manual refresh by means of a button
    - Automatic timed refresh
- Limit number of stocks to 50 per portfolio.
- Block creation of more than one copy of a stock
    - Actually, provide a means to change amount
    - Workaround: it is possible to delete a stock and re-add it with another amount
- Credits page, lists libraries and resources used in the project
- Sort a stock list on symbol, value and selection

Known flaws and compromises
- Error handling is rudimentary at best.
- Alphavantage API response is not clear in case of errors, not much to do about that
   - As a consequence there is now certain way of validating a stock symbol, a different API would have to be used
- The chosen date picker component is actually not to my liking
- The chosen chart component has limits (or perhaps hidden functionality) regarding the layout. 
Getting the chart window to display properly e.g. on small devices will require more work

Know bugs:



Bear in mind that this is my first React project, it will reflect my current
understanding of how react and redux are supposed to work. 