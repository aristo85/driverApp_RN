import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { GET_USER_LOCATION, getUserLocation } from "../../store/shar/actoins";
import { onDriverWaiting, onSetTimeForWaiting } from "../../store/order/actions";
import ClientItem from "./ClientItem";

const DriveToClient = (props) => {
  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const driverId = useSelector((state) => state.OrderLoaderReducer.userId);
  const distanceAndDuration = useSelector(
    (state) => state.OrderLoaderReducer.distanceAndDuration
  );
  const isDriverArrived = useSelector(
    (state) => state.OrderLoaderReducer.isDriverArrived
  );
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const myLocation = useSelector((state) => state.SharReducer.userLocation);

  const dispatch = useDispatch();

  const handleArrived = () => {
    //emit driver is arrived
    driver.emit("driver arrived", {
      clientId: orderLoader.userId,
      driverId,
    });
    dispatch(onDriverWaiting(true));
    dispatch(onSetTimeForWaiting(new Date().getTime()));
  };

  useEffect(() => {
    // refresh driver location after 10sec until arrive
    const timer = setInterval(() => {
      dispatch(getUserLocation());
    }, 10000);
    /* when component unmount (switch is off) disconnect the socket */
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    driver.emit("update driver location", {
      clientId: orderLoader.userId,
      lat: myLocation.lat,
      lng: myLocation.lng,
      driverId,
    });
  }, [myLocation]);

  return (
    <View style={{ flex: 1 }}>
      <ClientItem onNavigation={props.onNavigation} />
      {isDriverArrived ? (
        <TouchableOpacity
          style={styles.arrived}
          onPress={() => handleArrived()}
        >
          <Card style={styles.arrivedBtn}>
            <TextTitle style={{ color: colors.third, fontSize: 18 }}>
              Arrived
            </TextTitle>
          </Card>
        </TouchableOpacity>
      ) : (
        <View style={styles.footer}>
          <Card style={styles.cardFooter}>
            <View>
              <TextTitle style={{ color: colors.secondary, fontSize: 18 }}>
                {distanceAndDuration.distance}
              </TextTitle>
              <TextTitle style={{ color: colors.secondary, fontSize: 18 }}>
                Your order is {distanceAndDuration.duration} minutes away
              </TextTitle>
            </View>
          </Card>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  arrived: {
    position: "absolute",
    bottom: 0,
    width: "50%",
    height: "10%",
    alignSelf: "center",
    marginBottom: 2,
  },
  arrivedBtn: {
    backgroundColor: colors.primary,
    height: "100%",
    justifyContent: "center",
    borderRadius: 50,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
  },
  cardFooter: {
    backgroundColor: colors.third,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
});

export default DriveToClient;
