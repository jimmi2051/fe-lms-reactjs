const API_URL = process.env.REACT_APP_URL_API;
export const UploadFile = data => {
  return fetch(`${API_URL}upload`, {
    method: "POST",
    headers: {},
    body: data,
    cache: "no-cache"
  });
};
