import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";

// import { fromJS, Iterable } from "immutable";
// import logger from "redux-logger";

import rootReducer, { exampleInitialState } from "../reducers";
import rootSaga from "../sagas";
// import { loadingBarMiddleware } from "react-redux-loading-bar";

const sagaMiddleware = createSagaMiddleware();

// const bindMiddleware = middleware => {
//   if (process.env.NODE_ENV !== "production") {
//     const { composeWithDevTools } = require("redux-devtools-extension");
//     return composeWithDevTools(applyMiddleware(logger, middleware));
//   }
//   return applyMiddleware(...middleware);
// };

export default (state = exampleInitialState) => {
  const composeMiddleware =
    process.env.NODE_ENV !== "production"
      ? compose(
          applyMiddleware(sagaMiddleware)
          // applyMiddleware(logger)
        )
      : compose(applyMiddleware(sagaMiddleware));

  const store = createStore(
    combineReducers(rootReducer),
    state,
    composeMiddleware
    // bindMiddleware([sagaMiddleware])
  );
  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };

  // run the rootSaga initially
  store.runSagaTask();
  return store;
};
