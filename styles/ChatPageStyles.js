import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f1f1',
    borderColor: '#f1f1f1',
    borderWidth: 0.5
  },
  myMessageText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#000',
  },
  otherMessageText: {
    fontSize: 14,
    textAlign: 'left',
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 40,
    backgroundColor: '#f7f8fd',
    alignItems: 'center'
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#730EF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontFamily: 'Pretendard',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 30,
    paddingLeft: 25,
    paddingRight: 10,
    marginRight: 7,
    marginLeft: 7
  },
  myMessageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    margin: 10,
    alignSelf: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
  },
  messageBubble: {
    backgroundColor: '#f8f8f9',
    borderRadius: 15,
    padding: 10,
  },
  otherMessageBubble: {
    backgroundColor: '#ecf2ff',
    borderRadius: 15,
    padding: 10,
    marginRight: 10
  },
  myTranslatedText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'right'
  },
  otherTranslatedText: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
    textAlign: 'left'
  },
  dateText: {
    fontSize: 11,
    color: '#aaa',
    marginRight: 15
  },
});