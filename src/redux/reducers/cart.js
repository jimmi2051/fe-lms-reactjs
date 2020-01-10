import _ from "lodash";
export const initialState = {
  cart: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { training, next, nextErr } = action.payload;
      const idxTraining = _.findIndex(
        initialState.cart,
        cartItem => cartItem._id === training._id
      );
      let tempCart = initialState.cart;
      if (idxTraining === -1) {
        tempCart.push(training);
        if (typeof next === "function") {
          next();
        }
      }
      else {
        if (typeof nextErr === "function") {
          nextErr();
        }
      }
      // Process Local Storage
      let localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart === null) {
        localCart = [training];
      }
      else {
        const idxTrainingLocal = _.findIndex(localCart, item => item._id === training._id);
        if (idxTrainingLocal === -1) {
          localCart.push(training);
        }
      }
      localStorage.setItem("cart", JSON.stringify(localCart));

      return {
        ...state,
        cart: [...tempCart]
      };
    }
    case "REMOVE_CART": {
      const { training } = action.payload;
      const idxTraining = _.findIndex(
        initialState.cart,
        cartItem => cartItem._id === training._id
      );
      let tempCart = initialState.cart;
      if (idxTraining > -1) {
        tempCart.splice(idxTraining, 1);
      }

      // Process Local Storage
      let localCart = JSON.parse(localStorage.getItem("cart"));
      if (localCart !== null) {
        const idxTrainingLocal = _.findIndex(localCart, item => item._id === training._id);
        if (idxTrainingLocal > -1) {
          localCart.splice(idxTraining, 1);
          localStorage.setItem("cart", JSON.stringify(localCart));
        }
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
