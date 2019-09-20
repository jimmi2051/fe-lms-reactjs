/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const createModule = (payload, next, nextErr) => {
  const { name, description, thumbnail } = payload;
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
        thumbnail
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
