export const addToCart = (payload, next, nextErr) => {
  payload.next = next;
  payload.nextErr = nextErr;
  return {
    type: "ADD_TO_CART",
    payload
  };
};

export const removeCart = (payload, next, nextErr) => {
  return {
    type: "REMOVE_CART",
    payload
  }
}