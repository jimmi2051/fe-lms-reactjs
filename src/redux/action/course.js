/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const createCourse = (payload, next, nextErr) => {
  const { name, description, thumbnail } = payload;
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
        isActive
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
