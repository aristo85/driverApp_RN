import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  View,
  Image,
  StatusBar,
} from "react-native";
import colors from "../constants/colors";
import { useSelector, useDispatch } from "react-redux";
import { getUserLocation } from "../store/shar/actoins";
import MapView, { Marker } from "react-native-maps";
import MapViewComp from "../components/MapViewComp";
import HeaderAndFooter from "../components/SharComponents/HeaderAndFooter";
import { getAppState } from "../store/order/actions";
import SwitchTab from "../components/tabComponents/SwitchTab";
import HeaderButtonStyle from "../components/HeaderButtonStyle";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const SharScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const isSwitch = useSelector((state) => state.OrderLoaderReducer.isSwitch);
  const myLocation = useSelector((state) => state.SharReducer.userLocation);

  //change it when more city is in optioins
  const [region, setRegion] = useState({
    latitude: 56.4884,
    longitude: 84.948,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });

  const dispatch = useDispatch();

  //get state on DB and update app state based on it
  const checkStateOnDB = useCallback(async () => {
    setIsLoading(true);
    await dispatch(getAppState());
  }, []);

  //getting the users location on App first run
  const getLocation = useCallback(async () => {
    await dispatch(getUserLocation());
    setIsLoading(false);
  }, [myLocation]);

  // requests and adjust a spiner while waiting for response
  useEffect(() => {
    checkStateOnDB();
    getLocation();
  }, [dispatch]);

  // if users location is available set it to mapView region
  useEffect(() => {
    if (myLocation.lat !== 0) {
      setRegion({
        latitude: myLocation.lat,
        longitude: myLocation.lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    }
  }, [myLocation]);

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  }

  // while waiting for order only show drivers location
  return !isSwitch ? (
    <MapViewComp region={region} mapPadding={{ top: 40 }}>
      <Marker
        coordinate={{ latitude: myLocation.lat, longitude: myLocation.lng }}
      >
        <Image
          source={require("../assets/animated/taxi.gif")}
          style={{ height: 35, width: 35 }}
        />
      </Marker>
      <StatusBar style="light" backgroundColor={colors.primary} />
    </MapViewComp>
  ) : (
    <HeaderAndFooter region={region} onNavigation={props.navigation} />
  );
};

export const SharScreenOptions = (props) => {
  const location = useSelector((state) => state.SharReducer.userLocation);
  return {
    headerTitle: "Shar",
    headerRight: () => <SwitchTab />,
    headerRightContainerStyle: {paddingRight: 10},
    //drawer icon
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButtonStyle}>
        <Item
          title="Drawer"
          iconName="ios-menu"
          onPress={() => {
            props.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SharScreen;
