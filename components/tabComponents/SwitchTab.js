import React, { useState, useEffect } from "react";
import { StyleSheet, Switch, View } from "react-native";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { onToggleSwitch } from "../../store/order/actions";
import SwitchOffAlert from "./SwitchOffAlert";

const SwitchTab = (props) => {
  const [isAlert, setIsAlert] = useState(null);
  const isEnabled = useSelector((state) => state.OrderLoaderReducer.isSwitch);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const isOrderAccepted = useSelector(
    (state) => state.OrderLoaderReducer.isOrderAccepted
  );

  const dispatch = useDispatch();

  //comunicating to server through socketio whenever switch toggled
  const toggleSwitch = (value) => {
    // console.log(value);
    if (!value) {
      setIsAlert(!value);
      return;
    }
    dispatch(onToggleSwitch(value));
  };

  return (
    <View>
      <Switch
        trackColor={{ false: "#767577", true: colors.third }}
        thumbColor={isEnabled ? colors.fourth : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => toggleSwitch(!isEnabled)}
        value={isEnabled}
        style={styles.switch}
        disabled={isOrderAccepted}
      />
      {isAlert && (
        <SwitchOffAlert
          title={"Cancel order"}
          message={
            orderLoader
              ? `Switch off while order is running will coast you activity marks. Do you really want to cancel the order?`
              : "Do you really want to cancel searching?"
          }
          // confirmTextBtn="Yes"
          onConfirm={() => {
            dispatch(onToggleSwitch(false));
            setIsAlert(false);
          }}
          onCancel={() => {
            setIsAlert(false);
          }}
          onDismiss={() => {
            setIsAlert(false);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  switch: {
    transform: [{ scale: 1.5 }],
    alignSelf: "flex-end",
  },
});

export default SwitchTab;
