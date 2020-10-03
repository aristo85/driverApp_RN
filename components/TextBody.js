import React from "react";
import { StyleSheet, View, Text } from "react-native";

const TextBody = (props) => {
  return <Text style={{...styles.text, ...props.style}}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "open-sans",
    textAlign: "center",
    margin: 5,
  },
});

export default TextBody;