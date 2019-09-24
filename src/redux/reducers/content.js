export const initialState = {
  listContent: {
    data: {},
    loading: true
  },
  listContentByModule: {
    data: {},
    loading: true
  }
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "GET_CONTENT_REQUEST":
      return {
        ...state,
        listContent: { ...initialState.listContent }
      };
    case "GET_CONTENT_SUCCESS":
      return {
        ...state,
        listContent: { data: action.payload, loading: false }
      };
    case "GET_CONTENT_BY_MODULE_REQUEST":
      return {
        ...state,
        listContentByModule: { ...initialState.listContentByModule }
      };
    case "GET_CONTENT_BY_MODULE_SUCCESS":
      return {
        ...state,
        listContentByModule: { data: action.payload, loading: false }
      };
    default:
      return state;
  }
};
