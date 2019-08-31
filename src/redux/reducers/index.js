import user, { initialState as initUser } from "./user";
import registerUser, { initialState as initRegisterUser } from "./user";
import auth, { initialState as initialAuth } from "./auth";
export const exampleInitialState = {
  user: initUser,
  auth: initialAuth,
  registerUser: initRegisterUser
};

export default {
  user,
  auth,
  registerUser
};
