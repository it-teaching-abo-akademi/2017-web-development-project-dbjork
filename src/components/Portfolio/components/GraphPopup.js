import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../modalpopup.css'
import { LineChart, XAxis, YAxis, CartesianGrid, Line, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import randomColor from 'randomcolor';

class CustomizedAxisTick extends Component {
    render () {
        const {x, y, stroke, payload} = this.props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text style={{fontSize:"60%"}} x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-25)">{payload.value}</text>
            </g>
        );
    }
}

class GraphPopup extends Component {
    render() {

        if (!this.props.show){
            return null;
        }

        // The modal "window"
        const modalStyle = {
            position:"relative",
            maxWidth: this.props.maxWidth,
            minHeight: this.props.minHeight,
        };
        const contentsStyle = {
            width:"95vh",
            maxWidth:"95%"
        }
        const headerStyle= {
            flexGrow:1
        }
        const fieldStyle = {
            padding:6,
            margin:4
        }
        const stockNames = this.props.stocks.reduce((newArr, stock) => {
            newArr.push(stock.symbol);
            return newArr;
        },[]);
        const data = Object.keys(this.props.stocks[0].history).reduce((newArray, name) => {
            let dataPoint = {
                name,
            };
            stockNames.forEach((k,i) => {
                dataPoint[k] = parseFloat(this.props.stocks[i]["history"][name]["4. close"]);
            });
            newArray.push(dataPoint);
            return newArray;
        },[]).reverse();
        const graphWidth = data.length*10;
        const colors = randomColor(
            {
                count:this.props.stocks.length,
                luminocity:"dark"
            });
        let i=0;
        const lines = this.props.stocks.map((s) => {
            return <Line dataKey={s.symbol} stroke={colors[i++]} dot={false}/>
        });
        return (
            <div>
                <div className='backdrop'>
                    <div className='modal' style={modalStyle}>
                        <div className='hflex'>
                            <div style={headerStyle}>{"Graph"}</div>
                            <div className='close-btn'  onClick={this.props.onCancel}>X</div>
                        </div>
                        <div>
                            <div style={contentsStyle}>
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
                            </div>
                            <div className="button-row hflex" >
                                <button onClick={this.props.onCancel}>{"Close"}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GraphPopup.propTypes = {};
GraphPopup.defaultProps = {};

export default GraphPopup;
