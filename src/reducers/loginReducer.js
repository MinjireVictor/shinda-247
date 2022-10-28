import { LOGIN_TYPES } from "../App/types/login.types";

const INITIAL_STATE = {
  loginClicked: false,
  isLoggedIn: false,
};

export const LoginReducer = (state = INITIAL_STATE, action = {}) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_TYPES.LOGIN_CLICKED:
      return { ...state, loginClicked: true };
    case LOGIN_TYPES.LOGIN_CLOSED:
      return { ...state, loginClicked: false };
    case LOGIN_TYPES.IS_LOGGED_IN:
      return { ...state, isLoggedIn: payload };
    default:
      return state;
  }
};
