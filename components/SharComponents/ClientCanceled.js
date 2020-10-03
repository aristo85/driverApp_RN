import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onResetStore, onClientCancelAlert } from "../../store/order/actions";
import MyAlert from "../MyAlert";

const ClientCanceled = () => {
  const isClientCanceled = useSelector(
    (state) => state.OrderLoaderReducer.isClientCanceled
  );
  const driver = useSelector((state) => state.OrderLoaderReducer.driver);
  const userId = useSelector((state) => state.OrderLoaderReducer.userId);

  const dispatch = useDispatch();

  const handleDismissOrConfirm = () => {
      // if the client specifically want to ignore this driver for the order
    if (isClientCanceled.changeDriver) {
      driver.emit("drReconnAfterClCancel", isClientCanceled);
    } else {
      // add the driver to the driver list
      driver.emit("reconnection", {
        uberId: userId,
        driverState: null,
      });
    }
    dispatch(onClientCancelAlert(false));
    dispatch(onResetStore());
  };

  return isClientCanceled ? (
    <MyAlert
      title={"User Canceled Order"}
      message={"User has changed her mind, and canceled the order"}
      confirmTextBtn="OK"
      hideCancel={true}
      onConfirm={handleDismissOrConfirm}
      onDismiss={handleDismissOrConfirm}
    />
  ) : null;
};

export default ClientCanceled;
