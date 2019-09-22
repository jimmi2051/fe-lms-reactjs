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
      uri: `learningpaths?trainings._id=${id}`,
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

// export const getModuleByCourse = (payload, next, nextErr) => {
//   const { id } = payload;
//   return {
//     type: SINGLE_API,
//     payload: {
//       uri: `learningpaths?trainings._id=${id}`,
//       beforeCallType: "FILTER_COURSE_BY_TRAINING_REQUEST",
//       successType: "FILTER_COURSE_BY_TRAINING_SUCCESS",
//       afterSuccess: next,
//       afterError: nextErr
//     }
//   };
// };
