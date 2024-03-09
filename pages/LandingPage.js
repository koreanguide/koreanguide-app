import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";
import { WithLocalSvg } from "react-native-svg/css";
import Logo from "../assets/kg-logo-white.svg";
import EmailIcon from "../assets/email-icon.svg";
import PasswordIcon from "../assets/password-icon.svg";
import KakaoLogo from "../assets/kakao-logo.svg";
import NaverLogo from "../assets/naver-logo.svg";
import FacebookLogo from "../assets/facebook-logo.svg";
import GoogleLogo from "../assets/google-logo.svg";
import AppleLogo from "../assets/apple-logo.svg";
import { API_URL } from '@env'

export default function LandingPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch(API_URL + "/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (data.accessToken) {
      try {
        await AsyncStorage.setItem("accessToken", data.accessToken);
        await AsyncStorage.setItem("refreshToken", data.refreshToken);
        navigation.navigate("Main");
      } catch (error) {
        console.log(error);
        Alert.alert("저장 오류", "토큰 저장에 실패하였습니다. 다시 시도해 주세요.");
      }
    } else {
      Alert.alert("로그인 실패", "로그인에 실패하였습니다. 다시 시도해 주세요."); 
    }    
  };

  return (
    <LinearGradient
      colors={["#730EF4", "#C1A0ED"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <WithLocalSvg width={176} height={24} fill={"#000000"} asset={Logo} />
      <Text style={styles.title}>
        이메일 로그인 또는 소셜 로그인이 필요합니다.
      </Text>
      <View style={styles.inputContainer}>
        <WithLocalSvg
          width={16}
          height={16}
          fill={"#000000"}
          asset={EmailIcon}
        />
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="이메일 주소"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <WithLocalSvg
          width={16}
          height={16}
          fill={"#000000"}
          asset={PasswordIcon}
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="비밀번호"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>시작하기</Text>
      </TouchableOpacity>
      <Text style={styles.subTitle}>소셜 로그인으로 시작하기</Text>
      <View style={styles.socialContainer}>
        <WithLocalSvg
          width={34.73}
          height={34.73}
          fill={"#000000"}
          asset={KakaoLogo}
          style={styles.socialIcon}
        />
        <WithLocalSvg
          width={34.73}
          height={34.73}
          fill={"#000000"}
          asset={NaverLogo}
          style={styles.socialIcon}
        />
        <WithLocalSvg
          width={34.73}
          height={34.73}
          fill={"#000000"}
          asset={FacebookLogo}
          style={styles.socialIcon}
        />
        <WithLocalSvg
          width={34.73}
          height={34.73}
          fill={"#000000"}
          asset={GoogleLogo}
          style={styles.socialIcon}
        />
        <WithLocalSvg
          width={34.73}
          height={34.73}
          fill={"#000000"}
          asset={AppleLogo}
        />
      </View>
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#FFF",
    textAlign: "center",
    padding: 28,
    marginBottom: 15,
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.48,
  },
  subTitle: {
    color: "#FFF",
    textAlign: "center",
    padding: 69,
    marginBottom: -53,
    fontFamily: "Pretendard",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: -0.48,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: 308,
    height: 43,
    backgroundColor: "rgba(255, 255, 255, 0.40)",
    borderRadius: 100,
    paddingLeft: 20,
  },
  input: {
    marginLeft: 10,
    color: "rgba(255, 255, 255, 0.7)",
    width: "80%",
    height: "100%",
  },
  button: {
    width: 308,
    height: 43,
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
  },
  buttonText: {
    color: "#730EF4",
    fontSize: 14,
    textAlign: "center",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  socialIcon: {
    marginRight: 20.84,
  },
});
