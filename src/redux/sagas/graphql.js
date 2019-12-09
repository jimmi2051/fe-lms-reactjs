/**
 * @author Thanh Ly
 */

import { takeEvery, call, put } from "redux-saga/effects";
import { GRAPHQL } from "redux/action/type.js";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import AuthStorage from "utils/AuthStorage";
const API_URL = process.env.REACT_APP_URL_API;

function* callGraphQL(action) {
  const client = new ApolloClient({
    uri: `${API_URL}graphql`,
    request: operation => {
      operation.setContext({
        headers: {
          authorization: AuthStorage.loggedIn
            ? `Bearer ${AuthStorage.token}`
            : ""
        }
      });
    }
  });
  if (action.type === GRAPHQL) {
    const {
      successType,
      beforeCallType,
      afterCallType,
      afterSuccess,
      errorType,
      afterError,
      query
    } = action.payload;
    if (beforeCallType) {
      yield put({ type: beforeCallType });
    }

    yield put(showLoading());
    let response;
    try {
      response = yield call(client.query, {
        query: gql`
          ${query}
        `
      });
    } catch {
      response = {
        status: false
      };
    }
    if (afterCallType) {
      yield put({ type: afterCallType });
    }
    if (response) {
      if (successType) {
        yield put({ type: successType, payload: response });
      }
      if (typeof afterSuccess === "function") {
        afterSuccess(response);
      }
    } else {
      if (errorType) {
        yield put({ type: errorType, payload: response });
      }
      if (typeof afterError === "function") {
        afterError(response);
      }
    }
  }
}

export default function*() {
  yield takeEvery("*", callGraphQL);
}
