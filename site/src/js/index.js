import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducers";

import Home from "./components/Home";
import ListWrapper from "./components/list/ListWrapper";
import ChartWrapper from "./components/chart/ChartWrapper";
import Source from "./components/source/Source";

import About from "./components/about/About";
import FAQ from "./components/about/faq/FAQ";

import Raters from "./components/about/raters/Raters";
import MBFC from "./components/about/raters/mbfc";
import RSP from "./components/about/raters/rsp";

import "../css/main.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducer, applyMiddleware(thunk))}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={ListWrapper} />
          <Route path="/chart" component={ChartWrapper} />
          <Route path="/source" component={Source} />

          <Route exact path="/about" component={About} />
          <Route path="/about/faq" component={FAQ} />

          <Route exact path="/about/raters" component={Raters} />
          <Route exact path="/about/raters/mbfc" component={MBFC} />
          <Route exact path="/about/raters/rsp" component={RSP} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
