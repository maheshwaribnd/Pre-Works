import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import {useNavigation, useRoute} from '@react-navigation/native';
import COLOR from '../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomButton from '../../Component/CustomButton/CustomButton';
import ApiManager from '../../API/Api';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const userType = route.params?.userType;

  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    number: '',
    password: '',
  });

  const [error, setError] = useState({
    number: '',
    password: '',
  });

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const LoginAPI = () => {
    const params = {
      mobile_no: userData.number,
      password: userData.password,
      user_type: userType,
    };

    ApiManager.userLogin(params)
      .then(async res => {
        if (res?.data?.status === 200) {
          // await AsyncStorage.setItem(
          //   'userId',
          //   JSON.stringify(res?.data?.user_id),
          // );
          await AsyncStorage.setItem(
            'userId',
            JSON.stringify(res?.data?.user_id),
          );
          const storedUserId = await AsyncStorage.getItem('userId');

          if (userType === 'customer') {
            navigation.navigate('customerTabs');
          } else if (userType === 'contractor') {
            navigation.navigate('contractorTabs');
          } else if (userType === 'architect') {
            navigation.navigate('architectTabs');
          }
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: res?.data?.errors,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => console.log(err));
  };

  const onChange = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const LoginFunction = () => {
    if (validateForm()) {
      LoginAPI();
    } else {
      console.log('loginNotValidate');
    }
  };

  const validateForm = () => {
    let newErrors = {};

    if (!/^\d{10}$/.test(userData.number)) {
      newErrors.number = 'Enter a valid 10-digit number';
    }

    if (userData.password.length < 6) {
      newErrors.password = 'Passwords do not match';
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../assets/Imgs/logo.png')}
          height={20}
          width={20}
          style={{marginTop: HEIGHT(2)}}
        />
      </View>
      <Text style={styles.welcomeTxt}>Welcome</Text>

      <Text style={styles.txt}>Please Log in to continue</Text>

      <TextInput
        style={styles.InputField}
        placeholder="Enter Number"
        placeholderTextColor="gray"
        keyboardType="decimal-pad"
        value={userData.number}
        onChangeText={text => onChange('number', text)}
      />
      {error.number ? <Text style={{color: 'red'}}>{error.number}</Text> : null}

      <View style={styles.PasswordView}>
        <TextInput
          style={styles.PassInputField}
          placeholder="Enter password"
          placeholderTextColor="gray"
          keyboardType="default"
          value={userData.password}
          onChangeText={text => onChange('password', text)}
        />

        <Entypo
          name={showPassword ? 'eye' : 'eye-with-line'}
          onPress={showPasswordFunction}
          size={20}
          style={{paddingRight: WIDTH(3)}}
        />
      </View>

      {error.password ? (
        <Text style={{color: 'red'}}>{error.password}</Text>
      ) : null}

      <View style={{alignItems: 'flex-end'}}>
        <Text
          onPress={() => navigation.navigate('forgotpassword')}
          style={styles.forgot}>
          Forgot Password ?
        </Text>
      </View>

      <CustomButton name="LOGIN" onPress={() => LoginFunction()} />

      <View style={styles.forAskAccount}>
        <Text style={{color: COLOR.Gray}}>Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => {
            if (userType === 'customer') {
              navigation.navigate('customersignup');
            } else if (userType === 'contractor') {
              navigation.navigate('contractorsignup');
            } else if (userType === 'architect') {
              navigation.navigate('architectsignup');
            }
          }}>
          <Text style={styles.signupTxt}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
    justifyContent: 'center',
  },

  welcomeTxt: {
    fontSize: 26,
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

  signupTxt: {
    color: COLOR.TextLightColor,
    fontFamily: NotoSans_Medium,
    paddingBottom: HEIGHT(0.5),
  },

  PassInputField: {
    color: COLOR.Black,
    width: WIDTH(80),
    height: HEIGHT(6.5),
  },

  PasswordView: {
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

  InputField: {
    height: HEIGHT(7.5),
    marginVertical: HEIGHT(2),
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

  inputView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    marginTop: HEIGHT(0.5),
  },

  forgot: {
    fontSize: 14,
    fontFamily: NotoSans_Medium,
    color: COLOR.TextLightColor,
    textAlign: 'center',
  },

  forAskAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1.2),
  },
});
