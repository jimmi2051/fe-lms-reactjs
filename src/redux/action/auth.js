/**
 * @author Tran Trung
 * @copyright 06/06/2019 Kyanon Digital
 */
// import AuthStorage from 'src/utils/AuthStorage';

export function loginRequest(payload, next, nextErr) {
  return {
    type: "LOGIN_REQUEST",
    payload,
    next,
    nextErr
  };
}

export function logoutRequest(next) {
  return {
    type: "LOGOUT_REQUEST",
    next
  };
}
