import {
  CHAT_UPDATE,
  UPDATE_CLIENT_MESSAGES,
  UPDATE_DRIVER_MESSAGES,
  RESET_BADGE_COUNTER
} from "./actions";

const initialState = {
  messageList: [],
  badgeCounter: 0,
};

export const ChatReducer = (state = initialState, action) => {
  switch (action.type) {
    //  update Chat
    case CHAT_UPDATE:
      return {
        ...state,
        messageList: action.data,
      };
      //  badge reset
    case RESET_BADGE_COUNTER:
      return { ...state, badgeCounter: 0 };
    //  message from client
    case UPDATE_DRIVER_MESSAGES:
      return {
        ...state,
        messageList: [
          { id: 1, msg: action.data, date: action.date },
          ...state.messageList,
        ],
      };
    // message from driver
    case UPDATE_CLIENT_MESSAGES:
      return {
        ...state,
        messageList: [
          { id: 2, msg: action.data, date: action.date },
          ...state.messageList,
        ],
        badgeCounter: state.badgeCounter + 1,
      };

    default:
      return state;
  }
};
