/**
 * @author Thanh Ly
 */

import { takeEvery, call, put } from "redux-saga/effects";
// import AuthStorage from "utils/AuthStorage";
import fetchApi from "utils/FetchApi";
import { GRAPHQL } from "redux/action/type.js";
import { showLoading, hideLoading } from "react-redux-loading-bar";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
const API_URL = process.env.REACT_APP_URL_API;

const client = new ApolloClient({
  uri: `${API_URL}graphql`
});

function* callApi(action) {
  if (action.type === GRAPHQL) {
    const {
      successType,
      beforeCallType,
      afterCallType,
      afterSuccess,
      errorType,
      afterError,
      id
    } = action.payload;
    if (beforeCallType) {
      yield put({ type: beforeCallType });
    }

    yield put(showLoading());
    const response = yield call(client.query, {
      query: gql`
        {
            training(id:"${id}"){
              id
              name
              numberOfCourse
              description
              numberOfStudent
              level
              thumbnail{
                name
                url
              }
              learningpaths{
                id
                position
                markForCourse
                courses{
                  name
                  numberOfSection
                  thumbnail{
                    name
                    url
                  }
                  relationcoursemodules{
                    position
                    modules{
                      name
                      description
                      numberOfLecture
                      thumbnail{
                        name
                        url
                      }
                      contents{
                        name
                        type
                        relationData{
                          data
                          struct
                          media{
                            name
                            url
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `
    });
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
