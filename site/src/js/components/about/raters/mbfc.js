import React from "react";
import Breadcrumb from "../../Breadcrumb";

export default function Raters() {
  return (
    <div className="container">
      <Breadcrumb
        path={[
          { title: "About", path: "about" },
          { title: "Raters", path: "raters" },
          { title: "MBFC", path: "mbfc", active: true },
        ]}
      />
      <h2 className="display-2">Media Bias/Fact Check</h2>
      <h3>MB/FC</h3>
      <p></p>
    </div>
  );
}
