import user, { initialState as initUser } from "./user";
import registerUser, { initialState as initRegisterUser } from "./user";
import auth, { initialState as initialAuth } from "./auth";
import roles, { initialState as initRoles } from "./user";
export const exampleInitialState = {
  user: initUser,
  auth: initialAuth,
  registerUser: initRegisterUser,
  roles: initRoles
};

export default {
  user,
  auth,
  registerUser,
  roles
};
