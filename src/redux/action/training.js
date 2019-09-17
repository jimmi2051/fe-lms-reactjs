/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const createTraining = (payload, next, nextErr) => {
  const { name, level, description } = payload;
  const isActive = true;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings`,
      beforeCallType: "CREATE_TRAINING_REQUEST",
      successType: "CREATE_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        name,
        isActive,
        level,
        description
      }
    }
  };
};
