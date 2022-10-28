import { ROUTE_TYPES } from "../App/types/route.types";

const INITIAL_STATE = {
  route: "Transactions",
};

export const RouteReducer = (state = INITIAL_STATE, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case ROUTE_TYPES.SET_ROUTE:
      return { ...state, route: payload };
    default:
      return { ...state };
  }
};
