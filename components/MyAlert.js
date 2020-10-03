import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../constants/colors";

const MyAlert = (props) => {
  const [showAlert, setShowAlert] = useState(false);

  const onWait = () => {
    setShowAlert(false);
    props.onConfirm();
  };

  const onCancel = () => {
    setShowAlert(false);
    props.onCancel();
  };

  const handleDismiss = () => {
    setShowAlert(false);
    props.onDismiss();
  };

  useEffect(() => {
    setShowAlert(true);
  }, []);

  return (
    <AwesomeAlert
      show={showAlert}
      showProgress={false}
      title={props.title}
      message={props.message}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={props.hideCancel ? false : true}
      showConfirmButton={props.hideConfirm ? false : true}
      cancelText={props.cancelTextBtn}
      confirmText={props.confirmTextBtn}
      confirmButtonColor={colors.primary}
      onDismiss={() => {
        handleDismiss();
      }}
      onCancelPressed={() => {
        onCancel();
      }}
      onConfirmPressed={() => {
        onWait();
      }}
      contentContainerStyle={{ backgroundColor: colors.third }}
      titleStyle={{ color: colors.fourth }}
      messageStyle={{ color: colors.primary }}
      cancelButtonColor={colors.secondary}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 15,
  },
});

export default MyAlert;
