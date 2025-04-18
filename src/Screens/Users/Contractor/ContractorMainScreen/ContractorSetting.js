import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
  BackHandler,
  Linking,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {HEIGHT, WIDTH} from '../../../../config/AppConst';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import COLOR from '../../../../config/color.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoutComp from '../../../../Component/LogoutComp/LogoutComp';
import ApiManager from '../../../../API/Api';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';

const ContractorSetting = () => {
  const navigation = useNavigation();
  const typeSelector = useSelector(state => state?.userTypee?.usertype);
  const [userId, setUserId] = useState('');
  const [userImage, setuserImage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setDeleteShowModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Check if the dashboard is the only screen in the stack
        if (navigation.canGoBack()) {
          return false; // Allow default back behavior
        }

        Alert.alert('Exit App', 'Do you want to exit?', [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Exit', onPress: () => BackHandler.exitApp()},
        ]);

        return true; // Prevent going back
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // return () => {
      //   BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      // };
    }, [navigation]),
  );

  useEffect(() => {
    const fetchUser = async () => {
      const userID = await AsyncStorage.getItem('userId');
      if (userID) setUserId(userID);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      CustomerProfileAPI();
    }
  }, [userId]);

  const CustomerProfileAPI = async () => {
    if (!userId) return;
    try {
      const res = await ApiManager.ContractorProfile(userId);
      if (res?.data?.status === 200) {
        setuserImage(res?.data?.['contractors ']?.profile_image || '');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const LogoutFunction = async () => {
    try {
      await AsyncStorage.clear();
      console.log('AsyncStorage cleared');
      navigation.reset({
        index: 0,
        routes: [{name: 'welcome'}],
      });
    } catch (error) {
      console.error('Error clearing AsyncStorage:', error);
    }
  };

  const AccountDeleteAPI = () => {
    ApiManager.DeleteAccount(typeSelector, userId)
      .then(async res => {
        if (res?.data?.status === 200) {
          console.log('res?.dataddd', res?.data);

          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
          navigation.replace('welcome');
          await AsyncStorage.clear();
          // navigation.reset({
          //   index: 0,
          //   routes: [{name: 'welcome'}],
          // });
        } else {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => {
        console.log(err?.response);
      });
  };

  return (
    <ImageBackground
      source={require('../../../../assets/Imgs/Background.png')}
      style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
          {/* <Image
            style={{
              width: WIDTH(30),
              height: WIDTH(30),
              borderRadius: 50,
              marginBottom: HEIGHT(2),
            }}
            source={{uri: userImage}}
            resizeMode="cover"
          /> */}
        </View>

        <TouchableOpacity
          style={styles.InputField}
          onPress={() => navigation.navigate('contractorprofile')}>
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
          onPress={() =>
            Linking.openURL('https://preworks.in/terms-condition/')
          }>
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

        <TouchableOpacity
          style={styles.InputField}
          onPress={() =>
            Linking.openURL('https://preworks.in/privacy-policy/')
          }>
          <View style={{flexDirection: 'row', gap: 6}}>
            <Image
              source={require('../../../../assets/settingsIcon/terms.png')}
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
  );
};

export default ContractorSetting;

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
