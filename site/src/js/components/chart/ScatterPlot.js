import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import SourcesPropType from "../../constants/SourcesPropType";

const basePointSize = 2;
const baseLogoSize = 30;
const xMargin = 50;
const yMargin = 25;
const pointColor = "#666666";

export default function ScatterPlot({
  data,
  width,
  className,
  height,
  sources,
  options,
}) {
  const svgRef = useRef(null);

  useEffect(() => {
    const plotHeight = height - yMargin * 2;
    const plotWidth = width - xMargin * 2;

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear

    // Canvas and grid
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${xMargin},${yMargin})`);

    // X axis
    const xScale = d3.scaleLinear().domain([-105, 105]).range([0, plotWidth]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${plotHeight / 2})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([-105, 105])
          .tickFormat((d) => (d < 0 ? "Farthest left" : "Farthest right"))
      )
      .selectAll("path")
      .style("stroke", "#DDDDDD");
    // Y axis
    const yScale = d3.scaleLinear().domain([-105, 105]).range([plotHeight, 0]);
    svg
      .append("g")
      .attr("transform", `translate(${plotWidth / 2},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickValues([-105, 105])
          .tickFormat((d) => (d < 0 ? "Least reliable" : "Most reliable"))
      )
      .selectAll("path")
      .style("stroke", "#DDDDDD");

    // Data
    const points = svg
      .append("g")
      .attr("stroke", pointColor)
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .selectAll(".point")
      .data(data)
      .join("circle")
      .attr("class", "point")
      .attr("cx", (d) => xScale(d.evaluations.mbfc.bias))
      .attr("cy", (d) => yScale(d.evaluations.mbfc.accuracy));

    if (options.showLogos) {
      points.attr("r", basePointSize);
      svg
        .selectAll(".pointImage")
        .data(data)
        .join("image")
        .attr("class", "pointImage")
        .attr("xlink:href", (d) => `https://logo.clearbit.com/${d.domain}`)
        .attr("x", (d) => xScale(d.evaluations.mbfc.bias) - baseLogoSize / 2)
        .attr(
          "y",
          (d) => yScale(d.evaluations.mbfc.accuracy) - baseLogoSize / 2
        )
        .attr("width", baseLogoSize);
    } else {
      points.attr("r", (d) =>
        Math.min(basePointSize + 100 * (d.usages / sources.total_usages), 50)
      );
    }
  }, [data, height, width, sources, options]);

  return (
    <div className={className}>
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} />
    </div>
  );
}

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
  sources: SourcesPropType.isRequired,
  className: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  options: PropTypes.object.isRequired,
};

ScatterPlot.defaultProps = {
  width: 400,
  height: 300,
};
