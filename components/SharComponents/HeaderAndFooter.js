import React, { useEffect, useState, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  AppState,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import OrderCame from "./OrderCame";
import { useDispatch, useSelector } from "react-redux";
import DriveToClient from "./DriveToClient";
import WaitingOnPickupSpot from "./WaitingOnPickupSpot";
import DriveToDestination from "./DriveToDestination";
import RatingClietn from "./RatingClietn";
import MapView, { Marker } from "react-native-maps";
import MapViewComp from "../../components/MapViewComp";
import MapViewDirections from "react-native-maps-directions";
import { googleApiKey } from "../../env";
import io from "socket.io-client/dist/socket.io"; // note the /dist/ subdirectory (socket.io-client v.2.1.1)!
import {
  onOrderLoader,
  onDriverArrived,
  onSetDistanceAndDuration,
  onUserComing,
  onSetIO,
  onReconnection,
  onResetStore,
  onSetStateBackground,
  onSetSpiner,
  onToggleSwitch,
  onClientCancelAlert,
} from "../../store/order/actions";
import colors from "../../constants/colors";
import FadeAnim from "../FadeAnim";
import { envKey } from "../../config/key";
import ClientCanceled from "./ClientCanceled";
import { onChatUpdate, onRecieveMsg } from "../../store/chat/actions";

const HeaderAndFooter = (props) => {
  const stateRef = useRef("isSwitch");
  // *************************************
  const [rerender, setRerender] = useState(false);

  const isSwitch = useSelector((state) => state.OrderLoaderReducer.isSwitch);
  const isSpiner = useSelector((state) => state.OrderLoaderReducer.isSpiner);
  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const userId = useSelector((state) => state.OrderLoaderReducer.userId);
  const orderLoader = useSelector(
    (state) => state.OrderLoaderReducer.orderLoader
  );
  const isOrderAccepted = useSelector(
    (state) => state.OrderLoaderReducer.isOrderAccepted
  );
  const isDriverWaiting = useSelector(
    (state) => state.OrderLoaderReducer.isDriverWaiting
  );
  const isUserComing = useSelector(
    (state) => state.OrderLoaderReducer.isUserComing
  );
  const pickedClient = useSelector(
    (state) => state.OrderLoaderReducer.pickedClient
  );
  const isOrderExecuted = useSelector(
    (state) => state.OrderLoaderReducer.isOrderExecuted
  );
  const isReconnecting = useSelector(
    (state) => state.OrderLoaderReducer.isReconnecting
  );
  const messageList = useSelector((state) => state.ChatReducer.messageList);
  const myLocation = useSelector((state) => state.SharReducer.userLocation);

  const phoneNumber = useSelector((state) => state.AuthReducer.phoneNumber);
  const userName = useSelector((state) => state.AuthReducer.userName);
  const rating = useSelector((state) => state.AuthReducer.rating);

  const dispatch = useDispatch();
  //on map ready seeting the distance and time for driver to pick up the client
  const handleDirectionData = (data) => {
    const newDist =
      data.distance < 1
        ? `${data.distance * 1000} m`
        : `${Math.round(data.distance)} km`;
    const newDur = data.duration < 1 ? 1 : Math.round(data.duration);
    if (newDur <= 1) {
      dispatch(onDriverArrived(true));
    }
    dispatch(
      onSetDistanceAndDuration({
        distance: newDist,
        duration: newDur,
      })
    );
  };
  //save clientOrder to the store
  const handleOrder = (data) => {
    dispatch(onOrderLoader(data));
  };

  useEffect(() => {
    stateRef.current = isOrderExecuted
      ? "isOrderExecuted"
      : pickedClient
      ? "pickedClient"
      : isUserComing
      ? "isUserComing"
      : isDriverWaiting
      ? "isDriverWaiting"
      : isOrderAccepted
      ? "isOrderAccepted"
      : orderLoader
      ? "orderLoader"
      : isSwitch && "isSwitch";
  });

  useEffect(() => {
    AppState.addEventListener("change", handleChange);
    if (!isReconnecting || isReconnecting === "fromDB") {
      dispatch(onReconnection("fromApp"));
    }
    return () => {
      AppState.removeEventListener("change", handleChange);
    };
  }, [driver]);

  const handleChange = (newState) => {
    if (newState == "active") {
      setRerender(!rerender);
      dispatch(onSetSpiner(true));
    }
    if (newState == "background") {
      if (
        stateRef.current === "isSwitch" ||
        stateRef.current === "orderLoader"
      ) {
        dispatch(onToggleSwitch(false));
      }
    }
  };
  //***************** */ ****************
  useEffect(() => {
    const driverData = {
      userId: userId,
      lat: myLocation.lat,
      lng: myLocation.lng,
      ignoredList: [],
      driverInfo: { userName, rating, phoneNumber },
    };
    const connectionConfig = {
      jsonp: false,
      reconnection: true,
      reconnectionDelay: 100,
      reconnectionAttempts: 100000,
      transports: ["websocket"], // you need to explicitly tell it to use websockets
      query: { driverData: JSON.stringify(driverData) },
    };
    const socket = io(`${envKey.URL}/main`, connectionConfig);
    const room = userId;
    dispatch(onSetIO(socket));

    // on connect or reconnection
    socket.on("connect", () => {
      if (isReconnecting) {
        socket.emit("reconnection", {
          uberId: userId,
          driverState: stateRef.current,
          isReconnecting,
          messageList,
        });
      } else {
        socket.emit("reconnection", {
          uberId: userId,
          driverState: null,
        });
      }
    });
    socket.on("disconnect", () => {
    });

    // pending state on reconnection
    socket.on(`reconnect ${userId}`, (data) => {
      // if no state available then reconnect with status of first connection
      if (!data) {
        dispatch(onResetStore());
        socket.emit("reconnection", {
          uberId: userId,
          driverState: null,
        });
        dispatch(onSetSpiner(false));
        //compare states and request the state from DB if updating is need
      } else {
        // if state is different from server state
        if (data.state !== stateRef.current && data.state !== "app") {
          dispatch(onSetStateBackground(data.state));
        }
        // check the chat state and if any pending messages, update it from DB
        data.state !== "app" && dispatch(onChatUpdate(data.messageList));
        // driver exit rooms after background or disconnect, rejoin again!
        socket.emit("driver rejoin room", orderLoader.userId);
        dispatch(onSetSpiner(false));
      }
    });

    // when order recieved
    socket.on(`recieve order ${userId}`, (data) => {
      socket.emit("join", { room: data.userId, driverData });
      handleOrder(data);
    });

    // client says is coming out
    socket.on(`user coming out ${userId}`, () => {
      dispatch(onUserComing(true));
    });

    socket.on("message", (data) => {
      dispatch(onRecieveMsg(data));
    });

    // client cancelled the order
    socket.on(`user canceled`, (data) => {
      dispatch(onClientCancelAlert(data));
    });

    /* when component unmount (switch is off) delete the driver from waiting
     list on server and disconnect the socket */
    return () => {
      socket.emit("reduce user", { userId, room });
      socket.disconnect(true);
    };
  }, [rerender]);
  //***************** */ ****************

  if (isSpiner) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={styles.spiner}
      />
    );
  }

  return orderLoader && driver ? (
    // when order recieved show the route to pickup spot
    <View style={StyleSheet.absoluteFillObject}>
      <MapViewComp
        region={props.region}
        mapPadding={{
          left: 16,
          right: 16,
          bottom: 4 * 16,
          top: 5 * 16,
        }}
      >
        <MapViewDirections
          origin={{
            latitude: myLocation.lat,
            longitude: myLocation.lng,
          }}
          destination={{
            latitude: pickedClient
              ? orderLoader.toGo.lat
              : orderLoader.fromWhere.lat,
            longitude: pickedClient
              ? orderLoader.toGo.lng
              : orderLoader.fromWhere.lng,
          }}
          apikey={googleApiKey.API_KEY}
          strokeWidth={3}
          strokeColor={colors.third}
          onReady={(data) => handleDirectionData(data)}
        />
        <Marker
          coordinate={{
            latitude: myLocation.lat,
            longitude: myLocation.lng,
          }}
        >
          <Image
            source={require("../../assets/animated/taxi.gif")}
            style={{ height: 35, width: 35 }}
          />
        </Marker>
        <Marker
          coordinate={{
            latitude: pickedClient
              ? orderLoader.toGo.lat
              : orderLoader.fromWhere.lat,
            longitude: pickedClient
              ? orderLoader.toGo.lng
              : orderLoader.fromWhere.lng,
          }}
        ></Marker>
      </MapViewComp>
      {/* all logics for showing parts of screen (header and footer) */}
      {isOrderExecuted ? (
        <RatingClietn />
      ) : pickedClient ? (
        <DriveToDestination />
      ) : isDriverWaiting ? (
        <WaitingOnPickupSpot />
      ) : isOrderAccepted ? (
        <DriveToClient onNavigation={props.onNavigation} />
      ) : (
        <OrderCame />
      )}
      {/* render alert if client canceled */}
      <ClientCanceled />
      <StatusBar style="light" backgroundColor={colors.primary} />
    </View>
  ) : (
    // otherwise just show the driver watiting for order
    <MapViewComp region={props.region} mapPadding={{ top: 40 }}>
      <Marker
        coordinate={{ latitude: myLocation.lat, longitude: myLocation.lng }}
      >
        {/* used animated view, indicates searching for client */}
        <FadeAnim>
          <Image
            source={require("../../assets/animated/taxi.gif")}
            style={{ height: 35, width: 35 }}
          />
        </FadeAnim>
      </Marker>
      <StatusBar style="light" backgroundColor={colors.primary} />
    </MapViewComp>
  );
};

const styles = StyleSheet.create({
  spiner: {
    flex: 1,
    justifyContent: "center",
  },
});

export default HeaderAndFooter;
