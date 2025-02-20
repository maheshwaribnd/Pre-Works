import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import CustomHeader from '../../../../Component/CustomeHeader/CustomHeader';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import LogoutComp from '../../../../Component/LogoutComp/LogoutComp';
import EditIcon from '../../../../assets/Svg/edit.svg';
import ApiManager from '../../../../API/Api';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';

const ArchitectSetting = () => {
  const navigation = useNavigation();

  const typeSelector = useSelector(state => state.userTypee.usertype);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setDeleteShowModal] = useState(false);
  const [userId, setUserId] = useState('');
  const [edit, setEdit] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  const AccountDeleteAPI = () => {
    ApiManager.DeleteAccount(typeSelector, userId)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.navigate('welcome');
        } else {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const LogoutFunction = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
      navigation.navigate('welcome');
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
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
            <TouchableOpacity
              style={styles.InputField}
              onPress={() =>
                navigation.navigate('architectprofile', {
                  edit: edit,
                  setEdit: setEdit,
                })
              }>
              <View
                style={{flexDirection: 'row', gap: 6, alignItems: 'center'}}>
                <EditIcon color="green" />
                <Text style={styles.name}>Edit Profile</Text>
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
                onpress={() => AccountDeleteAPI()}
              />
            ) : null}

            <TouchableOpacity
              style={styles.InputField}
              onPress={() => setShowModal(true)}>
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
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

export default ArchitectSetting;

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
});
