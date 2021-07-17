import React from "react";
import ScatterPlot from "./ScatterPlot";

export default function Chart() {
  return (
    <>
      <div>
        <ScatterPlot
          width={800}
          height={600}
          margins={10}
          data={[
            { x: -2, y: 10 },
            { x: -25, y: 25 },
            { x: 20, y: -19 },
          ]}
        />
      </div>
    </>
  );
}
