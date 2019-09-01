export const initialState = {
  user: {
    data: {},
    loading: true
  },
  registerUser: {
    data: {},
    loading: true
  },
  roles: {
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
    case "REGISTER_USER_REQUEST":
      return { ...state, registerUser: { ...initialState.registerUser } };
    case "REGISTER_USER_SUCCESS":
      return {
        ...state,
        registerUser: { data: action.payload, loading: false }
      };
    case "GET_ROLES_REQUEST":
      return { ...state, roles: { ...initialState.roles } };
    case "GET_ROLES_SUCCESS":
      return { ...state, roles: { data: action.payload, loading: false } };
    default:
      return state;
  }
};
