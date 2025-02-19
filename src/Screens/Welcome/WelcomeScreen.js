import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import COLOR from '../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {userTypeFunction} from '../../Redux/Reducers/userType';
import ApiManager from '../../API/Api';

const WelcomeScreen = () => {


  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [userId, setUserId] = useState('');

  const Options = [
    {id: 1, name: 'CUSTOMER', type: 'customer'},
    {id: 2, name: 'CONTRACTOR', type: 'contractor'},
    {id: 3, name: 'ARCHITECT', type: 'architect'},
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = await AsyncStorage.getItem('userId');
        setUserId(userID);
        console.log('UserID:', userID);
      } catch (error) {
        console.error('Error in fetching data:', error);
      }
    };

    fetchData();
    const checkStoredData = async () => {
      try {
        const getCustomerData = await AsyncStorage.getItem('CustomerData');
        console.log('getCustomerData', getCustomerData);

        const getContractorData = await AsyncStorage.getItem('ContractorData');
        console.log('getContractorData', getContractorData);

        const getArchitechData = await AsyncStorage.getItem('ArchitechData');
        console.log('getArchitechData', getArchitechData);

        const successStatus = await AsyncStorage.getItem('successStatus');
        console.log('successStatus', successStatus);

        if (getCustomerData || successStatus === true) {
          navigation.navigate('customerTabs');
        } else if (getContractorData || successStatus === true) {
          navigation.navigate('contractorTabs');
        } else if (getArchitechData || successStatus === true) {
          navigation.navigate('architectTabs');
        }
      } catch (error) {
        console.error('Error fetching AsyncStorage data:', error);
      }
    };

    setTimeout(checkStoredData, 200);
  }, []);

  const SelectUserFunction = async item => {
    await AsyncStorage.setItem('userRole', item.type);
    dispatch(userTypeFunction({usertype: item.type}));
    navigation.navigate('login', {userType: item.type});
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <Image
        source={require('../../assets/Imgs/logo.png')}
        style={{height: 120, width: 150}}
      />

      <Text style={styles.welcomeTxt}>Welcome!</Text>

      <Text style={styles.txt}>Please register with below options</Text>

      <View style={{marginTop: 16}}>
        {Options.map(item => {
          return (
            <TouchableOpacity
              key={item?.id}
              style={[styles.button, item.id === 3 && {borderColor: '#F98126'}]}
              onPress={() => SelectUserFunction(item)}>
              <Text style={styles.btnTxt}>{item?.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.bottomContainer}>
        <Image
          source={require('../../assets/Imgs/welcomImg.png')}
          style={styles.bottomImage}
        />
      </View>
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingTop: HEIGHT(10),
    // justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeTxt: {
    fontSize: 28,
    fontFamily: NotoSans_Medium,
    color: COLOR.TextColor,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  txt: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: COLOR.Gray9,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: HEIGHT(7.5),
    width: WIDTH(52),
    marginVertical: HEIGHT(1.5),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLOR.TextLightColor,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 7,
  },

  btnTxt: {
    fontSize: 16,
    // fontFamily: NotoSans_Medium,
    color: '#373737',
    textAlign: 'center',
  },

  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },

  bottomImage: {
    width: WIDTH(100),
    height: HEIGHT(20),
    // resizeMode: 'contain',
  },
});
