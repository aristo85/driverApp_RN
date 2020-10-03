import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import MainNavigator from "./navigation/mainNavigator";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { SharReducer } from "./store/shar/reducer";
import ReduxThunk from "redux-thunk";
import { UserReducer } from "./store/user/reducer";
import { OrderLoaderReducer } from "./store/order/reducer";
import AuthReducer from "./store/authe/reducer";
import { ChatReducer } from "./store/chat/reducer";

const rootReducer = combineReducers({
  SharReducer,
  UserReducer,
  OrderLoaderReducer,
  AuthReducer,
  ChatReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  //prolong the default loading
  const [dataLoaded, setDataLoaded] = useState(false);
  if (!dataLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts} //this has to be a function and return a promise
        onFinish={() => setDataLoaded(true)} //a listener
        onError={(error) => console.log(error)} // in case of error fetching, we can show alternative component or ~cl~
      />
    );
  }

  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
