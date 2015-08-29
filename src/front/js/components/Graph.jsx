import React from 'react';
import data from '../../data/data.js';
import Grid from '../grid.js';
import Diff from '../diff.js';
import ZoomPane from './ZoomPane.jsx';

export default class Graph extends React.Component {
  constructor(...args) {
    super(...args);

    // create scales and axes
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient('bottom')
      .ticks(5);

    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient('left')
      .ticks(5)
      .tickFormat(d3.format('%'));

    // create zoom to be passed to ZoomPane component
    this.zoom = d3.behavior.zoom();
    this.series = Diff(this.xScale, this.yScale);
    this.grid = Grid(this.xScale, this.yScale, 10, 5);
  }

  componentDidMount() {
    // save references to all d3 selections
    this.plotArea = d3.select(React.findDOMNode(this.refs.plotArea));
    this.xNode = d3.select(React.findDOMNode(this.refs.x));
    this.yNode = d3.select(React.findDOMNode(this.refs.y));
    this.seriesNode = d3.select(React.findDOMNode(this.refs.series))
      .datum(data);

    this.xScale.domain([this.props.fromDate, this.props.toDate]);
    this.xScale.domain([this.xScale.invert(1 / 4), this.xScale.invert(1 - (1 / 4))]);
    this.xScale.range([0, this.props.width]);
    this.yScale.range([this.props.height, 0]);

    // set up initial zoom level
    this.zoom.scaleExtent([1, 50]).x(this.xScale);
    this.draw();
  }

  /**
   * draws the graph
   */
  draw() {
    this.seriesNode.call(this.series);
    this.xNode.call(this.xAxis);
    this.yNode.call(this.yAxis);
    this.plotArea.call(this.grid);
  }

  render() {
    return <g transform={`translate(${this.props.margin.left}, ${this.props.margin.top})`}>
      <g ref="plotArea" clipPath="url(#plotAreaClip)">
        <clippath id="plotAreaClip">
          <rect width={this.props.width} height={this.props.height}/>
        </clippath>
        <ZoomPane
          fromDate={this.props.fromDate}
          toDate={this.props.toDate}
          width={this.props.width}
          height={this.props.height}
          zoom={this.zoom}
          draw={this.draw.bind(this)}
          xScale={this.xScale}/>
        <g ref="series" className="series"/>
      </g>
      <g ref="x" className="x axis" transform={`translate(0, ${this.props.height})`}/>
      <g ref="y" className="y axis"/>
    </g>;
  }
}
