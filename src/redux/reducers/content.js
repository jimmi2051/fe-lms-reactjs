export const initialState = {
  listContent: {
    data: {},
    loading: true
  },
  listContentByModule: {
    data: {},
    loading: true
  },
  isCreateContent: {
    data: {},
    loading: true
  },
  isCreateData: {
    data: {},
    loading: true
  },
  listContentPaging: {
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
    case "CREATE_CONTENT_REQUEST":
      return {
        ...state,
        isCreateContent: { ...initialState.isCreateContent }
      };
    case "CREATE_CONTENT_SUCCESS":
      return {
        ...state,
        isCreateContent: { data: action.payload, loading: false }
      };
    case "CREATE_DATA_REQUEST":
      return {
        ...state,
        isCreateData: { ...initialState.isCreateData }
      };
    case "CREATE_DATA_SUCCESS":
      return {
        ...state,
        isCreateData: { data: action.payload, loading: false }
      };
    case "GET_LIST_CONTENT_REQUEST":
      return {
        ...state,
        listContentPaging: { ...initialState.listContentPaging }
      };
    case "GET_LIST_CONTENT_SUCCESS":
      return {
        ...state,
        listContentPaging: { data: action.payload, loading: false }
      };
    default:
      return state;
  }
};
