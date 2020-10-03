import React from "react";
import { StyleSheet, View, Button } from "react-native";

const ButtonStyled = (props) => {
  return <View style={{...styles.btn, ...props.style}}>
      <Button {...props} title={props.title} color={props.color} />
      </View>
};

const styles = StyleSheet.create({
  btn: {
    margin: 10,
    alignItems: 'center',
  },
});

export default ButtonStyled;