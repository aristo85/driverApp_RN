import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, Button } from "react-native";

export default function App(props) {
  // fadeAnim will be used as the value for opacity. Initial Value: 0
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(100),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
      {}
    ).start();
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim, // Bind opacity to animated value
          },
        ]}
      >
        <View>{props.children}</View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // position: 'absolute',
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    overflow: "hidden",
    height: 35,
    width: 35,
    borderRadius: 50,
  },
  fadingContainer: {
    // paddingVertical: 50,
    // paddingHorizontal: 50,
    backgroundColor: "rgba(255,185,0,0.5)",
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    // overflow: 'hidden'
  },
});
