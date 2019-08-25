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
