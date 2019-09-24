/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const getContent = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents`,
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
