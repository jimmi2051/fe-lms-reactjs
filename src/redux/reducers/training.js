export const initialState = {
  isCreatedTraining: {
    data: {},
    loading: true
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
    default:
      return state;
  }
};
