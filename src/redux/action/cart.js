export const addToCart = (payload, next, nextErr) => {
  return {
    type: "ADD_TO_CART",
    payload
  };
};
