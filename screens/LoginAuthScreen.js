import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import TextTitle from "../components/TextTitle";
import colors from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";
import { singupUser, loginUser } from "../store/authe/actions";
import * as yup from "yup";
import Card from "../components/Card";
import TextBody from "../components/TextBody";

// yup for input validation
let schema = yup.object().shape({
  username: yup.string().min(5).max(100).required("insert username"),
  password: yup.string().trim().min(5).required("Password is required"),
});

const LoginAuthScreen = (props) => {
  const [validErrors, setValidErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    setIsLoading(true);
    const dadtaInputs = { username, password };
    try {
      const isValid = await schema.isValid(dadtaInputs);
      if (isValid) {
        await dispatch(loginUser(dadtaInputs));
        // props.navigation.navigate("shop");
      }
      await schema.validate(dadtaInputs);
    } catch (err) {
      const errorMessage = err.errors ? err.errors : err.message;
      setValidErrors(errorMessage);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View style={styles.gradient}>
        <View>
          <TextTitle style={{ fontSize: 19 }}>Please Log In</TextTitle>
        </View>
        <ScrollView style={styles.screen}>
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>Username:</TextTitle>
            <TextInput
              style={styles.input}
              placeholder="type here"
              placeholderTextColor={"grey"}
              autoCapitalize="none"
              value={username}
              onChangeText={(text) => setUsername(text.trim())}
            ></TextInput>
          </View>
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>Password:</TextTitle>
            <TextInput
              style={styles.input}
              placeholder="type here"
              placeholderTextColor={"grey"}
              minLength={5}
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text.trim())}
            />
          </View>
          <View style={{ marginTop: 5 }}>
            <View>
              <TextBody style={{ color: colors.fourth }}>
                {validErrors}
              </TextBody>
            </View>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <Card style={{ backgroundColor: colors.primary }}>
                <TextBody style={{ color: colors.third }}>Login</TextBody>
              </Card>
            </TouchableOpacity>
            <TextTitle>or</TextTitle>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Card style={{ backgroundColor: colors.primary }}>
                <TextBody style={{ color: colors.third }}>
                  Switch to Sign Up
                </TextBody>
              </Card>
            </TouchableOpacity>
          </View>
        </ScrollView>
      <StatusBar style="light" backgroundColor={colors.secondary} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export const LoginAuthOptions = (props) => {
  return {
    headerTintColor: Platform.OS === "android" ? colors.third : colors.primary,
    headerStyle: {
      backgroundColor: colors.primary,
    },
  };
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  screen: {
    flex: 1,
    margin: 10,
  },
  gradient: {
    backgroundColor: colors.third,
    height: "100%",
    width: "100%",
  },
  inputContainer: {},
  label: {
    justifyContent: "flex-start",
    textAlign: "left",
  },
  input: {
    borderBottomWidth: 1,
    width: "100%",
    textAlign: "center",
  },
});

export default LoginAuthScreen;
