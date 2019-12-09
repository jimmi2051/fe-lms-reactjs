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

export const getRoles = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `users-permissions/roles`,
      beforeCallType: "GET_ROLES_REQUEST",
      successType: "GET_ROLES_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const requestForgotPassword = (payload, next, nextErr) => {
  const { email } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `auth/forgot-password`,
      beforeCallType: "FORGOT_PASSWORD_REQUEST",
      successType: "FORGOT_PASSWORD_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        email
      }
    }
  };
};

export const resetPassword = (payload, next, nextErr) => {
  const { code, password, passwordConfirmation } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `auth/reset-password`,
      beforeCallType: "GET_ROLES_REQUEST",
      successType: "GET_ROLES_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        code,
        password,
        passwordConfirmation
      }
    }
  };
};
