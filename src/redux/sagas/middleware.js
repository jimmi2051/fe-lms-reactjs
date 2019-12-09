/**
 * @author Thanh Ly
 */

import { takeEvery, call, put } from "redux-saga/effects";
// import AuthStorage from "utils/AuthStorage";
import fetchApi from "utils/FetchApi";
import { SINGLE_API } from "redux/action/type.js";

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

    const response = yield call(fetchApi, rest);
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
  yield takeEvery("*", callApi);
}
