import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingPage from './pages/LandingPage';
import MainPage from './pages/MainPage';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import ChatRoomPage from './pages/ChatRoomPage';
import InitialLoadingScreen from './InitialLoadingScreen';

const Stack = createStackNavigator();

const loadAssetsAsync = async () => {
  await Font.loadAsync({
    Pretendard: require('./assets/fonts/Pretendard-Regular.otf'),
    PretendardBold: require('./assets/fonts/Pretendard-Bold.otf'),
  });
};

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    loadAssetsAsync()
      .then(() => setIsReady(true))
      .catch(console.error)
      .finally(() => SplashScreen.hideAsync());
  }, []);

  if (!isReady) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InitialLoadingScreen">
        <Stack.Screen 
          name="InitialLoadingScreen"
          component={InitialLoadingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Landing"
          component={LandingPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main"
          component={MainPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ChatRoom"
          component={ChatRoomPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
