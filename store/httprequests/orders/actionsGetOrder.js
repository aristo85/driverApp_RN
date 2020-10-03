import Axios from "axios";
import { envKey } from "../../../config/key";

export const ON_GET_ORDER = "ON_ORDER";
export const SAVE_EXECUTE_ORDER = "SAVE_EXECUTE_ORDER";

//************************************************************************ */
// Rating the client behaviour
export const onRateClient = (rateNumber) => {
  return async (dispatch, getState) => {
    const orderLoader = getState().OrderLoaderReducer.orderLoader;
    try {
      const response = await Axios.put(
        `${envKey.URL}/api/driverRateTheClient/${orderLoader.userId}`,
        { rateNumber }
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }
    } catch (err) {
      // console.log(err);
      throw err;
    }
  };
};
//************************************************************************ */
// save finished order to DB history
export const onSaveExecutedOrder = () => {
  return async (dispatch, getState) => {
    const orderLoader = getState().OrderLoaderReducer.orderLoader;
    const userId = getState().OrderLoaderReducer.userId;
    const orderedDate = new Date().toLocaleString();

    try {
      const response = await Axios.put(
        `${envKey.URL}/api/driverOrderHistory/${userId}`,
        { orderLoader, orderedDate }
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }

      const data = await response.data;
      // console.log(data)
      dispatch({
        type: SAVE_EXECUTE_ORDER,
        dataInputs: { orderLoader, orderedDate, id: data._id },
      });
    } catch (err) {
      // console.log(err)
      throw err;
    }
  };
};

//************************************************************************ */
//************************************************************************ */
//************************************************************************ */

export const onGetOrder = () => {
  return async (dispatch, getState) => {
    const myLocation = getState().SharReducer.userLocation;
    const orderedDate = new Date().toLocaleString();
    const userId = getState().OrderLoaderReducer.userId;

    try {
      const response = await Axios.put(
        `${envKey.URL}/api/driverOpenToOrder/${userId}`,
        { myLocation, orderedDate }
      );

      if (!response.data.success) {
        throw new Error("something wrong with the server api");
      }

      const data = await response.data;
      dispatch({
        type: ON_GET_ORDER,
        dataInputs: { myLocation, orderedDate, id: data.name },
      });
    } catch (err) {
      throw err;
    }
  };
};
