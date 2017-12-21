/* "Modal" popup showing a line chart comparison of stock value development
 * Features: Select lines (stocks) to be included in the chart,
 * Freely adjustable time period and data frequency.
 *
 * Author: Dan Björkgren 2017
 * Uses moment.js for the dates, rechart library for the chart and react-datepicker for choosing dates
 * TODO: Fix ui design, especially on small devices. Bend the chart to its limits...
 * TODO: Props type checking
 * TODO: Find a better date picker
 *
 * */
import React, {Component} from 'react';
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import '../modalpopup.css';
import './graphpopup.css';
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import randomColor from 'randomcolor';
import  DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {fetchAllHistory, saveSettings, TIME_SERIES} from "../../actions/data_actions";
import loading from '../../resources/loading.svg';
import "moment/locale/sv.js";
import "moment/locale/fi.js";
import "moment/locale/fr.js";
import "moment/locale/en-ie.js";
import {saveStockSelection} from "../../actions/ui_actions";

//Uses moment.js for handling dates
var moment=require('moment');


/* Class to rotate the graph x-axis date labels 90° */
class CustomizedAxisTick extends Component {
    render () {
        const {x, y, stroke, payload} = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text style={{fontSize:"60%"}} x={0} y={0} dy={3} textAnchor="end" fill="#666" transform="rotate(-90)">{payload.value}</text>
            </g>
        );
    }
}

/* Modal dialog displaying a line diagram showing
 * value development for each stock over time.
 *
 */
class GraphPopupComponent extends Component {
    constructor(props){
        super(props);
        /* For the date picker to work we need to have a local state
         * Somehow using the global redux state will prevent
         * selecting dates at all. Must be a way around it but
         * according to bug reports to the project this is the way to
         * go. Don't like it but I don't have time to go researching different
         * date pickers, the all seem to have their own quirks.
         */
        this.state={
            startDate:props.settings.historyStart,
            endDate:props.settings.historyEnd
        };

        //Ensure "this" is available in these functions
        this.changeSettings = this.changeSettings.bind(this);
        this.onStartChange = this.onStartChange.bind(this);
        this.onEndChange= this.onEndChange.bind(this);
        this.onFrequencyChange= this.onFrequencyChange.bind(this);
        this.getRenderData=this.getRenderData.bind(this);
        this.getStockSelection= this.getStockSelection.bind(this);
        this.handleStockSelection=this.handleStockSelection.bind(this);

        /* Fetch history if it doesn't exist
        *  (it is not saved in local storage) Could, and should probably, be moved upward in
        *  the hierarchy e.g. immediately when loading from local storage, since it will be
        *  performed upon rendering the portfolio in any case */
        const hasHistory=props.stocks.every((s)=> {return Object.keys(s.history).length>0});
        if (!hasHistory){
            this.fetchHistoryForAll();
        }
        if (!props.stockSelection){
            this.getStockSelection();
        }

    }

