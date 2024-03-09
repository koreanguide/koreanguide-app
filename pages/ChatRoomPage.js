import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  Button,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from "react-native";
import { Header } from "react-native-elements";
import { WithLocalSvg } from "react-native-svg/css";
import { Ionicons } from "@expo/vector-icons";
import chatStyles from "../styles/ChatPageStyles";
import SendLogo from "../assets/paper-plane-solid.svg";
import MoreLogo from "../assets/plus-solid.svg";
import { API_URL, WS_URL } from '@env'

const formatDate = (date) => {
  const dateObj = new Date(date);
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? "오후" : "오전";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${ampm} ${formattedHours}:${formattedMinutes}`;
};

export default function ChatRoomPage({ route, navigation }) {
  const chatRoomId = route.params.chatRoomId;
  const userId = route.params.userId;
  const opponentName = route.params.opponentName;
  console.log(opponentName);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Websocket connection attempt...");
    socket.current = new WebSocket(WS_URL);
    console.log("Websocket connected.");

    fetch(API_URL + `/chat/msg?chatRoomId=${chatRoomId}`)
      .then((response) => response.json())
      .then((data) => {
        setChatMessages(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    socket.current.onopen = () => {
      console.log("Sending ENTER message...");
      socket.current.send(
        JSON.stringify({
          messageType: "ENTER",
          chatRoomId: chatRoomId,
          senderId: userId,
          message: "WELCOME MESSAGE",
          useFunction: false,
          useTrackFunction: false,
          targetTrackId: 0,
          useAppointmentFunction: false,
          targetAppointmentId: 0,
          useCancelAppointmentFunction: false,
        })
      );
      console.log("ENTER message sent.");
    };

    socket.current.onmessage = (e) => {
      const message = JSON.parse(e.data);
      console.log("Message received from websocket:", message);
      setChatMessages((prevChatMessages) => [...prevChatMessages, message]);
    };

    return () => {
      console.log("Disconnecting websocket...");
      socket.current.close();
      console.log("Websocket disconnected.");
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage) {
      console.log("Sending TALK message...");
      socket.current.send(
        JSON.stringify({
          messageType: "TALK",
          chatRoomId: chatRoomId,
          senderId: userId,
          message: newMessage,
          useFunction: false,
          useTrackFunction: false,
          targetTrackId: 0,
          useAppointmentFunction: false,
          targetAppointmentId: 0,
          useCancelAppointmentFunction: false,
        })
      );
      console.info(newMessage);
      console.log("TALK message sent.");
      setNewMessage("");
    }
  };

  const ChatMessageItem = ({ item }) => {
    const isMyMessage = Number(item.senderId) === Number(userId);

    return (
      <View
        style={
          isMyMessage
            ? chatStyles.myMessageContainer
            : chatStyles.otherMessageContainer
        }
      >
        {isMyMessage ? (
          <>
            <Text style={chatStyles.dateText}>{formatDate(item.date)}</Text>
            <View style={chatStyles.messageBubble}>
              <Text style={chatStyles.myMessageText}>{item.message}</Text>
              <Text style={chatStyles.myTranslatedText}>번역된 메시지</Text>
            </View>
          </>
        ) : (
          <>
            <Image
              source={{ uri: item.profileUrl }}
              style={chatStyles.profileImage}
            />
            <View style={chatStyles.otherMessageBubble}>
              <Text style={chatStyles.otherMessageText}>{item.message}</Text>
              <Text style={chatStyles.otherTranslatedText}>번역된 메시지</Text>
            </View>
            <Text style={chatStyles.dateText}>{formatDate(item.date)}</Text>
          </>
        )}
      </View>
    );
  };

  return isLoading ? (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-30}
      style={{ flex: 1, backgroundColor: "#fff" }}
    >
      <StatusBar barStyle="dark-content" />
      <Header
        leftComponent={
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => navigation.goBack()}
          />
        }
        centerComponent={{
          text: opponentName,
          style: { color: "black", fontSize: 15, marginTop: 7 },
        }}
        containerStyle={{
          backgroundColor: "white",
          justifyContent: "space-around",
          borderBottomColor: "#f1f1f1",
          borderBottomWidth: 1,
        }}
      />
      <View style={chatStyles.container}>
        <FlatList
          inverted
          data={[...chatMessages].reverse()}
          renderItem={({ item }) => <ChatMessageItem item={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={chatStyles.inputContainer}>
          <View style={chatStyles.iconContainer}>
            <WithLocalSvg
              width={14}
              height={14}
              fill={"#000000"}
              asset={MoreLogo}
            />
          </View>
          <TextInput
            style={chatStyles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="메시지를 입력하세요"
          />
          <TouchableOpacity
            style={chatStyles.iconContainer}
            onPress={handleSendMessage}
          >
            <WithLocalSvg
              width={14}
              height={14}
              fill={"#000000"}
              asset={SendLogo}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
