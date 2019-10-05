/**
 * @author Thanh Ly
 */

import { fork } from "redux-saga/effects";
import es6promise from "es6-promise";
import "isomorphic-unfetch";

import middleware from "./middleware";
import auth from "./auth";
import graphql from "./graphql";
es6promise.polyfill();

export default function* rootSaga() {
  yield fork(middleware);
  yield fork(auth);
  yield fork(graphql);
}
