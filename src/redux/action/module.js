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
      uri: `relationcoursemodules?course._id=${id}&_sort=position:asc`,
      beforeCallType: "FILTER_MODULE_BY_COURSE_REQUEST",
      successType: "FILTER_MODULE_BY_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const removeModuleByCourse = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `relationcoursemodules/${id}`,
      beforeCallType: "REMOVE_MODULE_BY_COURSE_REQUEST",
      successType: "REMOVE_MODULE_BY_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "DELETE"
      }
    }
  };
};

export const getListModule = (payload, next, nextErr) => {
  const { id, keySearch, startItemPage, itemPerPage, courseId = "" } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules?users._id=${id}&${
        courseId !== "" ? `relationcoursemodules.course=${courseId}&` : ""
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }_start=${startItemPage}&_limit=${itemPerPage}`,
      beforeCallType: "GET_LIST_MODULE_REQUEST",
      successType: "GET_LIST_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const deleteModule = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules/${id}`,
      beforeCallType: "DELETE_MODULE_REQUEST",
      successType: "DELETE_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "DELETE"
      }
    }
  };
};

export const updateModule = (payload, next, nextErr) => {
  const { id, name } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `modules/${id}`,
      beforeCallType: "UPDATE_MODULE_REQUEST",
      successType: "UPDATE_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        name
      }
    }
  };
};
