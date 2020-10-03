import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import colors from "../constants/colors";
import {
  onClientBelatePenalty,
  onSetTimeForWaiting,
} from "../store/order/actions";
import TextTitle from "./TextTitle";

const Counter = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(-1);

  const appState = useSelector((state) => state.UserReducer.appState);
  const setedWatingTime = useSelector(
    (state) => state.OrderLoaderReducer.setedWatingTime
  );

  const dispatch = useDispatch();

  // and a timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((seconds) => (seconds >= 59 ? 0 : seconds + 1));
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  //set the time counter (minutes)
  useEffect(() => {
    seconds === 0 && setMinutes(+minutes + 1);
  }, [seconds]);

  useEffect(() => {
    if (appState === "active" && setedWatingTime) {
      let waitingPeriod = new Date().getTime() - setedWatingTime,
        newMin = (waitingPeriod / 1000).toFixed(0) / 60,
        newSec = (waitingPeriod / 1000).toFixed(0) % 60;
      setSeconds(newSec);
      setMinutes(newMin.toFixed(0));
    }
  }, [appState]);

  useEffect(() => {
    if (minutes > 3) {
      dispatch(onClientBelatePenalty((minutes - 3) * 10));
    }
  }, [minutes]);

  return (
    // <View style={styles.waitingText}>
    <TextTitle style={{ color: colors.fourth }}>
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </TextTitle>
    // </View>
  );
};

const styles = StyleSheet.create({
  waitingText: {
    justifyContent: "center",
    color: colors.primary,
  },
});

export default Counter;
