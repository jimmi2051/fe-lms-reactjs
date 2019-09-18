export const UploadFile = data => {
  return fetch("https://be-lms.herokuapp.com/upload", {
    method: "POST",
    headers: {},
    body: data,
    cache: "no-cache"
  });
};
