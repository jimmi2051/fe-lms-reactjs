export const UploadFile = data => {
  return fetch("http://35.224.2.121:8080/upload", {
    method: "POST",
    headers: {},
    body: data,
    cache: "no-cache"
  });
};
