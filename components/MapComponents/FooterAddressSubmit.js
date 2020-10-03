import React from "react";
import { StyleSheet, Platform, TouchableOpacity } from "react-native";
import Card from "../Card";
import TextTitle from "../TextTitle";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_FROMWHERE_LOCATION,
  SET_TOGO_LOCATION,
} from "../../store/shar/actoins";

const FooterAddressSubmit = (props) => {
  const showFooterAutocomplete = useSelector(
    (state) => state.VisibilityReducer.isFooterAutocomplete
  );
  const isTouched = useSelector((state) => state.VisibilityReducer.isTouched);

  const dispatch = useDispatch();

  //dispatching the chosen address to the reducer and route back to main screen
  const handleSubmit = () => {
    dispatch({
      type:
        props.locationType === "fromWhere"
          ? SET_FROMWHERE_LOCATION
          : SET_TOGO_LOCATION,
      ...props.address,
    });
    props.navigateBack.goBack();
  };

  return showFooterAutocomplete && !isTouched ? (
    <Card style={styles.footerContainer}>
      <TextTitle>
        {props.address.building !== 0
          ? `${props.address.street}, ${props.address.building}`
          : props.address.station !== ""
          ? `Остановка: ${props.address.station}`
          : ""}{" "}
        ?
      </TextTitle>
      <TouchableOpacity onPress={handleSubmit}>
        <Card style={{ backgroundColor: colors.primary }}>
          <Ionicons
            style={styles.icon}
            name={Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"}
            color={colors.fourth}
            size={40}
          />
        </Card>
      </TouchableOpacity>
    </Card>
  ) : null;
};

const styles = StyleSheet.create({
  footerContainer: {
    flex: 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.third,
    borderBottomStartRadius: 0,
    borderBottomEndRadius: 0,
  },
  icon: {
    paddingHorizontal: 10,
  },
});

export default FooterAddressSubmit;