    render() {

        if (!this.props.show){//Nothing to do if show is false.
            return null;
        }

        // The modal "window"
        // inline styles
        const lIconStyle = {
            position:"absolute",
            height:"7em",
            top:"42%",
            left:"42%",
            display:this.props.loading?"flex":"none", //Show only when fetching data.
            zIndex:"120"
        };
        const modalStyle = {
            position:"relative",
            maxWidth: this.props.maxWidth,
            minHeight: this.props.minHeight,
        };
        const contentsStyle = {
            width:"95vh",
            maxWidth:"95%"
        };
        const headerStyle= {
            flexGrow:1
        };

        const data=this.getRenderData();
        // Generate random colors
        // This could be enhanced to stick
        // a certain color to each stock and not generate them
        // every time the component renders.
        const colors = randomColor(
            {
                count:this.props.stocks.length,
                luminocity:"dark"
            });

        // Create the lines for the graph
        let i=0;
        const lines = this.props.stocks.map((s) => {
            return <Line dataKey={s.symbol} key={this.props.pId+s.symbol } stroke={colors[i++]} dot={false}/>
        });

        // check the stock checkboxes, defaults to all checked when app is reloaded
        const checkBoxes = this.getStockSelection().map((s)=>{
            return (<div className={"hflex"} style={{flexWrap:"nowrap"}} key={this.props.pId+s.symbol}>
                    <input type={"checkbox"} id={s.symbol} checked={s.selected} onClick={this.handleStockSelection}/>
                    <label htmlFor={s.symbol}>{s.symbol}</label>
                </div>
            )
        });
        // format the dates to some format the user is familiar with
        let language = navigator.language;
        moment.locale(language);
        console.log(language);
        return (
            <div>
                <div className='backdrop'>
                    <div className='modal' style={modalStyle}>
                        <div className='hflex'>
                            <div style={headerStyle}>{"Graph"}</div>
                            <div className='close-btn'  onClick={this.props.onCancel}>X</div>
                        </div>
                        {/* Spinning wheel while loading */}
                        <img src={loading} style={lIconStyle} className="vcenter load-icon"  alt="Updating..." />
                        <div>
                            <div style={contentsStyle}>
                                <div className={"hflex graph-container vcenter"}>
                                    {/* This is the chart component aspect is the height/width ratio */}
                                    <ResponsiveContainer aspect={1.5}>
                                        <LineChart data={data}>
                                            <XAxis dataKey={"name"} tick={<CustomizedAxisTick/>} height={100} tickCount={15} style={{fontSize:"70%"}}/>
                                            <YAxis/>
                                            <CartesianGrid stroke={"#89f"} strokeDasharray={"3 5"} />
                                            {lines}
                                            <Tooltip/>
                                            <Legend/>
                                        </LineChart>
                                    </ResponsiveContainer>
                                    <div className={"vflex stock-selector vcenter"}>
                                        {checkBoxes}
                                    </div>
                                </div>
                            </div>
                            <div className="button-row hflex" >
                                <div>
                                    <p>Select data type (adjusted)</p>
                                    <select onChange={this.onFrequencyChange} defaultValue={this.props.settings.historyFrequency}>
                                        <option value={TIME_SERIES.TS_DAILY}>Daily</option>
                                        <option value={TIME_SERIES.TS_WEEKLY}>Weekly</option>
                                        <option  value={TIME_SERIES.TS_MONTHLY}>Monthly</option>
                                    </select>
                                </div>
                                <div className={"hflex"}>
                                    <p>Period:</p>
                                    {/* Date pickers, probably not the best library around... */}
                                    <div className={"picker-field hflex"}>
                                        <div className={"hflex"}>From<DatePicker selected={moment(this.state.startDate)} onChange={this.onStartChange} maxDate={moment()} showYearDropdown={true}/></div>
                                        <div className={"hflex"}>to<DatePicker selected={this.state.endDate} onChange={this.onEndChange} maxDate={moment()} showYearDropdown={true}/></div>
                                    </div>
                                </div>
                                <button onClick={this.props.onCancel}>{"Close"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    /* Triggered when a stock checkbox is checked or unchecked.
       toggles the state that the checkbox depends on.
     */
    handleStockSelection(e){
        const oldSelection = this.getStockSelection();
        this.props.saveStockSelection(
            oldSelection.map((s)=>{
                if (s.symbol===e.target.id){
                    return {...s,selected:!s.selected};
                } else {
                    return s;
                }
            }));
    }


    getRenderData() {

        /* Format the history data to fit the chart component.
         * Each stock has a history property, an object with props corresponding
         * to each stock's historical value. This is reorganized into an array of the following format:
         * [ {name:'2017-12-19', stock1:123.45, stock2:543.21},{...] */
        //const stockNames = this.getStockNames();
        const _this = this; //needs to access props inside reduce=>forEach
        const stockSelection = this.getStockSelection();
        const data = Object.keys(this.props.stocks[0].history).reduce((newArray, name) => {
            let dataPoint = {
                name
            };
            //
            const thisTime = moment(name);
            //Filter: only include datapoints between from and to dates
            if (thisTime.isSameOrBefore(_this.props.settings.historyEnd) && thisTime.isSameOrAfter(_this.props.settings.historyStart)) {
                stockSelection.forEach((k, i) => {
                    if (k.selected){

                        dataPoint[k.symbol] = _this.props.stocks[i]["history"][name] && parseFloat(_this.props.stocks[i]["history"][name]["4. close"]);
                    }
                });
                newArray.push(dataPoint);
            }
            return newArray;
        },[]).reverse(); //The datapoints are in reverse order
        return data;
    }

    /*   Initializes the checkbox data (for selecting stocks to be displayed)
         This is not a good solution, should be in an action that runs prior to creating
         this component.
     */
    getStockSelection() {
        if (this.props.stockSelection && this.props.stockSelection.length===this.props.stocks.length)
            return this.props.stockSelection;
        else {
            const initialState = this.getStockNames().map((symbol) => {
                    return {
                        symbol,
                        selected: true
                    }
                }
            );
            return this.props.saveStockSelection(initialState);
        }
    }

    /* An array of stock symbols is needed in several other functions,
     * convenience method.
     */
    getStockNames() {
        const stockNames = this.props.stocks.reduce((newArr, stock) => {
            newArr.push(stock.symbol);
            return newArr;
        }, []);
        return stockNames;
    }

    /* Checks if the requested time period will need
     * the long response format.
     */
    isLongFormat(start,end, frequency){
        const duration  = moment.duration(end.diff(start));
        switch (parseInt(frequency)) {
            case TIME_SERIES.TS_DAILY:
                return duration.asDays()>100;
            case TIME_SERIES.TS_WEEKLY:
                return duration.asWeeks()>100;
            case TIME_SERIES.TS_MONTHLY:
                return duration.asMonths()>100;
            default:
                return false;
        }
    }
    /* Creates a status object to dispatch to redux */
    changeSettings(newStatus){
        const status = Object.assign({}, this.props.settings,newStatus);
        this.props.updateSettings(status);
    }

    /* Triggered when start date is changed */
    onStartChange(historyStart) {
        this.setState({startDate:historyStart});
        const isLongFormat = this.isLongFormat(historyStart,this.state.endDate, this.props.settings.historyFrequency);
        this.changeSettings({historyStart, isLongFormat});
        this.fetchHistoryForAll();
    }
    /* Triggered when end date is changed */
    onEndChange(historyEnd){
        this.setState({endDate:historyEnd});
        const isLongFormat = this.isLongFormat(this.state.startDate, historyEnd, this.props.settings.historyFrequency);
        this.changeSettings({historyEnd, isLongFormat});
        this.fetchHistoryForAll();
    }
    /* Triggered when a new item is selected in the dropdown */
    onFrequencyChange(e){
        const lf = this.isLongFormat(this.state.startDate, this.state.endDate,e.target.value);
        this.changeSettings({historyFrequency:e.target.value, isLongFormat:lf});
        this.fetchHistoryForAll();
    }
    /* triggered whenever something is changed, dates or frequency */
    fetchHistoryForAll(){
        this.props.fetchHistoryForAll(this.props.stocks);
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateSettings: (settings)=>{dispatch(saveSettings(settings, ownProps.pId))},
        saveStockSelection: (selection) => {dispatch(saveStockSelection(selection, ownProps.pId))},
        fetchHistoryForAll: (stockList) => {dispatch(fetchAllHistory(stockList, ownProps.pId))}
    }
}

const mapStateToProps = (state, ownProps) => {
    if (!(state.dataReducers.current)) return { loading:false };
    const portfolio=state.dataReducers.portfolio.portfolios.find((p)=>{return p.id===ownProps.pId})
    const ui_portfolio=state.uiReducers.portfolios.find((p)=>{return p.id===ownProps.pId})
    return {
        loading: state.dataReducers.current.isFetching>0,
        settings:portfolio.settings,
        stockSelection:ui_portfolio && ui_portfolio.graphSelection
    }
};
const GraphPopup = connect(
    mapStateToProps,
    mapDispatchToProps
)(GraphPopupComponent);

GraphPopup.propTypes = {};
GraphPopup.defaultProps = {};

export default GraphPopup;
