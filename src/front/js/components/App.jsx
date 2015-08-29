import React from 'react';
import Graph from './Graph.jsx';

const margin = {top: 20, right: 20, bottom: 30, left: 50};
const svgWidth = 680;
const svgHeight = 400;

const fromDate = new Date(2015, 1, 1);
const toDate = new Date(2015, 4, 1);

export default class extends React.Component {
  render() {
    return <svg
      className="chart"
      width={svgWidth}
      height={svgHeight}
    >
      <Graph
        fromDate={fromDate}
        toDate={toDate}
        height={svgHeight - margin.top - margin.bottom}
        width={svgWidth - margin.left - margin.right}
        margin={margin}/>
    </svg>;
  }
}
