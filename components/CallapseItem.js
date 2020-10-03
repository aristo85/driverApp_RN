import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import TextTitle from "./TextTitle";
import TextBody from "./TextBody";
import ButtonStyled from "./ButtonStyled";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const CallapseItem = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={{...styles.container, ...props.style}}>
      <TouchableOpacity
        style={styles.totalContainer}
        onPress={() => setIsOpen(!isOpen)}
      >
        <TextTitle>Additional options</TextTitle>
        <Ionicons
          name={
            isOpen
              ? Platform.OS === "android"
                ? "md-arrow-round-up"
                : "ios-arrow-round-up"
              : Platform.OS === "android"
              ? "md-arrow-round-down"
              : "ios-arrow-round-down"
          }
          size={25}
          color={colors.fourth}
        />
      </TouchableOpacity>

      {isOpen && <View>{props.children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderRadius: 10,
    elevation: 5,
    margin: 5,
    padding: 10,
    alignSelf: "center",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5
  },
});

export default CallapseItem;
