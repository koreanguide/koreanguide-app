import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 30,
        paddingRight: 30
      },
      headerTextController: {
        marginTop: 40
      },
      headerTitle: {
        fontSize: 24,
        fontFamily: 'PretendardBold',
        marginBottom: 15
      },
      headerSubTitle: {
        fontSize: 15,
        lineHeight: 30,
        color: '#616161'
      },
      chatItemContainer: {
        flexDirection: "row",
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      chatTextContainer: {
        paddingLeft: 5,
        flex: 1,
        justifyContent: "center",
      },
      nameText: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: 'Pretendard',
      },
      lastMessageText: {
        color: "#888",
        marginTop: 8,
        fontFamily: 'Pretendard',
      },
      lastTalkedAtText: {
        color: "#888",
        fontFamily: 'Pretendard',
      },
});