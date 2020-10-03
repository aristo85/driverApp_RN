import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
} from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  onOrderAccepted,
  onResetStore,
  onOrderTimeout,
  onToggleSwitch,
} from "../../store/order/actions";
import TextBody from "../TextBody";
import { Ionicons } from "@expo/vector-icons";
import MyAlert from "../MyAlert";

const OrderTimeIndicator = (props) => {
  // *****************on skipping or timeout acceptance activity logics
  const [counter, setCounter] = useState(Dimensions.get("window").width);
  const [isAlert, setIsAlert] = useState(null);
  const myLocation = useSelector((state) => state.SharReducer.userLocation);
  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const userId = useSelector((state) => state.OrderLoaderReducer.userId);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const orderCounter = useSelector(
    (state) => state.OrderLoaderReducer.orderCounter
  );
  const distanceAndDuration = useSelector(
    (state) => state.OrderLoaderReducer.distanceAndDuration
  );

  const { userName, phoneNumber, rating } = useSelector(
    (state) => state.AuthReducer
  );

  const clientRating = orderLoader.clientInfo.rating;

  const dispatch = useDispatch();

  const handleOrderIgnore = () => {
    setIsAlert(true);
  };

  const handleConfirm = () => {
    driver.emit("driver leave room", orderLoader.userId);
    driver.emit("ignore order", {
      clientData: orderLoader,
      driverData: {
        userId,
        lat: myLocation.lat,
        lng: myLocation.lng,
        ignoredList: [],
      },
    });
    dispatch(onResetStore());
  };

  const handleAccept = () => {
    // driver accepted the order action(emit)
    driver.emit("driver accepted", {
      clientId: orderLoader.userId,
      lat: myLocation.lat,
      lng: myLocation.lng,
      driverId: userId,
      driverInfo: { userName, phoneNumber, rating },
    });
    dispatch(onOrderAccepted(true));
  };

  //setting timer for the driver to accept the order, with an indicator
  useEffect(() => {
    const reducer = Dimensions.get("window").width / 25;
    const interval = setInterval(() => {
      setCounter((counter) => counter - reducer);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // when the driver ranout of time
    if (counter <= 0) {
      dispatch(onOrderTimeout(orderCounter + 1));
      // running out of time three time in a row then switch off the driver
      if (orderCounter >= 2) {
        dispatch(onToggleSwitch(false));
      } else {
        driver.emit("driver leave room", orderLoader.userId);
        driver.emit("order timeout", {
          clientData: orderLoader,
          driverData: {
            userId,
            lat: myLocation.lat,
            lng: myLocation.lng,
            ignoredList: [],
          },
        });
        dispatch(onResetStore());
      }
    }
  }, [counter]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.header} onPress={handleOrderIgnore}>
        <Card style={styles.cardHeader}>
          <TextTitle style={{ color: colors.fourth, fontSize: 18 }}>
            Ignore this order
          </TextTitle>
          <TextBody style={{ color: colors.third }}>Activity -5</TextBody>
        </Card>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Card style={styles.cardFooter}>
          <View>
            <TextTitle style={{ borderBottomWidth: 1, fontSize: 25 }}>
              {distanceAndDuration.duration} min -{" "}
              {distanceAndDuration.distance}
            </TextTitle>
          </View>
          <View style={styles.routeContainer}>
            <View>
              <TextTitle style={{ opacity: 0.5 }}>Activity: </TextTitle>
              <TextTitle>
                {clientRating.length > 0
                  ? (
                      clientRating.reduce((a, c) => a + c) / clientRating.length
                    ).toFixed(2)
                  : "New user"}
              </TextTitle>
            </View>
            <TextTitle style={{ alignSelf: "center" }}>/</TextTitle>
            <View>
              <TextTitle style={{ opacity: 0.5 }}>Price: </TextTitle>
              <TextTitle>{orderLoader.orderPrice} &#8381;</TextTitle>
            </View>
          </View>
          <View style={styles.addressContainer}>
            <TextTitle style={{ opacity: 0.5 }}>From where:</TextTitle>
            <View style={styles.address}>
              <Ionicons
                name={Platform.OS === "android" ? "md-compass" : "ios-compass"}
                size={25}
                color={colors.fourth}
              />
              <TextBody>
                {orderLoader.fromWhere.building !== 0
                  ? `${orderLoader.fromWhere.street}, ${orderLoader.fromWhere.building}`
                  : orderLoader.fromWhere.station !== ""
                  ? `Остановка: ${orderLoader.fromWhere.station}`
                  : ""}
              </TextBody>
            </View>
          </View>
          <TouchableOpacity
            style={styles.timeoutIndicator}
            onPress={() => handleAccept()}
          >
            <Card style={styles.card}>
              <View
                style={{ ...styles.loaderIndicator, width: counter }}
              ></View>
              <TextTitle style={{ color: colors.third, fontSize: 18 }}>
                Accept
              </TextTitle>
            </Card>
          </TouchableOpacity>
        </Card>
      </View>
      {isAlert && (
        <MyAlert
          title={"Cancel order"}
          message={
            "Ignoring the order will coast you Activity marks. Skip this order?"
          }
          // confirmTextBtn="Yes"
          onConfirm={() => {
            handleConfirm();
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
  card: {
    height: 50,
    overflow: "hidden",
    marginTop: 5,
    elevation: 2,
  },
  loaderIndicator: {
    backgroundColor: colors.primary,
    height: 50,
    position: "absolute",
    left: 0,
    bottom: 0,
    justifyContent: "flex-start",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    flex: 1,
  },
  cardHeader: {
    backgroundColor: colors.primary,
    alignSelf: "center",
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
  routeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
  },
  addressContainer: {
    alignItems: "flex-start",
  },
  address: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default OrderTimeIndicator;
