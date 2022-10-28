import { combineReducers } from "redux";
import socketReducer from "./socketReducer";
import { LoginReducer } from "./loginReducer";
import { RouteReducer } from "./routeReducer";

export default combineReducers({
  items: socketReducer,
  login: LoginReducer,
  route: RouteReducer,
});
