import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from 'native-base';
import i18n from 'i18n-js'
import '../../locales/i18n';


export default function NoEventBox() {
  return (
    <View style={[styles.container]}>
        <Image source={require("../../assets/images/no-event.png")} style={styles.imageStyle} />
        <Text color="#666" fontSize="md">{i18n.t('noEvent')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    imageStyle: {
        width: 180,
        height: 180,
    }
});
