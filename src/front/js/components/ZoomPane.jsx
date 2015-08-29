import React from 'react';
import d3 from 'd3';

export default class ZoomPane extends React.Component {
  constructor(...args) {
    super(...args);
    this.props.zoom.on('zoom', this.zoomed.bind(this));
  }
  componentDidMount() {
    d3.select(React.findDOMNode(this))
      .call(this.props.zoom);
  }

  zoomed() {
    const xDomain = this.props.xScale.domain();
    const xRange = this.props.xScale.range();
    let t = this.props.zoom.translate()[0];
    if (xDomain[0] < this.props.fromDate) {
      t = t - this.props.xScale(this.props.fromDate) + xRange[0];
    } else if (xDomain[1] > this.props.toDate) {
      t = t - this.props.xScale(this.props.toDate) + xRange[1];
    }
    this.props.zoom.translate([t, 0]);
    this.props.draw();
  }

  render() {
    return <rect
      className="zoom-pane"
      width={this.props.width}
      height={this.props.height}/>;
  }
}
