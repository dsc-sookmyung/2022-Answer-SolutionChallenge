import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Image,
  ScrollView
} from "react-native";
import { Text } from "native-base";
import { theme } from "../core/theme";
import type { Navigation, UserData } from "../types";
import { useAuth } from "../contexts/Auth";
import { StackActions } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import HomeMenu from "../components/Home/HomeMenu";
import NoEventBox from "../components/Home/NoEventBox";
import i18n from "i18n-js";
import "../locales/i18n";

export default function HomeScreen({ navigation }: Navigation) {
  const cProfileImgSource = [
    require(`../assets/images/cprofile-images/profile-1.png`),
    require(`../assets/images/cprofile-images/profile-2.png`),
    require(`../assets/images/cprofile-images/profile-3.png`),
    require(`../assets/images/cprofile-images/profile-4.png`),
    require(`../assets/images/cprofile-images/profile-5.png`),
    require(`../assets/images/cprofile-images/profile-6.png`),
    require(`../assets/images/cprofile-images/profile-7.png`),
    require(`../assets/images/cprofile-images/profile-8.png`),
    require(`../assets/images/cprofile-images/profile-9.png`),
  ];
  const [events, setEvents] = useState<{
    event_num: number;
    children: {
      cid: number;
      cname: string;
      cprofileImg: number;
      events: string[];
    }[];
  }>({
    event_num: 2,
    children: [
      {
        cid: 1,
        cname: "Soo",
        cprofileImg: 2,
        events: ["the 17th Graduate Seremony", "Do-Dream Festival", "asdfasf", "소풍"],
      },
      {
        cid: 2,
        cname: "Hee",
        events: [],
        cprofileImg: 1,
      },
    ],
  });
  const SHOW_ALL = -1;
  const [nowSelectedChildId, setNowSelectedChildId] =
    useState<number>(SHOW_ALL);
  const [user, setUser] = useState<UserData>({
    uid: 1,
    username: "Soo",
    uemail: "kaithape@gmail.com",
    uprofileImg: 1,
    ulanguage: "english",
    uchildren: [
      { cid: 1, cname: "Soo", cprofileImg: 1 },
      { cid: 2, cname: "Hee", cprofileImg: 4 },
    ],
  });
  const auth = useAuth();

  useEffect(() => {
    if (auth?.userData) {
      setUser(auth?.userData);
    }

    navigation.setOptions({
      headerRight: () => <HomeMenu />,
    });

    if (auth?.authData?.access_token) {
      fetch("http://localhost:8080/user/children", {
        method: "GET",
        headers: {
          "ACCESS-TOKEN": auth.authData.access_token,
        },
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((data) => {
          setEvents(data);
          // console.log(data);
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.status == 401) {
            //redirect to login
            Alert.alert(i18n.t("sessionExpired"));
            auth.signOut();
            navigation.dispatch(StackActions.popToTop());
          }
        });
    }
  }, [auth]);

  const handleNowSelectedChildId = (cid: number) => {
    setNowSelectedChildId(cid);
  };

  return (
    <>
      {user && events && events.children?.length > 0 && (
        <SafeAreaView style={styles.container}>
          <ImageBackground
            source={require("../assets/images/home-button-background.png")}
            style={[styles.functionButtonImageBackground]}
            imageStyle={{ marginTop: -40 }}
          >
            <View style={styles.functionButtonWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Translate")}
              >
                <ImageBackground
                  source={require("../assets/images/pink-background-cropped.png")}
                  style={[styles.bigButton]}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={[styles.bigButtonContentWrapper]}>
                    <Text
                      style={[styles.buttonName, styles.deepBlue]}
                      fontWeight={700}
                      fontSize="xl"
                      pb={2}
                    >
                      {i18n.t("translate")}
                    </Text>
                    <MaterialIcons name="g-translate" size={32} color="#333" />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <ImageBackground
                  source={require("../assets/images/pink-background-cropped.png")}
                  style={[styles.bigButton]}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <View style={[styles.bigButtonContentWrapper]}>
                    <Text
                      style={[styles.buttonName, styles.deepBlue]}
                      fontWeight={700}
                      fontSize="xl"
                      pb={2}
                    >
                      {i18n.t("search")}
                    </Text>
                    <MaterialIcons name="search" size={32} color="#333" />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <View style={styles.noticeWrapper}>
            <Text
              style={styles.smallTitle}
              fontFamily="heading"
              fontWeight={700}
              fontStyle="normal"
              fontSize="xl"
              lineHeight={60}
            >{ 
                events.event_num === 0 ? i18n.t("noEvent") : 
                i18n.t("eventCount_1") +
                events.event_num +
                i18n.t("eventCount_2")
            }</Text>
            <ScrollView horizontal={true} style={styles.childButtonWrapper}>
              <TouchableOpacity
                key={"n_all"}
                style={[
                  styles.childButton,
                  {
                    backgroundColor:
                      nowSelectedChildId === SHOW_ALL
                        ? theme.colors.primary
                        : "#ffffff",
                  },
                ]}
                onPress={() => handleNowSelectedChildId(-1)}
              >
                <Text
                  fontWeight={500}
                  style={[
                    {
                      color:
                        nowSelectedChildId !== SHOW_ALL
                          ? theme.colors.primary
                          : "#ffffff",
                    },
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {events.children?.map((child, index) => (
                <TouchableOpacity
                  key={"n_" + index}
                  style={[
                    styles.childButton,
                    {
                      backgroundColor:
                        nowSelectedChildId === child.cid
                          ? theme.colors.primary
                          : "#ffffff",
                    },
                  ]}
                  onPress={() => handleNowSelectedChildId(child.cid)}
                >
                  <Image
                    style={styles.cprofileImage}
                    source={cProfileImgSource[child.cprofileImg]}
                  />
                  <Text
                    fontWeight={500}
                    style={[
                      {
                        color:
                          nowSelectedChildId !== child.cid
                            ? theme.colors.primary
                            : "#ffffff",
                      },
                    ]}
                  >
                    {child.cname}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <ScrollView style={styles.todayNoticeWrapper}>
              {nowSelectedChildId === SHOW_ALL ? (
                events?.children.reduce(
                  (prevValue, child) => prevValue + child.events.length,
                  0
                ) > 0 ? (
                  events?.children.map((notice, index) =>
                    notice.events.map((event, index) => {
                      return (
                        <View
                          key={"n_" + index}
                          style={[styles.pinkButton, { flexDirection: "row" }]}
                        >
                          <MaterialIcons
                            name="event"
                            size={20}
                            color="#333"
                            style={{ marginRight: 8, marginTop: 4 }}
                          />
                          <Text
                            key={"t_" + index}
                            fontWeight={400}
                            fontStyle="normal"
                            fontSize="sm"
                            lineHeight={28}
                          >
                            {`[${notice.cname}] ` + event}
                          </Text>
                        </View>
                      );
                    })
                  )
                ) : (
                  <NoEventBox />
                )
              ) : events.children.filter(
                  (child) => child.cid === nowSelectedChildId
                )[0]?.events?.length ? (
                events.children
                  ?.filter((child) => child.cid === nowSelectedChildId)[0]
                  .events?.map((item, index) => (
                    <View
                      key={"e_" + index}
                      style={[styles.pinkButton, { flexDirection: "row" }]}
                    >
                      <MaterialIcons
                        name="event"
                        size={20}
                        color="#333"
                        style={{ marginRight: 8, marginTop: 4 }}
                      />
                      <Text
                        fontWeight={400}
                        fontStyle="normal"
                        fontSize="sm"
                        lineHeight={28}
                      >
                        {item}
                      </Text>
                    </View>
                  ))
              ) : (
                <NoEventBox />
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  buttonImage: {
    position: "absolute",
    top: 8,
    right: 0,
    width: 190,
    height: 190,
    alignSelf: "flex-end",
  },
  container: {
    backgroundColor: "#ffffff",
    padding: 20,
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  profile: {
    height: 92,
    width: "90%",
    margin: 22,
    borderRadius: 20,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  noticeWrapper: {
    width: "88%",
    flex: 1.2,
    marginBottom: 18,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    shadowColor: "#5a5555",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
  },
  childButtonWrapper: {
    flexDirection: "row",
    maxHeight: 40,
    marginLeft: 8,
    marginRight: 8
  },
  childButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    height: 40,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginRight: 12,
  },
  todayNoticeWrapper: {
    alignSelf: "flex-start",
    paddingTop: 12,
    paddingHorizontal: 12,
    overflow: "scroll",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  profileImage: {
    width: 60,
    height: 60,
  },
  profielTextWrapper: {
    paddingRight: 30,
  },
  functionButtonImageBackground: {
    flex: 1.14,
    flexDirection: "row",
    alignItems: "center",
  },
  functionButtonWrapper: {
    flex: 1,
    marginHorizontal: 20,
  },
  smallTitle: {
    marginBottom: 0,
    marginLeft: 8,
  },
  buttonName: {
    fontSize: 24,
  },
  bigButton: {
    padding: 34,
    marginBottom: 20,
    borderRadius: 16,
    height: 100,
  },
  bigButtonContentWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deepBlue: {
    color: "#333333",
  },
  lightPink: {
    color: theme.colors.primary,
  },
  emptyBox: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cprofileImage: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  pinkButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: "100%",
  },
});
