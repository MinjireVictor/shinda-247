import { useDispatch } from "react-redux";
import { onLoginClosed, isLoggedIn } from "../../actions/login.action";
import { LOGIN_TYPES } from "../types/login.types";

export const Dispatcher = (type, payload, status) => {
  const dispatch = useDispatch();
  switch (type) {
    case LOGIN_TYPES.LOGIN_CLOSED:
      dispatch(onLoginClosed());
      break;
    case LOGIN_TYPES.IS_LOGGED_IN:
      switch (status) {
        case "Successfully Login, Please Wait...":
          dispatch(isLoggedIn(LOGIN_TYPES.IS_LOGGED_IN, payload));
          break;
        default:
      }

      break;

    default:
      break;
  }
};
