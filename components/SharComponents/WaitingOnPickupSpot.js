import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View, StatusBar } from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { onPickedClient, onOrderExecution } from "../../store/order/actions";
import ClientItem from "./ClientItem";
import Counter from "../Counter";

const WaitingOnPickupSpot = (props) => {
  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const driverId = useSelector((state) => state.OrderLoaderReducer.userId);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const isUserComing = useSelector(
    (state) => state.OrderLoaderReducer.isUserComing
  );
  const clientBelatePenalty = useSelector(
    (state) => state.OrderLoaderReducer.clientBelatePenalty
  );

  const dispatch = useDispatch();
  const handleClientPickedUp = () => {
    // if the price is being changed based of belating penalty
    const newClientData = clientBelatePenalty
      ? {
          ...orderLoader,
          orderPrice: orderLoader.orderPrice + clientBelatePenalty,
        }
      : orderLoader;
    // to destination
    driver.emit("to destination", {
      clientId: orderLoader.userId,
      driverId,
      newClientData,
    });
    dispatch(onPickedClient(true));
  };

  return (
    <View style={{ flex: 1 }}>
      {isUserComing && (
        <Card style={styles.header}>
          <TextTitle style={{ color: colors.fourth, fontSize: 18 }}>
            Client is coming
          </TextTitle>
        </Card>
      )}
      <ClientItem />
      <Card style={styles.waiting}>
        <TouchableOpacity onPress={() => handleClientPickedUp()}>
          <Card style={styles.pickedClient}>
            <TextTitle style={{ color: colors.third }}>
              Picked the client <Counter />
            </TextTitle>
          </Card>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  waiting: {
    // flexDirection: "row",
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
  header: {
    // position: "absolute",
    // top: 0,
    width: "100%",
    // marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    // flex: 1,
  },
});

export default WaitingOnPickupSpot;
