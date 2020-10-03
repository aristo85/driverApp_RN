import React, { useState, useEffect } from "react";
import { Rating, AirbnbRating } from "react-native-elements";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import colors from "../../constants/colors";
import Card from "../Card";
import TextTitle from "../TextTitle";
// import io from "socket.io-client/dist/socket.io"; // note the /dist/ subdirectory (socket.io-client v.2.1.1)!
import { useDispatch, useSelector } from "react-redux";
import { onResetStore } from "../../store/order/actions";
import { onRateClient } from "../../store/httprequests/orders/actionsGetOrder";
// import { envKey } from "../../config/key";

const RatingClietn = () => {
  const [rateNumber, setRateNumber] = useState(0);

  const dispatch = useDispatch();

  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const driverId = useSelector((state) => state.OrderLoaderReducer.userId);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const myLocation = useSelector((state) => state.SharReducer.userLocation);

  const handleRating = () => {
    //************************* */
    driver.emit("driver rated", {
      driverData: {
        userId: driverId,
        lat: myLocation.lat,
        lng: myLocation.lng,
        ignoredList: [],
      },
      clientId: orderLoader.userId,
    });
    dispatch(onRateClient(rateNumber))
    dispatch(onResetStore());
  };

  const ratingCompleted = (rating) => {
    setRateNumber(rating);
  };

  return (
    <View style={styles.footer}>
      <Card style={styles.cardFooter}>
        <TextTitle style={{ fontSize: 25, color: colors.third }}>
          Rate the pssenger
        </TextTitle>
        <View style={styles.rating}>
          <AirbnbRating
            showRating={false}
            defaultRating={0}
            onFinishRating={ratingCompleted}
          />
        </View>
        <TouchableOpacity onPress={handleRating}>
          <Card>
            <TextTitle style={{ color: colors.third, fontSize: 18 }}>
              {rateNumber === 0 ? "Skip" : "Send"}
            </TextTitle>
          </Card>
        </TouchableOpacity>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flex: 1,
  },
  cardFooter: {
    backgroundColor: colors.secondary,
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
  },
  rating: {
    marginVertical: 15,
  },
});

export default RatingClietn;
