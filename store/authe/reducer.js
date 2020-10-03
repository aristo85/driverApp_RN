import { CHECK_AUTHENTICATE, GET_DRIVER_RATING, LOGOUT } from "./actions";

const initialState = {
  token: null,
  userId: null,
  phoneNumber: null,
  rating: null,
  userName: null,
};

const AuthReducer = (state = initialState, actions) => {
  switch (actions.type) {
    case CHECK_AUTHENTICATE:
      const { token, userId, phoneNumber, rating, userName } = actions;
      return { ...state, token, userId, phoneNumber, rating, userName };

      case GET_DRIVER_RATING:
      return { ...state, rating: actions.data };

    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default AuthReducer;
