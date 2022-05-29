import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Text } from 'native-base'

export default function NoEventBox() {
  return (
    <View style={[styles.container]}>
        <Image source={require("../../assets/images/no-event.png")} style={styles.imageStyle} />
        <Text color="#666" fontSize="md">There's no events today!</Text>
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
