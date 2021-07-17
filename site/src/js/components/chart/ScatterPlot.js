import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

export default function ScatterPlot({ data, width, height }) {
  const svgRef = useRef(null);

  useEffect(() => {
    const xMargin = 50;
    const yMargin = 25;
    const plotHeight = height - yMargin * 2;
    const plotWidth = width - xMargin * 2;

    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); // Clear

    // Canvas and grid
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${xMargin},${yMargin})`);

    // X axis
    const xScale = d3.scaleLinear().domain([-100, 100]).range([0, plotWidth]);
    svg
      .append("g")
      .attr("transform", `translate(0, ${plotHeight / 2})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickValues([-100, 100])
          .tickFormat((d) => (d < 0 ? "Left bias" : "Right bias"))
      )
      .selectAll("path")
      .style("stroke", "#DDDDDD");
    // Y axis
    const yScale = d3.scaleLinear().domain([-100, 100]).range([plotHeight, 0]);
    svg
      .append("g")
      .attr("transform", `translate(${plotWidth / 2},0)`)
      .call(
        d3
          .axisLeft(yScale)
          .tickValues([-100, 100])
          .tickFormat((d) => (d < 0 ? "Least reliable" : "Most reliable"))
      )
      .selectAll("path")
      .style("stroke", "#DDDDDD");

    // Data
    svg
      .append("g")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("fill", "none")
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 3);
  }, [data, height, width]);

  return <svg ref={svgRef} width={width} height={height} />;
}

ScatterPlot.propTypes = {
  data: PropTypes.array.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

ScatterPlot.defaultProps = {
  width: 400,
  height: 300,
};
