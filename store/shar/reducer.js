import { GET_USER_LOCATION } from "./actoins";

const initialState = {
  userLocation: { lat: 0, lng: 0 },
};

export const SharReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_LOCATION:
      const { lat, lng } = action;
      return {
        ...state,
        userLocation: {
          lat,
          lng,
        },
      };
    default:
      return state;
  }
};
