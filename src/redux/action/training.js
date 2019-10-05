/**
 * @author Thanh Ly
 */
import { SINGLE_API, GRAPHQL } from "./type";

export const createTraining = (payload, next, nextErr) => {
  const { name, level, description, thumbnail, users } = payload;
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
        description,
        thumbnail,
        users: [users]
      }
    }
  };
};

export const addLearningPath = (payload, next, nextErr) => {
  const { trainings, courses, position, markForCourse, isRequired } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `learningpaths`,
      beforeCallType: "ADD_LEARNING_PATH_REQUEST",
      successType: "ADD_LEARNING_PATH_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        trainings,
        courses,
        position,
        markForCourse,
        isRequired
      }
    }
  };
};

export const getTrainingByUser = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings?users._id=${id}`,
      beforeCallType: "GET_TRAINING_REQUEST",
      successType: "GET_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getTrainingById = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: GRAPHQL,
    payload: {
      id: id,
      beforeCallType: "GET_TRAINING_BY_ID_REQUEST",
      successType: "GET_TRAINING_BY_ID_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};
