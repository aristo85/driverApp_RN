import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SharScreen, { SharScreenOptions } from "../screens/SharScreen";
import colors from "../constants/colors";
import { Platform, View, SafeAreaView, TouchableOpacity } from "react-native";
import Test2 from "../screens/Test2";
import Card from "../components/Card";
import RegisterAuthScreen, {
  RegisterAuthOptions,
} from "../screens/RegisterAuthScreen";
import LoginAuthScreen, { LoginAuthOptions } from "../screens/LoginAuthScreen";
import {
  createDrawerNavigator,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import TextBody from "../components/TextBody";
import { logOut } from "../store/authe/actions";
import ChatScreen from "../screens/ChatScreen";

//main stack navigator
const MainStackNavigator = createStackNavigator();
export const SharStackNavigator = () => {
  return (
    <MainStackNavigator.Navigator
      screenOptions={{
        headerTintColor: Platform.OS === "android" ? "white" : colors.secondary,
        headerStyle: {
          backgroundColor: Platform.OS === "android" && colors.secondary,
        },
        cardStyle: {
          // paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <MainStackNavigator.Screen
        name="Main"
        component={SharScreen}
        options={SharScreenOptions}
      />
      <MainStackNavigator.Screen
        name="Chat"
        component={ChatScreen}
        // options={SharScreenOptions}
      />
      <MainStackNavigator.Screen
        name="Feedback"
        component={Test2}
        options={{ headerShown: false }}
      />
    </MainStackNavigator.Navigator>
  );
};

//drawer Navigator as main navigator
const SharDrawerNavigator = createDrawerNavigator();
export const SharNavigator = () => {
  const isAuth = useSelector((state) => state.AuthReducer.token);
  const isSwitch = useSelector((state) => state.OrderLoaderReducer.isSwitch);

  const dispatch = useDispatch();
  return (
    <SharDrawerNavigator.Navigator
      drawerContent={(props) => {
        return (
          <View style={{ flex: 1, paddingTop: 20 }}>
            <SafeAreaView style={{ alignItems: "flex-start" }}>
              <DrawerItemList {...props} />
              {!isSwitch && (
                <TouchableOpacity
                  onPress={() =>
                    isAuth
                      ? dispatch(logOut())
                      : props.navigation.navigate("Auth")
                  }
                >
                  <Card
                    style={{
                      backgroundColor: colors.primary,
                      margin: 5,
                      marginLeft: 10,
                    }}
                  >
                    <TextBody style={{ color: colors.third }}>
                      {isAuth ? "LogOut" : "SignUp"}
                    </TextBody>
                  </Card>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: colors.primary,
      }}
    >
      <SharDrawerNavigator.Screen
        name="Shar"
        component={SharStackNavigator}
        options={
          {
            // drawerIcon: (props) => (
            //   <Ionicons
            //     name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
            //     size={23}
            //     color={colors.primary}
            //   />
            // ),
          }
        }
      />
    </SharDrawerNavigator.Navigator>
  );
};

//adding AuthScreen to navigator
const AuthStackNavigator = createStackNavigator();
export const AuthenticationNav = () => {
  return (
    <AuthStackNavigator.Navigator
      screenOptions={{
        cardStyle: {
          // paddingTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
        },
      }}
    >
      <AuthStackNavigator.Screen
        name="Registeration"
        component={RegisterAuthScreen}
        options={RegisterAuthOptions}
      />
      <AuthStackNavigator.Screen
        name="Login"
        component={LoginAuthScreen}
        options={LoginAuthOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

// //top tab navigator
// const TabTop = createMaterialTopTabNavigator();
// const TabTopNavigator = (props) => {
//   return (
//     <>
//       {/* switch button to the top navigation tab */}
//       <Card
//         props={{ ...props }}
//         style={{
//           position: "absolute",
//           zIndex: 99,
//           top: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
//           right: 0,
//           alignSelf: "center",
//           width: "25%",
//           backgroundColor: colors.primary,
//           borderRadius: 0,
//           height: 48,
//         }}
//       >
//         <SwitchTab />
//       </Card>
//       <TabTop.Navigator
//         tabBarOptions={{
//           style: {
//             backgroundColor: colors.primary,
//             marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
//             justifyContent: "flex-start",
//             width: "75%",
//             // height: Dimensions.get("window").height / 12,
//           },
//           activeTintColor: colors.third,
//           inactiveTintColor: "gray",
//           indicatorStyle: {
//             backgroundColor: colors.primary,
//           },
//           tabStyle: {
//             justifyContent: "center",
//             borderEndWidth: 1,
//           },
//           labelStyle: {
//             backgroundColor: colors.primary,
//             overflow: "hidden",
//           },
//         }}
//         style={{
//           backgroundColor: colors.third,
//         }}
//       >
//         <TabTop.Screen name="Main" component={SharScreen} />
//         <TabTop.Screen name="Map" component={MapScreen} />
//         <TabTop.Screen name="Switch" component={MapScreen} />
//       </TabTop.Navigator>
//     </>
//   );
// };
