import React, { useEffect } from "react";
import type { Navigation } from "../types";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
  TouchableHighlight,
  Alert,
  Dimensions,
} from "react-native";
import { Text } from "native-base";
import { theme } from "../core/theme";
import Swiper from "react-native-swiper";
import i18n from "i18n-js";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
// import { GOOGLE_CLIENT_ID_WEB } from '@env';
import { useAuth } from "../contexts/Auth";
import "../locales/i18n";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID_WEB =
  "1044354965352-6qsilpb0i9ntmhbmktld5h68fphi85v5.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID_IOS =
  "044354965352-j2jr4f1s04m3jhr2fikacbn5euhh8ndh.apps.googleusercontent.com";

export default function HomeScreen({ navigation }: Navigation) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CLIENT_ID_WEB,
    webClientId: GOOGLE_CLIENT_ID_WEB,
  });
  const auth = useAuth();

  // useEffect(() => {
  //     navigation.navigate("Home");
  //     navigation.navigate("Join")
  // })

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;

      if (authentication) {
        auth.signIn(authentication?.accessToken);
      } else {
        Alert.alert("Authentication failed. Please try again.");
      }
    } else {
      console.log("fail", response);
    }
  }, [response]);

  useEffect(() => {
    if (auth?.userData?.uroleType === "GUEST") {
      navigation.navigate("Join");
    } else if (auth?.userData?.uroleType === "USER") {
      navigation.navigate("Home");
    }
  }, [auth?.userData]);

  return (
    <SafeAreaView style={styles.container}>
      <Swiper>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/family.png")}
            style={styles.imageStyle}
          />
          <Text fontSize="md" style={styles.description}>
            <Text>{i18n.t("first_1")}</Text>
            <Text style={styles.highlight}> Notinote</Text>
            <Text>{i18n.t("first_2")}</Text>
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/image-upload.png")}
            style={styles.imageStyle}
          />
          <Text fontSize="md" style={styles.description}>
            {i18n.t("second")}
          </Text>
        </View>
        <View style={styles.container}>
          <Image
            source={require("../assets/images/calendar.png")}
            style={styles.imageStyle}
          />
          <Text fontSize="md" style={styles.description}>
            {i18n.t("third")}
          </Text>
        </View>
      </Swiper>
      <TouchableHighlight
        style={styles.startButton}
        onPress={() => {
          promptAsync();
        }}
      >
        <Text fontWeight={600} style={styles.buttonStyle}>
          {i18n.t("start")}
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
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
    width: 320,
    height: 320,
  },
  highlight: {
    color: theme.colors.primary,
  },
  swipe: {
    marginTop: 100,
  },
  description: {
    width: "80%",
    height: 100,
  },
  startButton: {
    width: "90%",
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: Dimensions.get('window').height / Dimensions.get('window').width > 2 ? 26 : 30,
  },
  buttonStyle: {
    textAlign: "center",
    color: "white",
  },
  skipButton: {
    width: "90%",
    marginTop: 28,
  },
  skipText: {
    textAlign: "center",
    color: theme.colors.primary,
  },
});
