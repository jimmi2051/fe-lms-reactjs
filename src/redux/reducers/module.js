export const initialState = {
  isCreatedModule: {
    data: {},
    loading: true
  },
  listModule: {
    data: {},
    loading: true
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "CREATE_MODULE_REQUEST":
      return {
        ...state,
        isCreatedModule: { ...initialState.isCreatedModule }
      };
    case "CREATE_MODULE_SUCCESS":
      return {
        ...state,
        isCreatedModule: { data: action.payload, loading: false }
      };
    case "GET_MODULE_REQUEST":
      return { ...state, listModule: { ...initialState.listModule } };
    case "GET_MODULE_SUCCESS":
      return { ...state, listModule: { data: action.payload, loading: false } };
    default:
      return state;
  }
};
