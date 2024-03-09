import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingLeft: 30,
        paddingRight: 30
      },
      locationController: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center'
      },
      locationText: {
        marginLeft: 10,
        fontSize: 15
      },
      headerTextController: {
        marginTop: 10
      },
      headerTitle: {
        fontSize: 24,
        fontFamily: 'PretendardBold',
        marginBottom: 15
      },
      headerSubTitle: {
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 30,
        color: '#616161'
      },
      linkToWebBtn: {
        width: '100%',
        marginTop: 30,
        paddingTop: 30,
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 10,
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        alignItems: 'center'
      },
      linkToWebBtnText: {
        marginLeft: 10,
        fontSize: 13,
        color: '#616161'
      }
});