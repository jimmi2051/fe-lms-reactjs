/**
 * @author Thanh Ly
 */

import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "pages/Home";

export default function RootRoute() {
  return (
    <>
      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
    </>
  );
}
