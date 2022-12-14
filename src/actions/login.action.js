import { LOGIN_TYPES } from "../App/types/login.types";

import { createAction } from "../../src/utils/createAction";

export const onLoginClicked = () => createAction(LOGIN_TYPES.LOGIN_CLICKED);

export const onLoginClosed = () => createAction(LOGIN_TYPES.LOGIN_CLOSED);

export const isLoggedIn = (payload) =>
  createAction(LOGIN_TYPES.IS_LOGGED_IN, payload);
