/**
 * @author Thanh Ly
 */

import React from "react";
import { Route, Switch } from "react-router-dom";

import HomePage from "pages/Home";
import LoginPage from "pages/Login";
import RegisterPage from "pages/Register";
import AdminCoursePage from "pages/CourseManage";
import AdminNewTraining from "pages/NewTraining";
import AdminListTraining from "pages/ListTraining";
import TrainingDetail from "pages/TrainingDetail";
import TrainingPage from "pages/ListTrainingStudent";
import MyTrainingPage from "pages/MyTrainingStudent";
import ViewTrainingDetail from "pages/ViewDetailTraining";
import AdminTrainingDetail from "pages/AdminTrainingDetail";
import PageNotFound from "pages/PageNotFound";
import AdminModulePage from "pages/ModuleManage";
import AdminContentPage from "pages/ContentManage";
import ForgotPasswordPage from "pages/ForgotPassword";

import StudentWarp from "layout/Student";

export default function RootRoute() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/trainings" component={TrainingPage} />
        <Route exact path="/view-training/:id" component={ViewTrainingDetail} />
        <Route exact path="/forgot-password" component={ForgotPasswordPage} />
        <StudentWarp>
          <Switch>
            <Route exact path="/training/:id" component={TrainingDetail} />
            <Route exact path="/my-training" component={MyTrainingPage} />
            <Route
              exact
              path="/admin/training/:id"
              component={AdminTrainingDetail}
            />
            <Route exact path="/admin/course" component={AdminCoursePage} />
            <Route exact path="/admin/module" component={AdminModulePage} />
            <Route exact path="/admin/content" component={AdminContentPage} />
            <Route
              exact
              path="/admin/new-training"
              component={AdminNewTraining}
            />
            <Route exact path="/admin/training" component={AdminListTraining} />
            <Route component={PageNotFound} />
          </Switch>
        </StudentWarp>
      </Switch>
    </>
  );
}
