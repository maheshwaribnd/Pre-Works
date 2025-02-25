import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useState} from 'react';
import CustomButton from '../../Component/CustomButton/CustomButton';
import COLOR from '../../config/color.json';
import ForgotPasswordSVG from '../../assets/Svg/forgotPassword.svg';
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import ApiManager from '../../API/Api';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';

const ForgotPassword = () => {
  const typeSelector = useSelector(state => state.userTypee.usertype);
  const [number, setNumber] = useState(null);

  const ForgotPasswordAPI = () => {
    const params = {
      mobile_no: number,
      user_type: typeSelector,
    };

    ApiManager.forgetPassword(params)
      .then(res => {
        if (res?.data?.status === 200) {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ForgotPasswordSVG height={240} width={240} />
      </View>

      <Text style={styles.txt}>
        Please provide mobile number for which you want to reset your password
      </Text>

      <TextInput
        style={styles.InputField}
        placeholder="+91 Mobile number"
        keyboardType="number-pad"
        value={number}
        onChangeText={text => setNumber(text)}
      />

      <CustomButton name="SEND OTP" onPress={() => ForgotPasswordAPI()} />
    </ImageBackground>
  );
};

export default ForgotPassword;

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

  signupTxt: {
    color: COLOR.TextLightColor,
    fontFamily: NotoSans_Medium,
    paddingBottom: HEIGHT(0.5),
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
});
