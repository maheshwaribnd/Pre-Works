import {StyleSheet, Image, ImageBackground} from 'react-native';
import colors from '../../config/color.json';
import React, {useEffect} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Medium,
  Rochester,
  WIDTH,
} from '../../config/AppConst';
import COLOR from '../../config/color.json';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const navigateUser = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Get user data
        const userData = await AsyncStorage.getItem('userData');
        const data = userData ? JSON.parse(userData) : null;
        console.log('Parsed userData:', data);

        // Get user type
        const userType = await AsyncStorage.getItem('userRole');
        const type = userType ? JSON.parse(userType) : null;
        console.log('UserType:', type);

        if (data) {
          if (type === 'customer') {
            navigation.navigate('customerTabs');
          } else if (type === 'contractor') {
            navigation.navigate('contractorTabs');
          } else if (type === 'architect') {
            navigation.navigate('architectTabs');
          } else {
            navigation.navigate('welcome');
          }
        } else {
          navigation.navigate('welcome');
        }
      } catch (error) {
        console.error('Error in getting user data:', error);
        navigation.navigate('welcome');
      }
    };

    navigateUser();
  }, [navigation]);

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
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backgroungImg: {
    flex: 1,
    backgroundColor: colors.Black,
    height: HEIGHT(100),
    width: WIDTH(100),
  },

  image: {
    marginTop: HEIGHT(6),
    marginBottom: HEIGHT(7),
  },

  text: {
    color: colors.White,
    width: WIDTH(45),
    fontFamily: Rochester,
    fontSize: FONTSIZE(4.5),
    textAlign: 'center',
    marginBottom: HEIGHT(12),
  },

  button: {
    justifyContent: 'center',
    padding: HEIGHT(0.5),
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(85),
    height: HEIGHT(8),
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.AuroraGreen,
    position: 'absolute',
    bottom: HEIGHT(5),
  },

  changeButtonClr: {
    justifyContent: 'center',
    padding: HEIGHT(0.5),
    alignItems: 'center',
    textAlign: 'center',
    width: WIDTH(85),
    height: HEIGHT(8),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.AuroraGreen,
    backgroundColor: 'rgb(65, 130, 112)',
    opacity: 0.7,
    position: 'absolute',
    bottom: HEIGHT(5),
  },

  buttonText: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    textAlign: 'center',
    color: colors.White,
  },

  changeButtonTextClr: {
    fontSize: 16,
    color: colors.Black,
    fontFamily: NotoSans_Bold,
    textAlign: 'center',
  },
});
