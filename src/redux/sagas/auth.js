import { take, call, cancel, fork, put } from "redux-saga/effects";
import AuthStorage from "../../utils/AuthStorage";
import fetchApi from "../../utils/FetchApi";
import { showLoading, hideLoading } from "react-redux-loading-bar";

function* authorize(payload, next, nextErr) {
  yield put(showLoading());
  const response = yield call(fetchApi, {
    uri: "auth/local",
    params: payload,
    opt: { method: "POST", mode: "cors" },
    loading: false
  });
  if (response && response.jwt) {
    // const isAuthen = payload.mfa_code ? true : false;
    const data = {
      token: response.jwt,
      user: response.user
    };

    AuthStorage.value = data;
    yield put({
      type: "LOGIN_SUCCESS",
      payload: data
    });
    yield put(hideLoading());
    if (typeof next === "function") {
      next();
    }
  } else {
    yield put({
      type: "LOGIN_FAILED",
      payload: response
    });
    if (typeof nextErr === "function") {
      nextErr(response);
    }
  }
}

function* loginFlow() {
  const INFINITE = true;
  while (INFINITE) {
    const { payload, next, nextErr } = yield take("LOGIN_REQUEST");
    const authorizeTask = yield fork(authorize, payload, next, nextErr);
    const action = yield take([
      "LOGOUT_REQUEST",
      "LOGIN_FAILED",
      "REQUEST_ERROR"
    ]);

    if (action.type === "LOGOUT_REQUEST") {
      yield cancel(authorizeTask);
    }
  }
}

function* logoutFlow() {
  const INFINITE = true;
  while (INFINITE) {
    const { next } = yield take("LOGOUT_REQUEST");
    yield call(AuthStorage.destroy);
    const data = {
      token: "",
      organizationId: "",
      status: "",
      role: "",
      plan: "",
      username: "",
      isAuthen: false,
      isSuperAdmin: false
    };
    window.localStorage.clear();
    AuthStorage.value = data;
    yield put({ type: "LOGIN_SUCCESS", payload: data });
    if (typeof next === "function") {
      next();
    }
  }
}

export default function* authFlow() {
  yield fork(loginFlow);
  yield fork(logoutFlow);
}
