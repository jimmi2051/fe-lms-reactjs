/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const createModule = (payload, next, nextErr) => {
  const { name, description, thumbnail, users } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules`,
      beforeCallType: "CREATE_MODULE_REQUEST",
      successType: "CREATE_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        name,
        description,
        thumbnail,
        users: [users]
      }
    }
  };
};

export const getModule = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules`,
      beforeCallType: "GET_MODULE_REQUEST",
      successType: "GET_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getModuleByUser = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules?users._id=${id}`,
      beforeCallType: "GET_MODULE_BY_USER_REQUEST",
      successType: "GET_MODULE_BY_USER_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getModuleByCourse = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `relationcoursemodules?courses._id=${id}`,
      beforeCallType: "FILTER_MODULE_BY_COURSE_REQUEST",
      successType: "FILTER_MODULE_BY_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};
