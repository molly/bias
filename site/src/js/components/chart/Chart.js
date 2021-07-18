import React, { useState } from "react";

import SourcesPropType from "../../constants/SourcesPropType";

import ScatterPlot from "./ScatterPlot";
import ChartOptions from "./ChartOptions";

export default function Chart({ sources }) {
  const [options, setOptions] = useState({
    sizeBasedOnUsage: true,
  });

  const getChartData = () =>
    Object.values(sources.domains).filter(
      (d) =>
        Object.prototype.hasOwnProperty.call(d, "evaluations") &&
        Object.prototype.hasOwnProperty.call(d.evaluations, "mbfc") &&
        typeof d.evaluations.mbfc.bias === "number" &&
        typeof d.evaluations.mbfc.accuracy === "number"
    );

  return (
    <div className="row gx-1">
      <ScatterPlot
        data={sources && getChartData()}
        sources={sources}
        className="col-lg-9"
        width={800}
        height={600}
        margins={10}
        options={options}
      />
      <ChartOptions
        options={options}
        setOptions={setOptions}
        className="col-lg-3"
      />
    </div>
  );
}

Chart.propTypes = {
  sources: SourcesPropType,
};
