import Axios from "axios";
import { envKey } from "../../config/key";
import { CHAT_UPDATE } from "../chat/actions";

export const ORDER_LOADER = "ORDER_LOADER";
export const PICKED_CLIENT = "PICKED_CLIENT";
export const ORDER_EXECUTION = "ORDER_EXECUTION";
export const ORDER_ACCEPTED = "ORDER_ACCEPTED";
export const DRIVER_ARRIVED = "DRIVER_ARRIVED";
export const SET_DESTANCE_DURATION = "SET_DESTANCE_DURATION";
export const Driver_IS_WAITING = "Driver_IS_WAITING";
export const HANDLE_SWITCH = "HANDLE_SWITCH";
export const USER_IS_COMING = "USER_IS_COMING";
export const RESET_STORE = "RESET_STORE";
export const SET_IO = "SET_IO";
export const SET_RECONNECTION = "SET_RECONNECTION";
export const SET_SPINER = "SET_SPINER";
export const ORDER_COUNTER = "ORDER_COUNTER";
export const ClIENT_CANCEL_ALERT = "ClIENT_CANCEL_ALERT";
export const START_TIME_DRIVER_WAITING = "START_TIME_DRIVER_WAITING";
export const CLIENT_LATE_PENALTY = "CLIENT_LATE_PENALTY";

//************************************************************************ */

export const onClientBelatePenalty = (data) => {
  return (dispatch) => {
    dispatch({
      type: CLIENT_LATE_PENALTY,
      data,
    });
  };
};
//************************************************************************ */

export const onSetTimeForWaiting = (data) => {
  return (dispatch) => {
    dispatch({
      type: START_TIME_DRIVER_WAITING,
      data,
    });
  };
};
//************************************************************************ */
export const onClientCancelAlert = (data) => {
  return (dispatch) => {
    dispatch({
      type: ClIENT_CANCEL_ALERT,
      data,
    });
  };
};
//************************************************************************ */
export const getAppState = () => {
  return async (dispatch, getState) => {
    const driverId = getState().OrderLoaderReducer.userId;
    // console.log(driverId)
    const driverStateOptions = [
      { state: "orderLoader", type: ORDER_LOADER },
      { state: "isOrderAccepted", type: ORDER_ACCEPTED },
      { state: "isDriverWaiting", type: Driver_IS_WAITING },
      { state: "isUserComing", type: USER_IS_COMING },
      { state: "pickedClient", type: PICKED_CLIENT },
      { state: "messageList", type: CHAT_UPDATE },
    ];
    try {
      // get the data state from the DB
      const response = await Axios.get(
        `${envKey.URL}/api/getDriverState/${driverId}`
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }
      // refresh the driver states based on DB
      const driverState = response.data.data;
      // console.log(driverState);
      if (driverState) {
        if (driverState.orderLoader) {
          dispatch(onReconnection("fromDB"));
          driverStateOptions.forEach((obj) => {
            if (driverState[obj.state]) {
              dispatch({
                type: obj.type,
                data: driverState[obj.state],
              });
            }
          });
          if (driverState.isDriverWaiting && !driverState.pickedClient) {
            dispatch({
              type: START_TIME_DRIVER_WAITING,
              data: driverState.orderDate,
            });
          }
          dispatch(onToggleSwitch(true));
        } else {
          await Axios.delete(
            `${envKey.URL}/api/deleteOrderStates/${null}/${driverId}`
          );
        }
      }
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };
};
//************************************************************************ */
export const onOrderTimeout = (data) => {
  return (dispatch) => {
    dispatch({
      type: ORDER_COUNTER,
      data,
    });
  };
};
//************************************************************************ */
export const onSetSpiner = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_SPINER,
      data,
    });
  };
};
//************************************************************************ */
export const onSetStateBackground = (data) => {
  return async (dispatch, getState) => {
    const driverId = getState().OrderLoaderReducer.userId;
    const driverStateOptions = [
      { state: "orderLoader", type: ORDER_LOADER },
      { state: "isOrderAccepted", type: ORDER_ACCEPTED },
      { state: "isDriverWaiting", type: Driver_IS_WAITING },
      { state: "isUserComing", type: USER_IS_COMING },
      { state: "pickedClient", type: PICKED_CLIENT },
      { state: "messageList", type: CHAT_UPDATE },
    ];
    try {
      // get the data state from the DB
      const response = await Axios.get(
        `${envKey.URL}/api/getDriverState/${driverId}`
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }
      // refresh the driver states based on pending(how many emit been missed)
      const driverState = response.data.data;
      driverStateOptions.forEach((obj) => {
        if (
          Object.keys(driverState).findIndex((item) => item === obj.state) >= 0
        ) {
          dispatch({
            type: obj.type,
            data: driverState[obj.state],
          });
        }
      });
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };
};
//************************************************************************ */
export const onReconnection = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_RECONNECTION,
      data,
    });
  };
};
//************************************************************************ */
export const onSetIO = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_IO,
      data,
    });
  };
};
//************************************************************************ */
export const onResetStore = (data) => {
  return (dispatch) => {
    dispatch({
      type: RESET_STORE,
    });
  };
};
//************************************************************************ */
export const onUserComing = (data) => {
  return (dispatch) => {
    dispatch({
      type: USER_IS_COMING,
      data,
    });
  };
};
//************************************************************************ */
// delete the driver state order on DB on switching off the switch
export const onToggleSwitch = (data) => {
  // if on switch-on
  if (data) {
    return (dispatch) => {
      dispatch({
        type: HANDLE_SWITCH,
        data,
      });
    };
  }
  // else switch-off
  return async (dispatch, getState) => {
    const driverId = getState().OrderLoaderReducer.userId;
    const driver = getState().OrderLoaderReducer.driver;
    const orderLoader = getState().OrderLoaderReducer.orderLoader;
    try {
      // if the order already arrived, then the client should search again
      driver.emit("switched off", {
        clientData: orderLoader ? orderLoader : null,
        driverId,
      });
      const response = await Axios.delete(
        `${envKey.URL}/api/deleteOrderStates/${null}/${driverId}`
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }

      dispatch({
        type: HANDLE_SWITCH,
        data,
      });
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };
};
//************************************************************************ */
export const onDriverWaiting = (data) => {
  return (dispatch) => {
    dispatch({
      type: Driver_IS_WAITING,
      data,
    });
  };
};
//************************************************************************ */
export const onSetDistanceAndDuration = (data) => {
  return (dispatch) => {
    dispatch({
      type: SET_DESTANCE_DURATION,
      data,
    });
  };
};
//************************************************************************ */
export const onDriverArrived = (data) => {
  return (dispatch) => {
    dispatch({
      type: DRIVER_ARRIVED,
      data,
    });
  };
};
//************************************************************************ */
export const onOrderAccepted = (data) => {
  return (dispatch) => {
    dispatch({
      type: ORDER_ACCEPTED,
      data,
    });
  };
};
//************************************************************************ */
export const onOrderExecution = () => {
  return (dispatch) => {
    dispatch({
      type: ORDER_EXECUTION,
    });
  };
};
//************************************************************************ */
export const onPickedClient = (data) => {
  return (dispatch) => {
    dispatch({
      type: PICKED_CLIENT,
      data,
    });
  };
};
//************************************************************************ */
export const onOrderLoader = (data) => {
  return (dispatch) => {
    dispatch({
      type: ORDER_LOADER,
      data,
    });
  };
};
