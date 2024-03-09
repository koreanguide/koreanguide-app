import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { API_URL } from '@env'

export default function InitialLoadingScreen({ navigation }) {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (token) {
          console.info("InitialLoadingScreen: Access Token이 발견 됨 " + token);
          const checkTokenResponse = await axios.post(
            API_URL + "/token",
            {
              refreshToken: token,
            }
          );

          console.info("InitialLoadingScreen: Access Token 유효성 인증 요청")

          if(checkTokenResponse.status !== 200) {
            console.info("InitialLoadingScreen: Access Token이 유효하지 않아 재발급")
            const getNewAccessTokenResponse = await axios.post(
              API_URL + "/refresh",
              {
                refreshToken: refreshToken
              }
            );

            if(getNewAccessTokenResponse.status !== 200) {
              console.info("InitialLoadingScreen: Refresh Token이 유효하지 않아 재로그인 요청")
              navigation.replace('Landing');
            } else {
              console.info("InitialLoadingScreen: Refresh Token으로 재발급에 성공하여 토큰 재저장")
              await AsyncStorage.setItem("accessToken", getNewAccessTokenResponse.data.accessToken);
              await AsyncStorage.setItem("refreshToken", getNewAccessTokenResponse.data.refreshToken);
            }
          }

          console.info("InitialLoadingScreen: Access Token 유효성 인증이 완료되어 메인 페이지로 이동")
          navigation.replace('Main');
        } else {
          navigation.replace('Landing');
        }
      } catch (error) {
        console.error("InitialLoadingScreen: 에러 발생", error);
        navigation.replace('Landing');
      }
    };

    checkToken();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>자동 로그인 중...</Text>
    </View>
  );
}