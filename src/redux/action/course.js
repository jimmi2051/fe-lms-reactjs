/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const createCourse = (payload, next, nextErr) => {
  const { name, description, thumbnail, user } = payload;
  const isActive = true;
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses`,
      beforeCallType: "CREATE_COURSE_REQUEST",
      successType: "CREATE_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        name,
        description,
        thumbnail,
        isActive,
        users: [user]
      }
    }
  };
};

export const getCourse = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses`,
      beforeCallType: "GET_COURSE_REQUEST",
      successType: "GET_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getCourseByTraining = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `learningpaths?training._id=${id}&_sort=position:asc`,
      beforeCallType: "FILTER_COURSE_BY_TRAINING_REQUEST",
      successType: "FILTER_COURSE_BY_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getCourseByUser = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses?users._id=${id}`,
      beforeCallType: "GET_COURSE_BY_USER_REQUEST",
      successType: "GET_COURSE_BY_USER_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const addCourseModule = (payload, next, nextErr) => {
  const { course, position, module } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `relationcoursemodules`,
      beforeCallType: "ADD_COURSE_MODULE_REQUEST",
      successType: "ADD_COURSE_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        course,
        position,
        module
      }
    }
  };
};

export const getListCourse = (payload, next, nextErr) => {
  const {
    id,
    keySearch,
    startItemPage,
    itemPerPage,
    trainingId = ""
  } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses?users._id=${id}&${
        trainingId !== "" ? `learningpaths.training=${trainingId}&` : ""
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }_start=${startItemPage}&_limit=${itemPerPage}`,
      beforeCallType: "GET_LIST_COURSES_REQUEST",
      successType: "GET_LIST_COURSES_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const deleteCourse = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses/${id}`,
      beforeCallType: "DELETE_COURSE_REQUEST",
      successType: "DELETE_COURSE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "DELETE"
      }
    }
  };
};

export const updateCourse = (payload, next, nextErr) => {
  const { id, name } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `courses/${id}`,
      beforeCallType: "UPDATE_COURSE_REQUEST",
      successType: "UPDATE_COURSE_SUCCESS",
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
