import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { onPickedClient, onOrderExecution } from "../../store/order/actions";
import { onSaveExecutedOrder } from "../../store/httprequests/orders/actionsGetOrder";
import ClientItem from "./ClientItem";
// import io from "socket.io-client/dist/socket.io"; // note the /dist/ subdirectory (socket.io-client v.2.1.1)!
// import { envKey } from "../../config/key";

const DriveToDestination = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(-1);

  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const driverId = useSelector((state) => state.OrderLoaderReducer.userId);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );

  const dispatch = useDispatch();

  const handleOrderExecution = () => {
    driver.emit("order is executed", {
      clientId: orderLoader.userId,
      driverId,
    });
    dispatch(onSaveExecutedOrder());
    dispatch(onOrderExecution());
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((seconds) => (seconds >= 59 ? 0 : seconds + 1));
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    seconds === 0 && setMinutes(minutes + 1);
  }, [seconds]);

  return (
    <View style={{flex: 1}}>
      <ClientItem />
      <Card style={styles.waiting}>
        <View style={styles.waitingText}>
          <TextTitle>
            {minutes.toString().padStart(2, "0")}:
            {seconds.toString().padStart(2, "0")}
          </TextTitle>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleOrderExecution();
          }}
        >
          <Card style={styles.pickedClient}>
            <TextTitle style={{ color: colors.third }}>
              Order is executed
            </TextTitle>
          </Card>
        </TouchableOpacity>
        <View style={styles.waitingText}>
          <TextTitle>Price: 100</TextTitle>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  waiting: {
    flexDirection: "row",
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "space-around",
    backgroundColor: colors.third,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
    height: "10%",
    minHeight: 65,
  },
  waitingText: {
    justifyContent: "center",
    color: colors.primary,
  },
  pickedClient: {
    elevation: 5,
    backgroundColor: colors.primary,
    height: "100%",
    justifyContent: "center",
    minHeight: 50,
    marginBottom: 2,
  },
});

export default DriveToDestination;
