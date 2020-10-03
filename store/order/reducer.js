import { SET_USER_ID } from "../authe/actions";
import {
  ORDER_LOADER,
  PICKED_CLIENT,
  ORDER_EXECUTION,
  ORDER_ACCEPTED,
  DRIVER_ARRIVED,
  SET_DESTANCE_DURATION,
  Driver_IS_WAITING,
  HANDLE_SWITCH,
  USER_IS_COMING,
  RESET_STORE,
  SET_IO,
  SET_RECONNECTION,
  SET_SPINER,
  ORDER_COUNTER,
  ClIENT_CANCEL_ALERT,
  START_TIME_DRIVER_WAITING,
  CLIENT_LATE_PENALTY,
} from "./actions";

const initialState = {
  isSwitch: false,
  driver: null,
  distanceAndDuration: { distance: null, duration: null },
  orderLoader: null,
  isOrderAccepted: null,
  isDriverArrived: null,
  isDriverWaiting: null,
  isUserComing: null,
  pickedClient: null,
  isOrderExecuted: null,
  isReconnecting: null,
  userId: null,
  isSpiner: null,
  orderCounter: 0,
  isClientCanceled: null,
  setedWatingTime: null,
  clientBelatePenalty: null,
};

export const OrderLoaderReducer = (state = initialState, action) => {
  switch (action.type) {
    case HANDLE_SWITCH:
      // if the switch is off then reset all states to init
      return action.data
        ? { ...state, isSwitch: action.data }
        : {
            ...state,
            isSwitch: false,
            driver: null,
            distanceAndDuration: { distance: null, duration: null },
            orderLoader: null,
            isOrderAccepted: null,
            isDriverArrived: null,
            isDriverWaiting: null,
            isUserComing: null,
            pickedClient: null,
            isOrderExecuted: null,
            isReconnecting: null,
            isSpiner: null,
            orderCounter: 0,
            isClientCanceled: null,
            setedWatingTime: null,
            clientBelatePenalty: null,
          };

    case CLIENT_LATE_PENALTY:
      return { ...state, clientBelatePenalty: action.data };

    case SET_USER_ID:
      return { ...state, userId: action.userId };

    case ClIENT_CANCEL_ALERT:
      return { ...state, isClientCanceled: action.data };

    case START_TIME_DRIVER_WAITING:
      return { ...state, setedWatingTime: action.data };

    case SET_SPINER:
      return { ...state, isSpiner: action.data };

    case ORDER_COUNTER:
      return { ...state, orderCounter: action.data };

    case SET_RECONNECTION:
      return { ...state, isReconnecting: action.data };

    case SET_IO:
      return { ...state, driver: action.data };

    case SET_DESTANCE_DURATION:
      return { ...state, distanceAndDuration: action.data };

    case ORDER_LOADER:
      return { ...state, orderLoader: action.data };

    case ORDER_ACCEPTED:
      return { ...state, isOrderAccepted: action.data };

    case DRIVER_ARRIVED:
      return { ...state, isDriverArrived: action.data };

    case Driver_IS_WAITING:
      return { ...state, isDriverWaiting: action.data };

    case USER_IS_COMING:
      return { ...state, isUserComing: action.data };

    case PICKED_CLIENT:
      return { ...state, pickedClient: action.data };

    case ORDER_EXECUTION:
      return { ...state, isOrderExecuted: true };

    case RESET_STORE:
      return {
        ...state,
        distanceAndDuration: { distance: null, duration: null },
        orderLoader: null,
        isOrderAccepted: null,
        isDriverArrived: null,
        isDriverWaiting: null,
        isUserComing: null,
        pickedClient: null,
        isOrderExecuted: null,
        orderCounter: 0,
        isSpiner: null,
        setedWatingTime: null,
        clientBelatePenalty: null,
      };

    default:
      return state;
  }
};
