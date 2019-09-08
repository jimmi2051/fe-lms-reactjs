/**
 * @author Thanh Ly
 */

import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import RegisterPage from "pages/Register";
import CoursePage from "pages/Course";
export default function RootRoute() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/course" component={CoursePage} />
      </Switch>
    </>
  );
}
