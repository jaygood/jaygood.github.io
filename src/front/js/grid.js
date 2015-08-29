import _ from 'lodash';

/**
 * Gridline guy that handles the grid
 * @param xScale
 * @param yScale
 * @param xTicks
 * @param yTicks
 */
export default function (xScale, yScale, xTicks, yTicks) {

  // line up them xs
  const xLines = (data, grid) => {
    const xlines = grid.selectAll('.x')
      .data(data);
    const attr = {
      x1: d => xScale(d),
      x2: d => xScale(d),
      y1: yScale.range()[0],
      y2: yScale.range()[1]
    };
    xlines.enter().append('line')
      .attr(_.assign({'class': 'x'}, attr));
    xlines.attr(attr);
    xlines.exit().remove();
  };

  // line the ys
  const yLines = (data, grid) => {
    const ylines = grid.selectAll('.y')
      .data(data);
    const attr = {
      x1: xScale.range()[0],
      x2: xScale.range()[1],
      y1: d => yScale(d),
      y2: d => yScale(d)
    };
    ylines.enter().append('line')
      .attr(_.assign({'class': 'y'}, attr));
    ylines.attr(attr);
    ylines.exit().remove();
  };

  // TODO maybe a neat way to have a class return a function?
  const gridlines = function (selection) {
    selection.each(function() {
      const xTickData = xScale.ticks(xTicks);
      const yTickData = yScale.ticks(yTicks);

      const grid = d3.select(this).selectAll('.gridlines').data([[xTickData, yTickData]]);
      grid.enter().append('g').classed('gridlines', true);
      xLines(xTickData, grid);
      yLines(yTickData, grid);
    });
  };

  gridlines.xScale = value => {
    if (!arguments.length) return xScale;
    xScale = value;
    return gridlines;
  };

  gridlines.yScale = value => {
    if (!arguments.length) return yScale;
    yScale = value;
    return gridlines;
  };

  gridlines.xTicks = value => {
    if (!arguments.length) return xTicks;
    xTicks = value;
    return gridlines;
  };

  gridlines.yTicks = value => {
    if (!arguments.length) return yTicks;
    yTicks = value;
    return gridlines;
  };

  return gridlines;
};