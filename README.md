# Stock Portfolio Management System.

Created by Dan Björkgren as final project for the course *Development of Interactive Web Applications*,
Åbo Akademi University fall 2017.

Live demo: https://it-teaching-abo-akademi.github.io/2017-web-development-project-dbjork/

A react app that lets users handle stock portfolios. (No trading included)

Features:
- Add up to 10 portfolios
- Delete unwanted portfolio
- Add up to 50 stock symbols (tickers) per portfolio 
- Delete any unwanted stock from portfolio
- Shows current per stock value for each stock, with automatic updates 
(depending on update frequency, defaults to hourly and can be changed in settings)
- Shows total value for each stock
- Shows total value for the portfolio
- Sort to your liking
- Settings per portfolio:
    1. Update frequency (for fetching current value)
    2. Currency (display values in USD or €)
- Display line chart showing a valuation graph of all (or selected) stocks in a portfolio.
- Settings for chart window:
    1. Restrict the chart to the time period of choice
    2. Select daily, weekly or monthly data points
    3. Select stocks to be included in the chart
- Portfolios including their stock base data is automatically saved on your computer between sessions


"Requested" features not implemented yet
- A way to change the quantity for a stock item.
    - Workaround: Delete the stock and re-add it with another amount

Known flaws and compromises
- Error handling is a bit rudimentary.
- Alphavantage API response is not clear in case of errors, not much to do about that
   - As a consequence there is no certain way of validating a stock symbol, a different API would have to be used for that
- The chosen date picker component is actually not to my liking
- The chosen chart component has limits (or perhaps hidden functionality) regarding the layout. 
Getting the chart window to display properly e.g. on small devices will require more work


Bear in mind that this is my first React project, it will reflect my current
understanding of how react and redux are supposed to work. 
