import Axios from "axios";
import { AsyncStorage } from "react-native";
import { envKey } from "../../config/key";

export const CHECK_AUTHENTICATE = "CHECK_AUTHENTICATE";
export const SET_USER_ID = "SET_USER_ID";
export const LOGOUT = "LOGOUT";
export const GET_DRIVER_RATING = "GET_DRIVER_RATING";

//************************************************************************ */
// getting the driver rating if user is autoLogin, to get the most updated
export const getDriverRating = (data) => {
  return async (dispatch, getState) => {
    const driverId = getState().OrderLoaderReducer.userId;

    try {
      // get the driver rating from the DB
      const response = await Axios.get(
        `${envKey.URL}/api/getDriverRating/${driverId}`
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }
      // refresh the driver rating based on pending(how many emit been missed)
      const data = response.data.data;
      dispatch({ type: GET_DRIVER_RATING, data });
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
};
//************************************************************************ */
//authentication action creator
export const authentication = (
  token,
  userId,
  phoneNumber,
  rating,
  userName
) => {
  return (dispatch) => {
    dispatch({ type: SET_USER_ID, userId });
    dispatch({
      type: CHECK_AUTHENTICATE,
      token,
      userId,
      phoneNumber,
      rating,
      userName,
    });
  };
};
//******************************************************************************************* */
export const singupUser = (authData) => {
  return async (dispatch) => {
    try {
      const response = await Axios.post(
        `${envKey.URL}/api/driver/register`,
        authData
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const data = response.data;
      const { shar_auth, userId, phoneNumber, rating, userName } = data;
      dispatch(
        authentication(shar_auth, userId, phoneNumber, rating, userName)
      );
      //after signingup saving data in device storage
      saveDatatOnDevice(shar_auth, userId, phoneNumber, rating, userName);
    } catch (err) {
      throw err;
    }
  };
};
//******************************************************************************************* */
export const loginUser = (authData) => {
  return async (dispatch) => {
    try {
      const response = await Axios.post(
        `${envKey.URL}/api/driver/login`,
        authData
      );
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      const data = response.data;
      const { shar_auth, userId, phoneNumber, rating, userName } = data;
      dispatch(
        authentication(shar_auth, userId, phoneNumber, rating, userName)
      );
      //after signingup saving data in device storage
      saveDatatOnDevice(shar_auth, userId, phoneNumber, rating, userName);
    } catch (err) {
      throw err;
    }
  };
};
//******************************************************************************************* */
//logout action creator
export const logOut = () => {
  return async (dispatch, getState) => {
    const token = getState().AuthReducer.token;
    dispatch({ type: LOGOUT });
    try {
      const response = await Axios.get(`${envKey.URL}/api/driver/logout`, {
        headers: {
          Authorization: token,
        },
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      // clearTimeoutTimer();
      AsyncStorage.removeItem("authData");
    } catch (err) {
      throw err;
    }
  };
};
//******************************************************************************************* */
//saving data on device locally with 'AsyncStorage'
const saveDatatOnDevice = (token, userId, phoneNumber, rating, userName) => {
  AsyncStorage.setItem(
    "authData",
    JSON.stringify({ token, userId, phoneNumber, rating, userName })
  );
};
//******************************************************************************************* */
