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
      query: `{
        training(id:"${id}"){
          id
          name
          numberOfCourse
          description
          numberOfStudent
          level
          thumbnail{
            name
            url
          }
          learningpaths{
            id
            position
            markForCourse
            courses{
              name
              numberOfSection
              thumbnail{
                name
                url
              }
              relationcoursemodules{
                position
                modules{
                  name
                  description
                  numberOfLecture
                  thumbnail{
                    name
                    url
                  }
                  contents{
                    name
                    type
                    relationData{
                      data
                      struct
                      media{
                        name
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      beforeCallType: "GET_TRAINING_BY_ID_REQUEST",
      successType: "GET_TRAINING_BY_ID_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getTrainingByCategory = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: GRAPHQL,
    payload: {
      query: `{
        categorytrainings(where: {trainings:{users:{_id:"${id}"}}} )
        {
          name
          trainings{
            id
            name
            description
            level
            numberOfCourse
            thumbnail{
              name
              url
            }
            users{
              _id
            }
          }
        }
      }`,
      beforeCallType: "GET_TRAINING_BY_CAT_REQUEST",
      successType: "GET_TRAINING_BY_CAT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};
