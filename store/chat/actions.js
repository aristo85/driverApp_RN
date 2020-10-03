import Axios from "axios";
import { envKey } from "../../config/key";

export const UPDATE_CLIENT_MESSAGES = "UPDATE_CLIENT_MESSAGES";
export const UPDATE_DRIVER_MESSAGES = "UPDATE_DRIVER_MESSAGES";
export const CHAT_UPDATE = "CHAT_UPDATE";
export const RESET_BADGE_COUNTER = "RESET_BADGE_COUNTER";

//************************************************************************ */
export const onBadgeReset = (msg) => {
  return (dispatch) => {
    dispatch({ type: RESET_BADGE_COUNTER });
  };
};

//************************************************************************ */
export const onChatUpdate = (data) => {
  return async (dispatch, getState) => {
    const messageList = getState().ChatReducer.messageList;
    const driverId = getState().OrderLoaderReducer.userId;
    if (data.length > messageList.length) {
      try {
        // get the data state from the DB
        const response = await Axios.get(
          `${envKey.URL}/api/getDriverState/${driverId}`
        );

        if (!response.data.success) {
          throw new Error("something wrong with the server api");
        }
        // refresh the driver states based on pending(how many emit been missed)
        const chat = response.data.data.messageList;
        dispatch({ type: CHAT_UPDATE, data: chat });
      } catch (err) {
        // console.log(err);
        throw err;
      }
    }
  };
};

//************************************************************************ */
export const onRecieveMsg = (msg) => {
  return (dispatch) => {
    dispatch({
      type: UPDATE_CLIENT_MESSAGES,
      data: msg,
      date: `${new Date().getHours()}:${new Date().getMinutes()}`,
    });
  };
};

//************************************************************************ */
export const onSubmit = (msg) => {
  return (dispatch, getState) => {
    const driverId = getState().OrderLoaderReducer.userId;
    const driver = getState().OrderLoaderReducer.driver;
    const orderLoader = getState().OrderLoaderReducer.orderLoader;
    // emit to server
    driver.emit("driverMsg", {
      room: orderLoader.userId,
      message: msg,
      driverId,
    });

    dispatch({
      type: UPDATE_DRIVER_MESSAGES,
      data: msg,
      date: `${new Date().getHours()}:${new Date().getMinutes()}`,
    });
  };
};
