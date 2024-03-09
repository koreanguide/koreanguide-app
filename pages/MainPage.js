import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  Text,
  Image,
  Button,
  Alert,
  TouchableOpacity,
  Linking,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location";
import Logo from "../assets/kg-main-logo-blue.svg";
import { WithLocalSvg } from "react-native-svg/css";
import GpsLogo from "../assets/gps-logo.svg";
import ExternalLogo from "../assets/arrow-up-right-from-square-solid.svg";
import homeStyles from "../styles/MainPageHomeStyles";
import exploreStyles from "../styles/MainPageExploreStyles";
import settingsStyles from "../styles/MainPageSettingsStyles";
import chatStyles from "../styles/MainPageChatStyles";
import { API_URL, KAKAO_TOKEN, OPENWEATHERMAP_TOKEN } from '@env'

const Tab = createBottomTabNavigator();

async function refreshToken() {
  let token;
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    const response = await axios.post(
      API_URL + "/refresh",
      {
        refreshToken: refreshToken,
      }
    );

    token = response.data.accessToken;
    await AsyncStorage.setItem("accessToken", token);
  } catch (error) {
    console.error("토큰을 재발급하는 도중 에러 발생", error);
  }

  return token;
}

function ViewHomeScreen({ profile }) {
  const [location, setLocation] = useState("서울특별시 중구");
  const [weatherInfo, setWeatherInfo] = useState({});
  const [weatherTempInfo, setWeatherTempInfo] = useState({});

  const updateLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "위치 정보를 가져오는 데 실패했습니다.",
          "위치 접근 권한이 필요합니다."
        );
        return;
      }

      let position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`,
        {
          headers: {
            Authorization: "KakaoAK " + KAKAO_TOKEN,
          },
        }
      );

      if (response.data.documents && response.data.documents.length > 0) {
        setLocation(
          response.data.documents[0].region_1depth_name +
            " " +
            response.data.documents[0].region_2depth_name
        );
      }

      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=` + OPENWEATHERMAP_TOKEN + `&lang=kr&units=metric`
      );

      setWeatherInfo(weatherResponse.data.weather[0]);
      setWeatherTempInfo(weatherResponse.data.main);
    } catch (error) {
      Alert.alert("위치 정보를 가져오는데 실패했습니다.", error.message);
    }
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return (
    <View style={homeStyles.container}>
      <View style={homeStyles.locationController}>
        <WithLocalSvg width={18} height={18} fill={"#000000"} asset={GpsLogo} />
        <TouchableOpacity onPress={updateLocation}>
          <Text style={homeStyles.locationText}>{location}</Text>
        </TouchableOpacity>
      </View>
      <View style={homeStyles.headerTextController}>
        <Text style={homeStyles.headerTitle}>
          안녕하세요, {profile.name}님!
        </Text>
        <Text style={homeStyles.headerSubTitle}>
          오늘 날씨는 {weatherInfo.description}이고,
        </Text>
        <Text style={homeStyles.headerSubTitle}>
          기온은 현재 {Math.round(weatherTempInfo.temp)}도, 최고{" "}
          {Math.round(weatherTempInfo.temp_max)}도를 기록할 전망이예요.
        </Text>
      </View>
      <View style={homeStyles.linkToWebBtn}>
        <WithLocalSvg
          width={15}
          height={15}
          fill={"#000000"}
          asset={ExternalLogo}
        />
        <TouchableOpacity onPress={() => Linking.openURL("https://naver.com")}>
          <Text style={homeStyles.linkToWebBtnText}>
            KOREAN GUIDE Portal 이동하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function formatDate(dateString) {
  const inputDate = new Date(dateString);
  const now = new Date();

  if (inputDate.toDateString() === now.toDateString()) {
    return inputDate.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: 'numeric', hour12: true });
  } else {
    return inputDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' });
  }
}

function ChatItem({ item, navigation }) {
  const handleChatItemPress = () => {
    navigation.navigate('ChatRoom', {
       chatRoomId: item.chatRoomId,
       userId: '3',
       opponentName: item.name
      });
  };

  const lastTalkedAt = formatDate(item.lastTalkedAt);

  return (
    <TouchableOpacity style={chatStyles.chatItemContainer} onPress={handleChatItemPress}>
      {item.profileUrl === "DEFAULT" ? (
        <View
          style={[chatStyles.profileImage, { backgroundColor: "#f1f1f1" }]}
        />
      ) : (
        <Image
          source={{ uri: item.profileUrl }}
          style={chatStyles.profileImage}
        />
      )}
      <View style={chatStyles.chatTextContainer}>
        <Text style={chatStyles.nameText}>{item.name}</Text>
        <Text style={chatStyles.lastMessageText}>{item.lastMessage}</Text>
      </View>
      <Text style={chatStyles.lastTalkedAtText}>{lastTalkedAt}</Text>
    </TouchableOpacity>
  );
}

