import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { useDispatch } from "react-redux";
import ButtonStyled from "../components/ButtonStyled";
import { logOut } from "../store/authe/actions";

const MapScreen = (props) => {
  const dispatch = useDispatch();

  return <ButtonStyled title="Logout" onPress={() => dispatch(logOut())} />;
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
  },
});

export default MapScreen;
