import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import colors from "../../constants/colors";
import { getDistance } from 'geolib';

const SharTab = (props) => {
  const [BG, setBG] = useState();
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      onPress={() => {
        const dist = getDistance(
          { latitude: 56.5440116, longitude: 84.9772622 },
          { latitude: 56.469508, longitude: 84.9474907 }
        );
        Alert.alert("distance", "getting distance" + dist, [{ text: "Okay" }]);
      }}
    >
      <Card style={styles.card}>
        <TextTitle style={{ color: colors.third }}>Shar</TextTitle>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 0,
    marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight,
    backgroundColor: colors.primary,
  },
});

export default SharTab;
