import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  SharStackNavigator,
  AuthenticationNav,
  SharNavigator,
} from "./navigators";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { ActivityIndicator, AppState, AsyncStorage, StyleSheet } from "react-native";
import { authentication, getDriverRating } from "../store/authe/actions";
import { colors } from "react-native-elements";
import { onSetAppState } from "../store/user/actions";

//main navigator
const MainNavigator = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isAuth = useSelector((state) => state.AuthReducer.token);

  const dispatch = useDispatch();

  // search for token(autologin) in local storage
  const getLocalData = async () => {
    setIsLoading(true);
    const authData = await AsyncStorage.getItem("authData");
    if (authData) {
      const transformData = JSON.parse(authData);
      const { token, userId, phoneNumber, rating, userName } = transformData;
      dispatch(authentication(token, userId, phoneNumber, rating, userName));
      // get most resent rating
      dispatch(getDriverRating());
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isAuth) {
      getLocalData();
    }
  }, []);

  // on background or active AppState
 useEffect(() => {
  AppState.addEventListener("change", handleChange);

  return () => {
    AppState.removeEventListener("change", handleChange);
  };
}, []);
const handleChange = (newState) => {
    dispatch(onSetAppState(newState))
};

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  }

  return (
    <NavigationContainer>
      {/* if the user is not authenticated before then to registeration/login screen */}
      {isAuth ? <SharNavigator /> : <AuthenticationNav />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
  },
});

export default MainNavigator;
