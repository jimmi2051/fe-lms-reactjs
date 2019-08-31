/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const getUsers = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `tests`,
      beforeCallType: "GET_USER_INFO_REQUEST",
      successType: "GET_USER_INFO_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const registerUser = (payload, next, nextErr) => {
  const {
    username,
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    tel,
    role
  } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `auth/local/register`,
      beforeCallType: "REGISTER_USER_REQUEST",
      successType: "REGISTER_USER_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        username,
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        tel,
        role
      }
    }
  };
};
