import _ from "lodash";
export const initialState = {
  cart: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { training } = action.payload;
      const idxTraining = _.findIndex(
        initialState.cart,
        cartItem => cartItem._id === training._id
      );
      let tempCart = initialState.cart;
      if (idxTraining === -1) {
        tempCart.push(training);
      }
      return {
        ...state,
        cart: [...tempCart]
      };
    }
    default:
      return state;
  }
};
