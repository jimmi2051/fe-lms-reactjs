/**
 * @author Thanh Ly
 */
import { SINGLE_API, GRAPHQL } from "./type";

export const createTraining = (payload, next, nextErr) => {
  const {
    name,
    level,
    description,
    thumbnail,
    users,
    categorytrainings,
    subTitle
  } = payload;
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
        subTitle,
        isActive,
        level,
        description,
        thumbnail,
        users: [users],
        categorytrainings: [categorytrainings]
      }
    }
  };
};

export const addLearningPath = (payload, next, nextErr) => {
  const { training, course, position, markForCourse, isRequired } = payload;
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
        training,
        course,
        position,
        markForCourse,
        isRequired
      }
    }
  };
};

export const getTrainingByUser = (payload, next, nextErr) => {
  const { id, keySearch, startItemPage, itemPerPage, categoryId } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings?users._id=${id}&${
        categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ``
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }_start=${startItemPage}&_limit=${itemPerPage}`,
      beforeCallType: "GET_TRAINING_BY_REQUEST",
      successType: "GET_TRAINING_BY_SUCCESS",
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
          _id
          name
          numberOfCourse
          description
          numberOfStudent
          level
          createdAt
          thumbnail{
            name
            url
          }
          learningpaths{
            _id
            position
            markForCourse
            course{
              _id
              name
              numberOfSection
              description
              thumbnail{
                name
                url
              }
              relationcoursemodules{
                _id
                position
                module{
                  _id
                  name
                  description
                  numberOfLecture
                  thumbnail{
                    name
                    url
                  }
                  contents{
                    _id
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
        	users{
            id
            firstName
            lastName
          }
          activityusers{
            courses
            totalMark
            user{
              _id
            }
          }
          categorytrainings{
            name
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

export const getAllTraining = (payload, next, nextErr) => {
  const { keySearch, startItemPage, itemPerPage, categoryId } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings?${
        categoryId !== "" ? `categorytrainings._id=${categoryId}&` : ``
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }_start=${startItemPage}&_limit=${itemPerPage}`,
      beforeCallType: "GET_ALL_TRAINING_REQUEST",
      successType: "GET_ALL_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getAllCategory = (payload, next, nextErr) => {
  return {
    type: SINGLE_API,
    payload: {
      uri: `categorytrainings`,
      beforeCallType: "GET_ALL_CATEGORY_REQUEST",
      successType: "GET_ALL_CATEGORY_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const addToMyTraining = (payload, next, nextErr) => {
  const { training, user } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `activityusers`,
      beforeCallType: "ADD_TRAINING_REQUEST",
      successType: "ADD_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        user,
        training,
        totalMark: 0,
        courses: []
      }
    }
  };
};

export const getTrainingToLearn = (payload, next, nextErr) => {
  const { keySearch, startItemPage, itemPerPage, userId, categoryId } = payload;
  return {
    type: GRAPHQL,
    payload: {
      query: `{
        trainings(
          where: 
          {
            activityusers:
            {
              user:
              {
                _id:"${userId}"
              }
            },
            ${
              categoryId !== ""
                ? `categorytrainings:{_id:"${categoryId}",}`
                : ``
            }
            ${keySearch !== "" ? `name_contains:"${keySearch}",` : ``}
          },
          limit: ${itemPerPage},
          start: ${startItemPage} 
        )
        {
          _id
          name
          description
          level
          createdAt
          thumbnail{
            url
            name
            ext
          }
          users{
            firstName
            lastName
            _id
          }
          activityusers{
            _id
            courses
            totalMark
            user{
              _id
            }
          }
          learningpaths{
            markForCourse
            position
          }
        }
      }`,
      beforeCallType: "GET_TRAINING_LEARN_REQUEST",
      successType: "GET_TRAINING_LEARN_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const updateActivity = (payload, next, nextErr) => {
  const { id, courses, totalMark } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `activityusers/${id}`,
      beforeCallType: "UPDATE_ACTIVITY_REQUEST",
      successType: "UPDATE_ACTIVITY_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        courses,
        totalMark
      }
    }
  };
};

export const deleteTraining = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings/${id}`,
      beforeCallType: "DELETE_TRAINING_REQUEST",
      successType: "DELETE_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "DELETE"
      }
    }
  };
};

export const updateTraining = (payload, next, nextErr) => {
  const { id, name, level } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `trainings/${id}`,
      beforeCallType: "UPDATE_TRAINING_REQUEST",
      successType: "UPDATE_TRAINING_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        name,
        level
      }
    }
  };
};