function ViewChatScreen({ navigation }) {
  const [chatList, setChatList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchChatList = async () => {
        const token = await AsyncStorage.getItem("accessToken");

        console.info(token);

        if (!token) {
          console.log("토큰이 존재하지 않습니다.");
          return;
        }

        const response = await axios.get(
          API_URL + "/chat/list",
          {
            headers: {
              "X-AUTH-TOKEN": token,
            },
          }
        );

        if (response.status !== 200) {
          token = await refreshToken();

          response = await axios.get(
            API_URL + "/chat/list",
            {
              headers: {
                "X-AUTH-TOKEN": token,
              },
            }
          );
        }
        setChatList(response.data);
      };

      fetchChatList();

      return () => {
        setChatList([]);
      };
    }, [])
  );

  return (
    <View style={chatStyles.container}>
      <View style={chatStyles.headerTextController}>
        <Text style={chatStyles.headerTitle}>채팅</Text>
      </View>
      <FlatList
        data={chatList}
        renderItem={({ item }) => <ChatItem item={item} navigation={navigation} />}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
}

function ViewExploreScreen() {
  return (
    <View style={exploreStyles.container}>
      <View style={exploreStyles.headerTextController}>
        <Text style={exploreStyles.headerTitle}>탐색하기</Text>
      </View>
    </View>
  );
}

function ViewSettingsScreen({ navigation }) {
  const [myinfo, setMyinfo] = useState([]);

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (!token) {
        console.log("토큰이 존재하지 않습니다.");
        return;
      }

      const response = await axios.get(
        API_URL + "/profile/mypage",
        {
          headers: {
            "X-AUTH-TOKEN": token,
          },
        }
      );

      if (response.status !== 200) {
        token = await refreshToken();

        response = await axios.get(
          API_URL + "/profile/mypage",
          {
            headers: {
              "X-AUTH-TOKEN": token,
            },
          }
        );
      }
      setMyinfo(response.data);
    } catch (error) {
      Alert.alert("오류 발생", "프로필 정보를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Landing" }],
      });
      Alert.alert("로그아웃이 완료되었습니다.");
    } catch (error) {
      Alert.alert("로그아웃 실패", "다시 시도해주세요.");
    }
  };

  return (
    <View style={settingsStyles.container}>
      <View style={settingsStyles.headerTextController}>
        <Text style={settingsStyles.headerTitle}>내 정보</Text>
      </View>
      <View style={settingsStyles.sectionRow}>
        <Text style={settingsStyles.title}>이메일 주소</Text>
        <Text style={settingsStyles.value}>{myinfo.email}</Text>
      </View>
      <View style={settingsStyles.sectionRow}>
        <Text style={settingsStyles.title}>비밀번호</Text>
        <Text style={settingsStyles.value}>{myinfo.password}</Text>
      </View>
      <View style={settingsStyles.sectionRow}>
        <Text style={settingsStyles.title}>이름</Text>
        <Text
          style={
            myinfo.name ? settingsStyles.value : settingsStyles.unregistered
          }
        >
          {myinfo.name || "미등록"}
        </Text>
      </View>
      <View style={settingsStyles.sectionRow}>
        <Text style={settingsStyles.title}>전화번호</Text>
        <Text
          style={
            myinfo.name ? settingsStyles.value : settingsStyles.unregistered
          }
        >
          {myinfo.name || "미등록"}
        </Text>
      </View>
      <View style={settingsStyles.sectionRow}>
        <Text style={settingsStyles.title}>가입일</Text>
        <Text style={settingsStyles.value}>{myinfo.registeredAt}</Text>
      </View>
      <TouchableOpacity
        onPress={handleLogout}
        style={settingsStyles.logoutButton}
      >
        <Text style={settingsStyles.logoutButtonText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function MainPage({ navigation }) {
  const [profile, setProfile] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        try {
          let token = await AsyncStorage.getItem("accessToken");

          if (!token) {
            throw new Error("토큰이 존재하지 않습니다.");
          }

          let response = await axios.get(
            API_URL + "/profile/infobox",
            {
              headers: {
                "X-AUTH-TOKEN": token,
              },
            }
          );

          if (response.status !== 200) {
            token = await refreshToken();

            response = await axios.get(
              API_URL + "/profile/infobox",
              {
                headers: {
                  "X-AUTH-TOKEN": token,
                },
              }
            );
          }

          setProfile(response.data);
        } catch (error) {
          console.error("Profile 정보 조회 오류");
        }
      };

      fetchProfile();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          height: 56,
          paddingHorizontal: 30,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <WithLocalSvg width={138} height={18} fill={"#000000"} asset={Logo} />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {profile.credit ? (
            <Text
              style={{
                color: "#730EF4",
                fontFamily: "Pretendard",
                fontSize: 13,
                fontWeight: "500",
                marginRight: 15,
              }}
            >
              {profile.credit.toLocaleString()} 크레딧
            </Text>
          ) : null}
          {profile.profileUrl && (
            <Image
              source={{ uri: profile.profileUrl }}
              style={{ width: 44, height: 44, borderRadius: 100, borderColor: '#f1f1f1', borderWidth: 1 }}
            />
          )}
        </View>
      </View>

      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="Home"
          children={() => <ViewHomeScreen profile={profile} />}
          options={{
            title: "홈",
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={ViewExploreScreen}
          options={{
            title: "탐색",
            tabBarIcon: ({ color, size }) => (
              <Icon name="search" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Chat"
          component={ViewChatScreen}
          options={{
            title: "채팅",
            tabBarIcon: ({ color, size }) => (
              <Icon name="chat" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={ViewSettingsScreen}
          options={{
            title: "설정",
            tabBarIcon: ({ color, size }) => (
              <Icon name="settings" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}
