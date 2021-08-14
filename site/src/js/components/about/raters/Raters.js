import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../Breadcrumb";

export default function Raters() {
  return (
    <div className="container">
      <Breadcrumb
        path={[
          { title: "About", path: "about" },
          { title: "Raters", path: "raters" },
        ]}
      />
      <h1 className="display-1">Raters</h1>
      <p>
        This project pulls data from several sources, with more to be added.
        These include:
      </p>
      <ul>
        <li>
          <Link to="/about/raters/mbfc">Media Bias/Fact Check</Link>
        </li>
        <li>
          <Link to="/about/raters/rsp">
            English Wikipedia's list of perennial sources
          </Link>
        </li>
      </ul>
    </div>
  );
}
