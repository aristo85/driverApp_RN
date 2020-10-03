import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import Color from "../constants/colors";

const InputStyled = (props) => {
    return (
        <TextInput {...props} style={{...styles.input, ...props.style}}
        underlineColorAndroid='transparent' />
    );
}

const styles = StyleSheet.create({
    input: {
        borderColor: Color.secondary,
        borderBottomWidth: 1,
    }
});

export default InputStyled;