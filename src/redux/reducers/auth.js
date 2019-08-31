// import { fromJS, Map } from 'immutable';

export const initialState = {
  token: "",
  user: ""
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { ...state, ...action.payload };
    case "LOGIN_FAILED":
      return { error: action.payload };
    case "INVALID_TOKEN":
      return { ...state, token: "", user: "" };
    default:
      return state;
  }
};
