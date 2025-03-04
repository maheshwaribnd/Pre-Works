import React, {useEffect, useState} from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const mobileNumber = route.params?.mobile_no;

  const [otp, setOtp] = useState('');

  const [isValid, setIsValid] = useState(false);
  const [timer, setTimer] = useState(59);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

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
      return; // Stop execution if OTP is invalid
    }

    const params = {
      mobile_no: mobileNumber,
      user_type: typeSelector,
      otp: otp,
    };

    try {
      const res = await ApiManager.otpVerify(params);

      if (res?.data?.status === 200) {
        Snackbar.show({
          text: res?.data?.message,
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });

        // Navigate based on user type
        if (typeSelector === 'customer') {
          navigation.replace('customerTabs');
        } else if (typeSelector === 'contractor') {
          navigation.replace('contractorTabs');
        } else if (typeSelector === 'architect') {
          navigation.replace('architectTabs');
        }
      } else {
        Snackbar.show({
          text: res?.data?.message || 'Invalid OTP',
          backgroundColor: '#D1264A',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    } catch (err) {
      Snackbar.show({
        text: err?.response?.data?.message || 'Something went wrong',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const ResendOtpAPI = () => {
    const params = {
      mobile_no: mobileNumber,
      user_type: typeSelector,
    };

    ApiManager.ResendOtp(params).then(res => {
      if (res?.data?.status === 200) {
        // setUserOTP(res?.data?.otp);
        Snackbar.show({
          text: 'OTP sent successfully. ',
          fontFamily: NotoSans_Medium,
          backgroundColor: '#19cf55',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    });
    setTimer(30);
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
      <View style={styles.recentText}>
        {timer > 0 ? (
          <Text style={{color: '#1EA35A'}}>Resend OTP in: {timer} seconds</Text>
        ) : (
          <TouchableOpacity onPress={() => ResendOtpAPI()}>
            <Text style={[styles.txt, {color: '#1EA35A'}]}>Resend OTP</Text>
          </TouchableOpacity>
        )}
      </View>

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

  recentText: {
    alignItems: 'center',
    width: WIDTH(90),
    // marginTop: HEIGHT(4),
    marginVertical: 10,
  },
});
