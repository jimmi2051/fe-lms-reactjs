/**
 * @author Thanh Ly
 */
import { SINGLE_API } from "./type";

export const getContent = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents?users._id=${id}`,
      beforeCallType: "GET_CONTENT_REQUEST",
      successType: "GET_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const getContentByModule = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents?modules._id=${id}`,
      beforeCallType: "GET_CONTENT_BY_MODULE_REQUEST",
      successType: "GET_CONTENT_BY_MODULE_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const updateContent = (payload, next, nextErr) => {
  const { id, modules } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents/${id}`,
      beforeCallType: "UPDATE_CONTENT_REQUEST",
      successType: "UPDATE_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        modules
      }
    }
  };
};

export const createContent = (payload, next, nextErr) => {
  const { name, type, user } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents`,
      beforeCallType: "CREATE_CONTENT_REQUEST",
      successType: "CREATE_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        name,
        type,
        users: [user]
      }
    }
  };
};

export const createData = (payload, next, nextErr) => {
  const { data, content } = payload;
  const struct = {};
  const media = {};
  return {
    type: SINGLE_API,
    payload: {
      uri: `data`,
      beforeCallType: "CREATE_DATA_REQUEST",
      successType: "CREATE_DATA_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "POST"
      },
      params: {
        data,
        struct,
        content,
        media
      }
    }
  };
};

export const getListContent = (payload, next, nextErr) => {
  const { id, keySearch, startItemPage, itemPerPage, moduleId = "" } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents?users._id=${id}&${
        moduleId !== "" ? `modules._id=${moduleId}&` : ""
      }${
        keySearch !== "" ? `name_contains=${keySearch}&` : ``
      }_start=${startItemPage}&_limit=${itemPerPage}`,
      beforeCallType: "GET_LIST_CONTENT_REQUEST",
      successType: "GET_LIST_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr
    }
  };
};

export const deleteContent = (payload, next, nextErr) => {
  const { id } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents/${id}`,
      beforeCallType: "DELETE_CONTENT_REQUEST",
      successType: "DELETE_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "DELETE"
      }
    }
  };
};

export const updateContentVer2 = (payload, next, nextErr) => {
  const { id, name } = payload;
  return {
    type: SINGLE_API,
    payload: {
      uri: `contents/${id}`,
      beforeCallType: "UPDATE_NAME_CONTENT_REQUEST",
      successType: "UPDATE_NAME_CONTENT_SUCCESS",
      afterSuccess: next,
      afterError: nextErr,
      opt: {
        method: "PUT"
      },
      params: {
        name
      }
    }
  };
};
