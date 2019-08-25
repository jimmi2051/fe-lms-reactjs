/**
 * @author Thanh Ly
 */

import { takeEvery, call, put } from "redux-saga/effects";
// import AuthStorage from "utils/AuthStorage";
import fetchApi from "utils/FetchApi";
import { SINGLE_API } from "redux/action/type.js";
import { showLoading, hideLoading } from "react-redux-loading-bar";

function* callApi(action) {
  if (action.type === SINGLE_API) {
    const {
      successType,
      beforeCallType,
      afterCallType,
      afterSuccess,
      errorType,
      afterError,
      ...rest
    } = action.payload;
    if (beforeCallType) {
      yield put({ type: beforeCallType });
    }

    yield put(showLoading());
    const response = yield call(fetchApi, rest);
    if (afterCallType) {
      yield put({ type: afterCallType });
    }

    if (response && !response.error && response.detail !== "Invalid token.") {
      if (successType) {
        yield put({ type: successType, payload: response });
      }
      yield put(hideLoading());
      if (typeof afterSuccess === "function") {
        afterSuccess(response);
      }
    } else {
      yield put(hideLoading());

      if (response.detail === "Invalid token.") {
        yield put({ type: "LOGOUT_REQUEST" });
      } else {
        if (errorType) {
          yield put({ type: errorType, payload: response.error });
        }

        if (typeof afterError === "function") {
          afterError(response.error);
        }
      }
    }
  }
}

export default function*() {
  yield takeEvery("*", callApi);
}
