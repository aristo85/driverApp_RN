import { CHOOSE_CITY, SET_APP_STATE } from "./actions";

const initialState = {
  city: "Томск",
  appState: null,
};

export const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_CITY:
      return { ...state, city: action.data };

    case SET_APP_STATE:
      return { ...state, appState: action.data };

    default:
      return state;
  }
};
