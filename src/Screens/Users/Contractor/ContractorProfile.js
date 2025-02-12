import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiManager from '../../API/Api';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';

const ConstractorProfile = () => {
  return (
    <ImageBackground
      source={require('../../../assets/Imgs/Background.png')}
      style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
          <Image
            style={{width: WIDTH(30), height: WIDTH(30), borderRadius: 50}}
            source={
              // userImage == ''
              //   ? userDetails?.length == []
              // ?
              require('../../../assets/Icons/avatar.jpg')
              //   : {uri: userDetails?.profileImg}
              // : {uri: userImage}
            }
            resizeMode="cover"
          />
        </View>

        <View style={styles.InputField}>
          <TextInput style={styles.text} />
        </View>

        <View style={styles.InputField}>
          <TextInput style={styles.text} />
        </View>

        <View style={styles.InputField}>
          <TextInput style={styles.text} />
        </View>

        <View style={styles.InputField}>
          <TextInput style={styles.text} />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ConstractorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  InputField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: WIDTH(91.5),
    height: HEIGHT(7.5),
    marginVertical: HEIGHT(1.5),
    borderRadius: 10,
    borderWidth: 1,
    paddingLeft: 12,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  name: {},
});
