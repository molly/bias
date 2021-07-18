import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import clone from "just-clone";

import SourcesPropType from "../../constants/SourcesPropType";

const basePointSize = 2;
const xMargin = 50;
const yMargin = 25;
const pointColor = "#555555";

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
    const collisionR = options.sizeBasedOnUsage ? 2 : 0.25;
    const dataCopy = clone(data);

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

    const simulation = d3
      .forceSimulation(dataCopy)
      .force(
        "x",
        d3.forceX((d) => xScale(d.evaluations.mbfc.bias))
      )
      .force(
        "y",
        d3.forceY((d) => yScale(d.evaluations.mbfc.accuracy))
      )
      .force(
        "collide",
        d3.forceCollide(basePointSize + collisionR).iterations(4)
      );
    for (let i = 0; i < 100; i++) {
      simulation.tick();
    }
    simulation.stop();

    // Data
    svg
      .append("g")
      .attr("stroke", pointColor)
      .attr("fill", pointColor)
      .selectAll(".point")
      .data(dataCopy)
      .join("circle")
      .attr("class", "point")
      .attr("cx", (d) => d.x)
      .attr("cy", (d) => d.y)
      .attr("opacity", 0.3)
      .attr("r", (d) => {
        return options.sizeBasedOnUsage
          ? Math.max(Math.min(300 * (d.usages / sources.total_usages), 30), 1)
          : basePointSize;
      });
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
