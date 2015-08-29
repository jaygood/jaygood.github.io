/**
 * handles transformation for the y
 * @param oldScale
 * @param newScale
 * @returns {{translate: number, scale: number}}
 */
const yScaleTransform = function (oldScale, newScale) {
  const [oldMin, oldMax] = oldScale.domain();
  const [newMin, newMax] = newScale.domain();
  const scale = (oldMax - oldMin) / (newMax - newMin);
  const translate = scale * (oldScale.range()[1] - oldScale(newMax));

  return {translate, scale};
};

/**
 * Returns initial index (always >= 1)
 * @param seriesData
 * @param date
 * @returns {*|number}
 */
const findIndex = function (seriesData, date) {
  const bisect = d3.bisector(d => d.date).left;

  let initialIndex = bisect(seriesData, date);
  return initialIndex || ++initialIndex;
};

/**
 * Creates a new function to handle specific changes
 * @param propName
 */
const createChangeFunc = propName =>
  (seriesData, initialDate) => {
    const initialIndex = findIndex(seriesData, initialDate) - 1;
    const initialClose = seriesData[initialIndex][propName];

    return seriesData.map(d => ({
      date: d.date,
      change: d[propName] / initialClose - 1
    }));
  };

const percentageChange = createChangeFunc('close');

/**
 * Gets the y domain yo
 * @param data
 * @param xDomain
 * @returns {*}
 */
const calculateYDomain = function (data, xDomain) {
  const innerData = data.map(series => {
    const start = findIndex(series.data, xDomain[0]) - 1;
    const end = findIndex(series.data, xDomain[1]) + 1;
    return series.data.slice(start, end);
  });

  const allPoints = innerData.reduce((prev, curr) => prev.concat(curr), []);

  return allPoints.length ?
    d3.extent(allPoints, d => d.change) :
    [0, 0]
};

const color = d3.scale.category10();

/**
 * Creates the diffChart
 * @param x
 * @param y
 * @returns {*}
 */
export default function (x, y) {
  let xScale = d3.time.scale();
  let yScale = d3.scale.linear();

  const line = d3.svg.line()
    .interpolate('linear')
    .x(d => xScale(d.date))
    .y(d => yScale(d.change));

  const diff = function (selection) {
    selection.each(function (data) {

      data = data.map(d => ({
        name: d.name,
        data: percentageChange(d.data, xScale.domain()[0])
      }));

      color.domain(data.map(d => d.name));

      yScale.domain(calculateYDomain(data, xScale.domain()));

      const series = d3.select(this).selectAll('.diff-series').data([data]);
      series.enter().append('g').classed('diff-series', true);

      series.selectAll('.line')
        .data(data, d => d.name)
        .enter().append('path')
        .attr('class', 'line')
        .attr('d', d => line(d.data))
        .style('stroke', d => color(d.name));

      series.selectAll('.line')
        .attr('d', d => line(d.data));
    });
  };

  diff.xScale = value => {
    if (!arguments.length) return xScale;
    xScale = value;
    return diff;
  };

  diff.yScale = value => {
    if (!arguments.length) return yScale;
    yScale = value;
    return diff;
  };

  return diff
    .xScale(x)
    .yScale(y);
};
