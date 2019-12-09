export const initialState = {
  isCreatedTraining: {
    data: {},
    loading: true
  },
  isCreatedLearningPath: {
    data: {},
    loading: true
  },
  listTraining: {
    data: {},
    loading: true
  },
  training: {
    data: {},
    loading: true
  },
  trainingByCat: {
    data: {},
    loading: true
  },
  trainingAll: {
    data: {},
    loading: true
  },
  categoryAll: {
    data: {},
    loading: true
  },
  isAddTraining: {
    data: {},
    loading: false
  },
  listTrainingLearn: {
    data: {},
    loading: false
  },
  isUpdateActivity: {
    data: {},
    loading: false
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_TRAINING_REQUEST":
      return {
        ...state,
        isCreatedTraining: { ...initialState.isCreatedTraining }
      };
    case "CREATE_TRAINING_SUCCESS":
      return {
        ...state,
        isCreatedTraining: { data: action.payload, loading: false }
      };
    case "ADD_LEARNING_PATH_REQUEST":
      return {
        ...state,
        isCreatedLearningPath: { ...initialState.isCreatedLearningPath }
      };
    case "ADD_LEARNING_PATH_SUCCESS":
      return {
        ...state,
        isCreatedLearningPath: { data: action.payload, loading: false }
      };
    case "GET_TRAINING_BY_REQUEST":
      return {
        ...state,
        listTraining: { ...initialState.listTraining }
      };
    case "GET_TRAINING_BY_SUCCESS":
      let result = action.payload;
      if (result.error) {
        result = [];
      }
      return {
        ...state,
        listTraining: { data: result, loading: false }
      };
    case "GET_TRAINING_BY_ID_REQUEST":
      return {
        ...state,
        training: { ...initialState.training }
      };
    case "GET_TRAINING_BY_ID_SUCCESS":
      return {
        ...state,
        training: { data: action.payload, loading: false }
      };
    case "GET_TRAINING_BY_CAT_REQUEST":
      return {
        ...state,
        trainingByCat: { ...initialState.trainingByCat }
      };
    case "GET_TRAINING_BY_CAT_SUCCESS":
      return {
        ...state,
        trainingByCat: { data: action.payload, loading: false }
      };
    case "GET_ALL_TRAINING_REQUEST":
      return {
        ...state,
        trainingAll: { ...initialState.trainingAll }
      };
    case "GET_ALL_TRAINING_SUCCESS": {
      let result = action.payload;
      if (result.error) {
        result = [];
      }
      return {
        ...state,
        trainingAll: { data: result, loading: false }
      };
    }
    case "GET_ALL_CATEGORY_REQUEST":
      return {
        ...state,
        categoryAll: { ...initialState.categoryAll }
      };
    case "GET_ALL_CATEGORY_SUCCESS":
      return {
        ...state,
        categoryAll: { data: action.payload, loading: false }
      };
    case "ADD_TRAINING_REQUEST":
      return {
        ...state,
        isAddTraining: { ...initialState.isAddTraining }
      };
    case "ADD_TRAINING_SUCCESS":
      return {
        ...state,
        isAddTraining: { data: action.payload, loading: false }
      };
    case "GET_TRAINING_LEARN_REQUEST":
      return {
        ...state,
        listTrainingLearn: { ...initialState.listTrainingLearn }
      };
    case "GET_TRAINING_LEARN_SUCCESS": {
      let result = action.payload;
      if (result.error) {
        result = [];
      }
      return {
        ...state,
        listTrainingLearn: { data: result, loading: false }
      };
    }
    case "UPDATE_ACTIVITY_REQUEST":
      return {
        ...state,
        isUpdateActivity: { ...initialState.isUpdateActivity }
      };
    case "UPDATE_ACTIVITY_SUCCESS": {
      return {
        ...state,
        isUpdateActivity: { data: action.payload, loading: false }
      };
    }
    default:
      return state;
  }
};
