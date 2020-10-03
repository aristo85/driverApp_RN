import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../../constants/colors";

const SwitchOffAlert = (props) => {
  const [showAlert, setShowAlert] = useState(false);

  const onConfirmPressed = () => {
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
      showCancelButton={true}
      showConfirmButton={true}
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
        onConfirmPressed();
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

export default SwitchOffAlert;
