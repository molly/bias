import React from "react";
import SourcesPropType from "../../constants/SourcesPropType";
import ScatterPlot from "./ScatterPlot";

export default function Chart({ sources }) {
  const getChartData = () =>
    Object.values(sources.citations)
      .filter(
        (cite) =>
          Object.prototype.hasOwnProperty.call(cite, "evaluations") &&
          Object.prototype.hasOwnProperty.call(cite.evaluations, "mbfc") &&
          typeof cite.evaluations.mbfc.bias === "number" &&
          typeof cite.evaluations.mbfc.bias === "number"
      )
      .map((cite) => cite.evaluations.mbfc);

  return (
    <div>
      <ScatterPlot
        width={800}
        height={600}
        margins={10}
        data={sources && getChartData(sources.citations)}
        sources={sources}
      />
    </div>
  );
}

Chart.propTypes = {
  sources: SourcesPropType,
};
