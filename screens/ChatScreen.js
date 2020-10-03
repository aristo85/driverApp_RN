import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
} from "react-native";
import TextBody from "../components/TextBody";
import colors from "../constants/colors";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import InputStyled from "../components/InputStyled";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { onBadgeReset, onSubmit } from "../store/chat/actions";

const ChatScreen = (props) => {
  const [inputText, setInputText] = useState("");

  const messageList = useSelector((state) => state.ChatReducer.messageList);
  const isClientCanceled = useSelector(
    (state) => state.OrderLoaderReducer.isClientCanceled
  );
  const dispatch = useDispatch();

  //dispatching the chosen options and insisting to chose at least one
  const handleSubmit = () => {
    if (inputText.trim() !== "") {
      dispatch(onSubmit(inputText));
      setInputText("");
    }
  };
  // if client cancels the must exit chat screen, otherwise the screen is be open
  useEffect(() => {
    isClientCanceled && props.navigation.goBack();
  });
  // reset the badgeCounter on mounting and unmounting this component
  useEffect(() => {
    dispatch(onBadgeReset());
    return () => dispatch(onBadgeReset());
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          inverted
          data={messageList}
          renderItem={({ item, i }) => (
            <Card style={item.id === 1 ? styles.client : styles.driver}>
              <TextBody>{item.msg}</TextBody>
              <TextBody style={styles.time}>{item.date}</TextBody>
            </Card>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
      <View style={styles.inputContainer}>
        <Card style={styles.inputCard}>
          <InputStyled
            style={{ borderBottomWidth: 0 }}
            autoFocus
            onChangeText={(text) => setInputText(text)}
            value={inputText}
          />
        </Card>
        <TouchableOpacity onPress={() => handleSubmit()}>
          <Ionicons
            name={Platform.OS === "android" ? "md-send" : "ios-send"}
            size={45}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  inputCard: {
    alignSelf: "center",
    borderRadius: 50,
    marginVertical: 5,
    width: "70%",
    borderColor: colors.third,
    borderWidth: 1,
  },
  client: {
    flexDirection: "row",
    marginRight: 5,
    backgroundColor: colors.third,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    marginVertical: 3,
    alignSelf: "flex-end",
    alignItems: "flex-start",
    paddingVertical: 1,
    alignContent: "center",
  },
  driver: {
    flexDirection: "row",
    marginLeft: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    marginVertical: 3,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 1,
  },
  time: { opacity: 0.5, fontSize: 11, alignSelf: "flex-end" },
});

export default ChatScreen;
