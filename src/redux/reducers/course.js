export const initialState = {
  isCreatedCourse: {
    data: {},
    loading: true
  },
  listCourse: {
    data: {},
    loading: true
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_COURSE_REQUEST":
      return {
        ...state,
        isCreatedCourse: { ...initialState.isCreatedCourse }
      };
    case "CREATE_COURSE_SUCCESS":
      return {
        ...state,
        isCreatedCourse: { data: action.payload, loading: false }
      };
    case "GET_COURSE_REQUEST":
      return { ...state, listCourse: { ...initialState.listCourse } };
    case "GET_COURSE_SUCCESS":
      return { ...state, listCourse: { data: action.payload, loading: false } };
    default:
      return state;
  }
};
