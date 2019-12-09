/* eslint-disable require-yield */

import merge from "lodash/merge";
import { put, call } from "redux-saga/effects";
import AuthStorage from "./AuthStorage";
import LangStorage from "./LangStorage";
// import _ from "lodash";

const API_URL = process.env.REACT_APP_URL_API;

export const fetching = (url, option) =>
  fetch(url, option)
    .then(response => {
      return response.json();
    })
    .then(json => {
      return json;
    })
    .catch(error => {
      throw error;
    });

export default function*({
  uri,
  params = {},
  opt = {},
  // payment,
  loading = true
}) {
  const defaultOption = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": LangStorage.getLang ? LangStorage.getLang : "en"
    }
  };

  if (!uri) {
    return;
  }
  const options = merge(defaultOption, opt);
  //set Token
  if (AuthStorage.loggedIn) {
    options.headers.Authorization = `Bearer ${AuthStorage.token}`;
  }

  let url = uri;
  url = `${API_URL}${url}`;

  if (params && Object.keys(params).length > 0) {
    if (options && options.method === "GET") {
    } else {
      options.body = JSON.stringify(params);
    }
  }

  if (loading) {
    yield put({ type: "TOGGLE_LOADING" });
  }
  let response;
  try {
    if (process.env.NODE_ENV === "development") {
      // console.log("==========> call" + url, ", options=", options);
    }
    response = yield call(fetching, url, options);
  } catch (error) {
    response = { error };
  }

  return response;
}
