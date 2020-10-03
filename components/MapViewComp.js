import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View, Image } from "react-native";
import colors from "../constants/colors";
import MapView, { Marker } from "react-native-maps";

const MapViewComp = (props) => {
  const [bottomMargin, setBottmMargin] = useState(1);

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <MapView
        {...props}
        style={{
          marginBottom: bottomMargin, // using state in styling
          ...StyleSheet.absoluteFillObject,
          ...props.style,
        }}
        provider={"google"}
        zoomEnabled={true}
        scrollEnabled={true}
        region={props.region}
        followsUserLocation
        userLocationUpdateInterval={5000}
        // loadingEnabled={true}
        mapPadding={props.mapPadding}
        showsTraffic={false}
        zoomTapEnabled={false}
        loadingIndicatorColor={colors.primary}
        onMapReady={() => setBottmMargin(bottomMargin === 0 ? 1 : 0)} //fixing show location button in android!
      >
        {props.children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
  },
});

export default MapViewComp;
