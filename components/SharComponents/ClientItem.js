import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { Avatar, Badge, ListItem } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import TextBody from "../TextBody";
import colors from "../../constants/colors";
import Card from "../Card";
import { Ionicons } from "@expo/vector-icons";
import TextTitle from "../TextTitle";

const ClientItem = (props) => {
  const [isContacts, setIsContacts] = useState(false);

  const badgeCounter = useSelector((state) => state.ChatReducer.badgeCounter);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const isDriverWaiting = useSelector(
    (state) => state.OrderLoaderReducer.isDriverWaiting
  );
  const pickedClient = useSelector(
    (state) => state.OrderLoaderReducer.pickedClient
  );
  const clientBelatePenalty = useSelector(
    (state) => state.OrderLoaderReducer.clientBelatePenalty
  );
  const { userName, phoneNumber, rating } = orderLoader.clientInfo;
  const fromAddress =
    orderLoader.fromWhere.building !== 0
      ? `${orderLoader.fromWhere.street}, ${orderLoader.fromWhere.building}`
      : orderLoader.fromWhere.station !== ""
      ? `Остановка: ${orderLoader.fromWhere.station}`
      : "";
  const toAddress =
    orderLoader.toGo.building !== 0
      ? `${orderLoader.toGo.street}, ${orderLoader.toGo.building}`
      : orderLoader.toGo.station !== ""
      ? `Остановка: ${orderLoader.toGo.station}`
      : "";

  return !isContacts ? (
    // show the driver on left down the map corner
    <TouchableOpacity onPress={() => setIsContacts(!isContacts)}>
      <Card style={styles.card}>
        <Ionicons
          style={{ marginLeft: 5 }}
          name={
            Platform.OS === "android"
              ? "md-information-circle"
              : "ios-information-circle"
          }
          size={45}
          color={colors.fourth}
        />
        {badgeCounter > 0 && (
          <Badge
            status="warning"
            containerStyle={{ position: "absolute", top: 0, right: 0 }}
            value={badgeCounter}
          />
        )}
        <TextTitle style={{ color: colors.primary }}>Order Info.</TextTitle>
        <Ionicons
          style={{ marginLeft: 5 }}
          name={
            !isContacts
              ? Platform.OS === "android"
                ? "md-arrow-dropright"
                : "ios-arrow-forward"
              : Platform.OS === "android"
              ? "md-arrow-dropleft"
              : "ios-arrow-back"
          }
          size={35}
          color={colors.fourth}
        />
      </Card>
    </TouchableOpacity>
  ) : (
    <Card
      style={{
        ...styles.card,
        alignSelf: "stretch",
        justifyContents: "flex-between",
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <TextBody numberOfLines={1}>
            {fromAddress.length < 21
              ? `${fromAddress}`
              : `${fromAddress.substring(0, 19)}...`}
          </TextBody>
          <Ionicons
            style={{ marginHorizontal: 5 }}
            name={
              Platform.OS === "android"
                ? "md-arrow-round-forward"
                : "ios-arrow-round-forward"
            }
            size={25}
            color={colors.primary}
          />
          <TextBody numberOfLines={2}>
            {toAddress.length < 21
              ? `${toAddress}`
              : `${toAddress.substring(0, 19)}...`}
          </TextBody>
        </View>
        {!pickedClient && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <View>
              <Image
                style={styles.image}
                source={{
                  uri:
                    "https://previews.123rf.com/images/triken/triken1608/triken160800029/61320775-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration-i.jpg",
                }}
              />
              <TextTitle style={{ color: colors.primary }}>
                {userName}{" "}
                <TextBody style={{ color: colors.third }}>
                  {rating.length > 4
                    ? (rating.reduce((a, c) => a + c) / rating.length).toFixed(
                        2
                      )
                    : "New"}
                </TextBody>
              </TextTitle>
            </View>
            <View>
              <TextBody>{phoneNumber}</TextBody>
              <TouchableOpacity
                onPress={() => props.onNavigation.navigate("Chat")}
              >
                {!isDriverWaiting && (
                  <Ionicons
                    style={{ marginLeft: 15 }}
                    name={
                      Platform.OS === "android"
                        ? "md-chatbubbles"
                        : "ios-chatbubbles"
                    }
                    size={25}
                    color={colors.fourth}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
        <TextTitle style={{ color: colors.third, fontSize: 18 }}>
          {orderLoader.orderPrice + clientBelatePenalty} &#8381;
        </TextTitle>
      </View>
      <TouchableOpacity onPress={() => setIsContacts(!isContacts)}>
        <Ionicons
          style={{ marginLeft: 5, padding: 5 }}
          name={
            !isContacts
              ? Platform.OS === "android"
                ? "md-arrow-dropright"
                : "ios-arrow-forward"
              : Platform.OS === "android"
              ? "md-arrow-dropleft"
              : "ios-arrow-back"
          }
          size={35}
          color={colors.fourth}
        />
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    alignSelf: "flex-start",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    alignItems: "center",
    // marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default ClientItem;
