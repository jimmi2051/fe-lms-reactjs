export const initialState = {
  user: {
    data: {},
    loading: true
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_USER_INFO_REQUEST":
      return { ...state, user: { ...initialState.user } };
    case "GET_USER_INFO_SUCCESS":
      return { ...state, user: { data: action.payload, loading: false } };
    default:
      return state;
  }
};
