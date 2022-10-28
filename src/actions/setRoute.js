import { ROUTE_TYPES } from "../App/types/route.types";
import { createAction } from "../utils/createAction";

export const setRoute = (route) => createAction(ROUTE_TYPES.SET_ROUTE, route);
