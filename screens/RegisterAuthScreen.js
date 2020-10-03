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
import { singupUser } from "../store/authe/actions";
import * as yup from "yup";
import Card from "../components/Card";
import TextBody from "../components/TextBody";

// yup for input validation
let schema = yup.object().shape({
  username: yup.string().min(5).max(100).required(),
  phoneNumber: yup
    .string()
    .min(11, "Phone number is not valid")
    .max(11, "Phone number is not valid")
    .matches(/^\d+$/, "Phone number is not valid")
    .required(),
  email: yup.string().email().required(),
  password: yup.string().min(5).required("Password is required"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const RegisterAuthScreen = (props) => {
  const [validErrors, setValidErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+7");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    // remove the (+) from the phone number for validation
    let phoneOnlyNumbers = phoneNumber.slice(1);
    setIsLoading(true);
    const dadtaInputs = {
      username,
      phoneNumber,
      email,
      password,
      passwordConfirm,
    };
    // is the datainput is validate then dispatch the signup action
    try {
      const isValid = await schema.isValid({
        ...dadtaInputs,
        phoneNumber: phoneOnlyNumbers,
      });
      if (isValid) {
        await dispatch(singupUser(dadtaInputs));
        // props.navigation.navigate("shop");
      }
      // otherwise if not valid add the error to the error list
      await schema.validate({
        ...dadtaInputs,
        phoneNumber: phoneOnlyNumbers,
      });
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
          <TextTitle style={{ fontSize: 19 }}>Create a User</TextTitle>
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
            <TextTitle style={styles.label}>Phpne number:</TextTitle>
            <TextInput
              style={styles.input}
              placeholder="type here"
              placeholderTextColor={"grey"}
              autoCapitalize="none"
              value={phoneNumber}
              onChangeText={(text) =>
                text.length > 1 && setPhoneNumber(text.trim())
              }
            />
          </View>
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>E-mail:</TextTitle>
            <TextInput
              style={styles.input}
              placeholder="type here"
              placeholderTextColor={"grey"}
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
            />
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
          <View style={styles.inputContainer}>
            <TextTitle style={styles.label}>Password confirmation:</TextTitle>
            <TextInput
              style={styles.input}
              placeholder="type here"
              placeholderTextColor={"grey"}
              minLength={5}
              secureTextEntry={true}
              value={passwordConfirm}
              onChangeText={(text) => setPasswordConfirm(text.trim())}
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
                <TextBody style={{ color: colors.third }}>Sign up</TextBody>
              </Card>
            </TouchableOpacity>
            <TextTitle>or</TextTitle>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("Login")}
            >
              <Card style={{ backgroundColor: colors.primary }}>
                <TextBody style={{ color: colors.third }}>
                  Switch to Login
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

export const RegisterAuthOptions = (props) => {
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

export default RegisterAuthScreen;
