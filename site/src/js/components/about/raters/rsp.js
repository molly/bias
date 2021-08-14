import React from "react";
import Breadcrumb from "../../Breadcrumb";

export default function Raters() {
  return (
    <div className="container">
      <Breadcrumb
        path={[
          { title: "About", path: "about" },
          { title: "Raters", path: "raters" },
          { title: "RSP", path: "rsp", active: true },
        ]}
      />
      <h2 className="display-2">
        English Wikipedia's list of perennial sources
      </h2>
      <h3>RSP</h3>
      <p></p>
    </div>
  );
}
