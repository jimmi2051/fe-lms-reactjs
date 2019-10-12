/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const getContent = (payload, next, nextErr) => {
  const {id} = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents?users._id=${id}`,
      beforeCallType: "GET_CONTENT_REQUEST",
      successType: "GET_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getContentByModule = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents?modules._id=${id}`,
      beforeCallType: "GET_CONTENT_BY_MODULE_REQUEST",
      successType: "GET_CONTENT_BY_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const updateContent = (payload, next, nextErr) => {
  const { id, modules } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents/${id}`,
      beforeCallType: "UPDATE_CONTENT_REQUEST",
      successType: "UPDATE_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        modules
      }
    }
  };
};
