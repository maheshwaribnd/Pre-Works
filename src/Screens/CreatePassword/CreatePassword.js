import React, {useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import OTPImg from '../../assets/Svg/OTPImg.svg';
import COLOR from '../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import CustomButton from '../../Component/CustomButton/CustomButton';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import OtpInputs from 'react-native-otp-inputs';
import ApiManager from '../../API/Api';
import {useNavigation, useRoute} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import ResetPassword from '../../assets/Svg/ResetPassword.svg';
import {useSelector} from 'react-redux';

const CreatePassword = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const typeSelector = useSelector(state => state.userTypee.usertype);
  const mobileNo = route?.path?.mobileNo;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [user, setUser] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState({
    password: '',
    confirmPassword: '',
  });

  const CreateFunction = async () => {
    if (validateForm()) {
      const response = await CreatePasswordAPI();
      if (response?.status === 200) {
        navigation.navigate('login');
      }
      console.log('Vali');
    } else {
      console.log('notVali');
    }
  };

  const CreatePasswordAPI = () => {
    const params = {
      mobile_no: mobileNo,
      user_type: typeSelector,
      password: user.password,
      password_confirmation: user.confirmPassword,
    };

    ApiManager.CreatePassword(params)
      .then(res => {
        if (res?.data?.status === 200) {
          console.log('createresponse', res?.data);
        }
      })
      .catch(err => console.log(err));
  };

  const validateForm = () => {
    let newErrors = {};

    if (user.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (user.confirmPassword !== user.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordFunction = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onChange = (key, value) => {
    setUser(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ResetPassword height={250} width={250} />
      </View>

      <Text style={styles.txt}>
        Your identity has been verified set your new password.
      </Text>

      <View style={styles.PasswordView}>
        <TextInput
          placeholder="New Password"
          placeholderTextColor="gray"
          value={user.password}
          style={styles.PassInputField}
          onChangeText={text => onChange('password', text)}
          secureTextEntry={!showPassword}
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

      <View style={styles.PasswordView}>
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="gray"
          style={styles.PassInputField}
          value={user.confirmPassword}
          onChangeText={text => onChange('confirmPassword', text)}
          secureTextEntry={!showConfirmPassword}
        />

        <Entypo
          name={showConfirmPassword ? 'eye' : 'eye-with-line'}
          onPress={showConfirmPasswordFunction}
          size={20}
          style={{paddingRight: WIDTH(3)}}
        />
      </View>

      {error.confirmPassword ? (
        <Text style={{color: 'red'}}>{error.confirmPassword}</Text>
      ) : null}

      <CustomButton
        name="CREATE"
        onPress={() => CreateFunction()}
        // disabled={!isValid}
      />
    </ImageBackground>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
    justifyContent: 'center',
  },
  txt: {
    fontSize: 16,
    fontFamily: NotoSans_Medium,
    color: COLOR.Gray9,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },
  inputContainer: {
    margin: 3,
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 10,
    color: COLOR.Black,
    borderColor: COLOR.Gray,
    width: WIDTH(15),
    height: HEIGHT(8),
  },

  InputField: {
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
});
