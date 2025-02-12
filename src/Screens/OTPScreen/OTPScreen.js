import React, {useState} from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import OTPImg from '../../assets/Svg/OTPImg.svg';
import COLOR from '../../config/color.json';
import CustomButton from '../../Component/CustomButton/CustomButton';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import OtpInputs from 'react-native-otp-inputs';
import ApiManager from '../../API/Api';
import {useNavigation, useRoute} from '@react-navigation/native';
import Snackbar from 'react-native-snackbar';
import {useSelector} from 'react-redux';

const OTPScreen = () => {
  const typeSelector = useSelector(state => state.userTypee.usertype);

  const route = useRoute();
  const navigation = useNavigation();
  const custNumber = route.params?.mobile_no;

  const [otp, setOtp] = useState('');
  const [isValid, setIsValid] = useState(false);

  const onChangeOTP = otpValue => {
    if (/^\d{0,5}$/.test(otpValue)) {
      setOtp(otpValue);
      setIsValid(otpValue.length === 5);
    }
  };

  const OTPVerifyAPI = async () => {
    if (otp.length < 5) {
      Snackbar.show({
        text: 'Invalid OTP',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }

    const params = {
      mobile_no: custNumber,
      user_type: typeSelector,
      otp: otp,
    };

    ApiManager.otpVerify(params)
      .then(res => {
        if (res?.data?.status === 200) {
          if (typeSelector === 'customer') {
            console.log('Navigating to customerTabs');
            navigation.navigate('customerTabs');
          } else if (typeSelector === 'contractor') {
            console.log('Navigating to contractorTabs');
            navigation.navigate('contractorTabs');
          } else if (typeSelector === 'architect') {
            console.log('Navigating to architectTabs');
            navigation.navigate('architectTabs');
          }

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
        <OTPImg height={200} width={200} />
      </View>

      <Text style={styles.txt}>Enter OTP code sent to your number</Text>

      <View style={{marginVertical: HEIGHT(5)}}>
        <OtpInputs
          numberOfInputs={5}
          inputContainerStyles={styles.inputContainer}
          placeholderTextColor="gray"
          fontSize={FONTSIZE(3)}
          handleChange={onChangeOTP}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.txt}>Didn't receive OTP code?</Text>
      <Text style={[styles.txt, {color: '#1EA35A'}]}>Resend OTP</Text>

      <CustomButton
        name="VERIFY OTP"
        onPress={() => OTPVerifyAPI()}
        disabled={!isValid}
      />
    </ImageBackground>
  );
};

export default OTPScreen;

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
});
