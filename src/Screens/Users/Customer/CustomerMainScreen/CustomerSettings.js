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
} from '../../../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiManager from '../../API/Api';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import LogoutComp from '../../../../Component/LogoutComp/LogoutComp';

const CustomerSettings = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setDeleteShowModal] = useState(false);

  const LogoutFunction = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate('welcome');
      console.log('AsyncStorage cleared');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const DeletFunction = () => {
    console.log('delete Account');
  };

  return (
    <View style={{flex: 1}}>
      <CustomHeader name="Setting" />
      <ImageBackground
        source={require('../../../../assets/Imgs/Background.png')}
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
                require('../../../../assets/Icons/avatar.jpg')
                //   : {uri: userDetails?.profileImg}
                // : {uri: userImage}
              }
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity
            style={styles.InputField}
            onPress={() => navigation.navigate('customerprofilescreen')}>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Image
                source={require('../../../../assets/settingsIcon/user.png')}
                height={5}
                width={5}
                resizeMode="contain"
              />
              <Text style={styles.name}>Profile</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.InputField}
            onPress={() => navigation.navigate('architectlist')}>
            <View style={{flexDirection: 'row', gap: 6}}>
              {/* <Image
              source={require('../../../../assets/settingsIcon/user.png')}
              height={5}
              width={5}
              resizeMode="contain"
            /> */}
              <Text style={styles.name}>Architect List</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.InputField}>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Image
                source={require('../../../../assets/settingsIcon/terms.png')}
                height={5}
                width={5}
                resizeMode="contain"
              />
              <Text style={styles.name}>Terms & Condition</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.InputField}>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Image
                source={require('../../../../assets/settingsIcon/privacy.png')}
                height={5}
                width={5}
                resizeMode="contain"
              />
              <Text style={styles.name}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.InputField}>
            <View style={{flexDirection: 'row', gap: 6}}>
              {/* <Image
              source={require('../../../../assets/settingsIcon/user.png')}
              height={5}
              width={5}
              resizeMode="contain"
            /> */}
              <Text style={styles.name}>Notifications</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.InputField}
            onPress={() => setDeleteShowModal(true)}>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Image
                source={require('../../../../assets/settingsIcon/deleteAccount.png')}
                height={5}
                width={5}
                resizeMode="contain"
              />
              <Text style={styles.name}>Delete My Account</Text>
            </View>
          </TouchableOpacity>

          {showDeleteModal ? (
            <LogoutComp
              showModal={showDeleteModal}
              setShowModal={setDeleteShowModal}
              text="Delete Account"
              onpress={DeletFunction()}
            />
          ) : null}

          <TouchableOpacity
            style={styles.InputField}
            onPress={() => {
              setShowModal(true), console.log('log');
            }}>
            <View style={{flexDirection: 'row', gap: 6}}>
              <Image
                source={require('../../../../assets/settingsIcon/logout.png')}
                height={5}
                width={5}
                resizeMode="contain"
              />
              <Text style={styles.name}>Log Out</Text>
            </View>
          </TouchableOpacity>

          {showModal ? (
            <LogoutComp
              showModal={showModal}
              setShowModal={setShowModal}
              text="Logout"
              onpress={() => LogoutFunction()}
            />
          ) : null}
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default CustomerSettings;

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
