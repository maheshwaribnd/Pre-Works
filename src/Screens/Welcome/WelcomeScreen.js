import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import COLOR from '../../config/color.json';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {userTypeFunction} from '../../Redux/Reducers/userType';

const WelcomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const Options = [
    {id: 1, name: 'CUSTOMERS', type: 'customer'},
    {id: 2, name: 'CONTRACTOR', type: 'contractor'},
    {id: 3, name: 'ARCHITECT', type: 'architect'},
  ];

  setTimeout(async () => {
    const getCustomerData = await AsyncStorage.getItem('CustomerData');
    console.log('getCustomerData', getCustomerData);

    const getContractorData = await AsyncStorage.getItem('ContractorData');
    console.log('getContractor', getContractorData);

    const getArchitechData = await AsyncStorage.getItem('ArchitechData');
    console.log('getArchitechData', getArchitechData);

    if (getCustomerData) {
      navigation.navigate('customerTabs');
    } else if (getContractorData) {
      navigation.navigate('contractorTabs');
    } else if (getArchitechData) {
      navigation.navigate('architectTabs');
    }
  }, 200)

  const SelectUserFunction = async item => {
    navigation.navigate('login', {userType: item.type});
    await AsyncStorage.setItem('userRole', JSON.parse(item.type));
    dispatch(userTypeFunction({usertype: item.type}));
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <Image
        source={require('../../assets/Imgs/logo.png')}
        height={20}
        width={20}
        style={{marginTop: HEIGHT(2)}}
      />

      <Text style={styles.welcomeTxt}>Welcome</Text>

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
    </ImageBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
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
});
