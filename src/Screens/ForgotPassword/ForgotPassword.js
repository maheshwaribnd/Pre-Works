import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomButton from '../../Component/CustomButton/CustomButton';
import COLOR from '../../config/color.json';
import ForgotPasswordSVG from '../../assets/Svg/forgotPassword.svg';
import {FONTSIZE, HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';
import ApiManager from '../../API/Api';
import {useSelector} from 'react-redux';
import Snackbar from 'react-native-snackbar';
import Modal from 'react-native-modal';
import {useNavigation} from '@react-navigation/native';
import OTPModalComponent from '../../Component/OTPModal/OtpModal';
import LinearGradient from 'react-native-linear-gradient';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const typeSelector = useSelector(state => state.userTypee.usertype);
  const [email, setEmail] = useState('');
  const [currentOTP, setCurrentOTP] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [DeviceToken, setDeviceToken] = useState('');
  const [timer, setTimer] = useState(59);

  // Get Token

  // useEffect(() => {
  //   getToken();
  // }, []);

  // const getToken = async () => {
  //   let token = await messaging().getToken();
  //   setDeviceToken(token);
  // };

  useEffect(() => {
    if (showModal) {
      let interval;

      if (timer > 0) {
        interval = setInterval(() => {
          setTimer(prevTimer => prevTimer - 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [showModal || timer]);

  const ForgotPasswordAPI = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      Snackbar.show({
        text: 'Please enter a email address',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_SHORT,
      });

      return;
    } else if (!emailRegex.test(email)) {
      Snackbar.show({
        text: 'Please enter a valid email address',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_SHORT,
      });
      return;
    }

    setLoading(true);

    const params = {
      email: email,
      user_type: typeSelector,
    };

    try {
      const res = await ApiManager.forgetPassword(params);

      if (res?.data?.status === 200) {
        Snackbar.show({
          text: res?.data?.message,
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });
        setShowModal(true);
        setLoading(false);
      } else {
        console.log('Error Response:', res?.data);
        Snackbar.show({
          text: res?.data?.message || 'Something went wrong!',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        console.log('Error Data:', error.response.data);
        console.log('Error Status:', error.response.status);
        console.log('Error Headers:', error.response.headers);
      } else if (error.request) {
        console.log('No Response:', error.request);
      } else {
        console.log('Error Message:', error.message);
      }

      Snackbar.show({
        text: 'Network error! Please try again.',
        backgroundColor: 'red',
        duration: Snackbar.LENGTH_SHORT,
      });
      setLoading(false);
    }
  };

  const handleOTPChange = async otp => {
    setCurrentOTP(otp);
    // if (currentOTP == userOTP && otp.length == 5) {
    //   Snackbar.show({
    //     text: 'OTP verified successfully. ',
    //     fontFamily: NotoSans_Medium,
    //     backgroundColor: '#19cf55',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    // }
  };

  const handleResendOTP = () => {
    setLoading(true);

    const params = {
      email: email,
      user_type: typeSelector,
    };
    setCurrentOTP('');
    ApiManager.ResendOtp(params).then(res => {
      if (res?.data?.status === 200) {
        // setUserOTP(res?.data?.otp);
        Snackbar.show({
          text: 'OTP sent successfully. ',
          fontFamily: NotoSans_Medium,
          backgroundColor: '#19cf55',
          duration: Snackbar.LENGTH_SHORT,
        });
        setLoading(false);
      }
    });
    setTimer(30);
  };

  const handleOTPSubmit = async () => {
    setLoading(true);
    if (currentOTP) {
      Snackbar.show({
        text: 'OTP verified successfully. ',
        fontFamily: NotoSans_Medium,
        backgroundColor: '#19cf55',
        duration: Snackbar.LENGTH_SHORT,
      });
      setLoading(false);
      navigation.navigate('createpassword', {email: email});
    } else {
      Snackbar.show({
        text: 'Incorrect OTP. Please enter the correct OTP. ',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <ForgotPasswordSVG height={240} width={240} />
      </View>

      <Text style={styles.txt}>
        Please provide email address for which you want to reset your password
      </Text>

      <TextInput
        style={styles.InputField}
        placeholder="Enter email address"
        placeholderTextColor={COLOR.Gray}
        value={email}
        keyboardType="default"
        onChangeText={text => setEmail(text)}
      />

      <CustomButton
        name="SEND OTP"
        onPress={() => ForgotPasswordAPI()}
        loading={loading}
        disabled={loading}
      />

      {showModal ? (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Modal
            isVisible={showModal}
            // onBackdropPress={() => setShowModal(false)}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.modalWrap}>
              <Text style={styles.subheadline}>Verify OTP</Text>

              <OTPModalComponent
                otp={currentOTP}
                setcurrentOTP={handleOTPChange}
              />

              <View style={styles.recentText}>
                {timer > 0 ? (
                  <Text style={{color: '#1EA35A'}}>
                    Resend OTP in: {timer} seconds
                  </Text>
                ) : (
                  <TouchableOpacity onPress={() => handleResendOTP()}>
                    <Text style={{color: '#1EA35A'}}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => handleOTPSubmit()}
                  disabled={loading}>
                  <LinearGradient
                    colors={['#0AD788', '#03A151']}
                    activeOpacity={0.4}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={styles.verifyButton}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.btnText}>Verify</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      ) : null}
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

  subheadline: {
    fontSize: 18,
    paddingLeft: 2,
    // marginTop: HEIGHT(2),
    color: COLOR.Black,
    fontFamily: NotoSans_Medium,
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

  modalWrap: {
    padding: WIDTH(2),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(92),
    height: HEIGHT(32),
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  btnText: {
    fontFamily: NotoSans_Medium,
    fontSize: FONTSIZE(2.1),
    color: COLOR.White,
  },

  verifyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(85),
    height: HEIGHT(7),
    // marginBottom: 2,
    borderRadius: 8,
    backgroundColor: COLOR.PrimaryLightColor,
    color: COLOR.ButtonNameColor,
  },

  recentText: {
    alignItems: 'flex-start',
    width: WIDTH(80),
    // marginTop: HEIGHT(4),
    marginVertical: 10,
  },
});
