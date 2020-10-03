import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
// import { googleApiKey } from "../../env";
import { Alert } from "react-native";

export const GET_USER_LOCATION = "GET_USER_LOCATION";
export const SET_FROMWHERE_LOCATION = "SET_FROMWHERE_LOCATION";
export const SET_TOGO_LOCATION = "SET_TOGO_LOCATION";
export const SET_INPUT_INTRANCE = "SET_INPUT_INTRANCE";

export const getUserLocation = () => {
  return async (dispatch) => {
    //asking permission for accessing users location
    const userPermission = async () => {
      const response = await Permissions.askAsync(Permissions.LOCATION);
  if (response.status !== "granted") {
        return false;
      }
      return true;
    };
    const isAllowed = await userPermission();
    if (!isAllowed) {
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        timeout: 5000,
      });

      //getting the address from google api by coordinate
      // const data = await getAnAddress({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      // });
      // const { street, building, station, city, address, defaultAddress } = data;

      dispatch({
        type: GET_USER_LOCATION,
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        "Insufficient request!",
        "Couldnt get your location, try again!",
        [{ text: "Okay" }]
      );
    }
  };
};

//reusable function to get an address from api by latlng
// export const getAnAddress = async (latLng) => {
//   try {
//     //getting the address from google api by coordinate
//     const responseAdd = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.latitude},${latLng.longitude}&language=ru&key=${googleApiKey.API_KEY}`
//     );

//     if (!responseAdd.ok) {
//       throw new Error("something wrong with the server api");
//     }
//     const resDadta = await responseAdd.json();
//     const AddrData = resDadta.results[0].address_components;
//     const transiStation = AddrData[0].types.find(
//       (e) => e === "transit_station"
//     );

//     let city = AddrData[2].long_name;
//     let street = AddrData[1].long_name;
//     let building = AddrData[0].long_name;
//     let address = resDadta.results[0].formatted_address;
//     let station = "";
//     let defaultAddress = false;

//     if (
//       isNaN(AddrData[0].long_name[0]) &&
//       transiStation === "transit_station"
//     ) {
//       city = AddrData[1].long_name;
//       street = "";
//       building = 0;
//       station = AddrData[0].long_name;
//     } else if (
//       isNaN(AddrData[0].long_name[0]) &&
//       transiStation !== "transit_station"
//     ) {
//       defaultAddress = true;
//     }
//     return { city, street, building, station, address, defaultAddress };
//   } catch (err) {
//     throw err;
//   }
// };
