export const CHOOSE_CITY = "CHOOSE_CITY";
export const SET_APP_STATE = "SET_APP_STATE";

export const onSetAppState = (data) => {
  return (dispatch) => {
    dispatch({ type: SET_APP_STATE, data });
  };
};

export const chooseCity = (data) => {
  return (dispatch) => {
    dispatch({ type: CHOOSE_CITY, data });
  };
};
