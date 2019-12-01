export const initialState = {
  isCreatedModule: {
    data: {},
    loading: true
  },
  listModule: {
    data: {},
    loading: true
  },
  listModuleByUser: {
    data: {},
    loading: true
  },
  filterModuleByCourse: {
    data: {},
    loading: true
  },
  listModulePaging: {
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
    case "GET_MODULE_BY_USER_REQUEST":
      return {
        ...state,
        listModuleByUser: { ...initialState.listModuleByUser }
      };
    case "GET_MODULE_BY_USER_SUCCESS":
      return {
        ...state,
        listModuleByUser: { data: action.payload, loading: false }
      };
    case "FILTER_MODULE_BY_COURSE_REQUEST":
      return {
        ...state,
        filterModuleByCourse: { ...initialState.filterModuleByCourse }
      };
    case "FILTER_MODULE_BY_COURSE_SUCCESS":
      return {
        ...state,
        filterModuleByCourse: { data: action.payload, loading: false }
      };
    case "GET_LIST_MODULE_REQUEST":
      return {
        ...state,
        listModulePaging: { ...initialState.listModulePaging }
      };
    case "GET_LIST_MODULE_SUCCESS":
      return {
        ...state,
        listModulePaging: { data: action.payload, loading: false }
      };
    default:
      return state;
  }
};
