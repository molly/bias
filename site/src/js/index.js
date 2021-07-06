import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";

import reducer from "./reducers";

import Home from "./components/Home";
import List from "./components/List";

import "../css/main.scss";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={createStore(reducer, applyMiddleware(thunk))}>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/list" component={List} />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
