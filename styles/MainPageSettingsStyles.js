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
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    paddingTop: 27,
    paddingBottom: 23
  },
  title: {
    fontSize: 15,
    fontFamily: 'Pretendard',
  },
  value: {
    fontSize: 15,
    fontFamily: 'Pretendard',
    color: '#666',
  },
  logoutButton: {
    marginTop: 30,
    padding: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#000000',
    fontSize: 16,
  },
  unregistered: {
    color: 'red'
  }
});