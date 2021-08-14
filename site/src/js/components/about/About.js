import React from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";

export default function About() {
  return (
    <div className="container">
      <h1 className="display-1">About</h1>
      <p>
        The Wikipedia source evaluator project was created by{" "}
        <a href="https://www.mollywhite.net">Molly White</a>, who is known as{" "}
        <a href="https://en.wikipedia.org/wiki/User:GorillaWarfare">
          GorillaWarfare
        </a>{" "}
        on Wikimedia projects.
      </p>
      <ul>
        <li>
          <Link to="/about/faq">Frequently asked questions</Link>
        </li>
        <li>
          <Link to="/about/raters">List of raters</Link>
        </li>
        <li>
          <a href="https://github.com/molly/bias">Source code</a>
        </li>
        <li>
          <a href="https://github.com/molly/bias/issues">Report a bug</a>
        </li>
      </ul>
    </div>
  );
}
