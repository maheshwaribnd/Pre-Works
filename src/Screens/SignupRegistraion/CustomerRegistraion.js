import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  FONTSIZE,
  HEIGHT,
  NotoSans_Bold,
  NotoSans_Light,
  NotoSans_Medium,
  WIDTH,
} from '../../config/AppConst';
import {useNavigation} from '@react-navigation/native';
import COLOR from '../../config/color.json';
import Entypo from 'react-native-vector-icons/Entypo';
import Snackbar from 'react-native-snackbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ApiManager from '../../API/Api';
import CustomButton from '../../Component/CustomButton/CustomButton';
import {Badge} from 'react-native-paper';
import Octicons from 'react-native-vector-icons/Octicons';
import ApiManager from '../../API/Api';
import {launchImageLibrary} from 'react-native-image-picker';

const CustomerRegistraion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);
  const [userImage, setuserImage] = useState('');

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPw: '',
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPw: '',
    img: '',
  });

  const validateForm = () => {
    let newErrors = {};

    if (!userData.name.trim() || userData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      newErrors.email = 'Enter a valid email';
    }

    if (!/^\d{10}$/.test(userData.number)) {
      newErrors.number = 'Enter a valid 10-digit number';
    }

    if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (userData.confirmPw !== userData.password) {
      newErrors.confirmPw = 'Passwords do not match';
    }

    // if (!userData.img) {
    //   Snackbar.show({
    //     text: 'Upload Img',
    //     backgroundColor: '#D1264A',
    //     duration: Snackbar.LENGTH_SHORT,
    //   });
    // }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const onChange = (key, value) => {
    setUserData(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const SubmitButton = () => {
    if (validateForm()) {
      CustomerSignupAPI();
      navigation.navigate('otpscreen', {mobile_no: userData.number});
      console.log('Validate');
      // navigation.navigate('customerTabs');
    } else {
      console.log('notValidate');
    }
  };

  const selectImage = async () => {
    launchImageLibrary({quality: 0.7}, fileobj => {
      if (fileobj?.didCancel === true) {
        setuserImage('');
      } else {
        const img = fileobj?.assets[0]?.uri || '';
        setuserImage(img);
        setDocumentFile(fileobj?.assets);
      }
    });
  };

  const CustomerSignupAPI = async () => {
    const formData = new FormData();

    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('mobile_no', userData.number);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.confirmPw);
    if (documentFile !== null) {
      formData.append('profile_image', {
        uri: documentFile[0].uri,
        type: documentFile[0].type,
        name: documentFile[0].fileName,
      });
    } else {
      formData.append('profile_image', undefined);
    }
    console.log('CustomerformData', formData);

    await ApiManager.customerRegistration(formData)
      .then(async res => {
        console.log('rescust', res?.data);

        const simpleData = formData._parts.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

        // if (res?.data?.status == 200) {
        await AsyncStorage.setItem('CustomerData', JSON.stringify(simpleData));
        await AsyncStorage.setItem(
          'userId',
          JSON.stringify(res?.data?.user_id),
        );

        Snackbar.show({
          text: res?.data?.message,
          backgroundColor: '#27cc5d',
          duration: Snackbar.LENGTH_SHORT,
        });
        // } else {
        //   Snackbar.show({
        //     text: res?.data?.message,
        //     backgroundColor: '#D1264A',
        //     duration: Snackbar.LENGTH_SHORT,
        //   });
        // }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const navigation = useNavigation();

  // useEffect(() => {
  //   getToken();
  // }, []);

  // const getToken = async () => {
  //   let token = await messaging().getToken();
  //   setDeviceToken(token);
  //};

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordFunction = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={{paddingTop: HEIGHT(3), alignItems: 'center'}}>
          <Image
            style={{width: WIDTH(30), height: WIDTH(30), borderRadius: 50}}
            source={
              userImage == ''
                ? require('../../assets/Icons/avatar.jpg')
                : {uri: userImage}
            }
            resizeMode="cover"
          />
          <Badge onPress={() => selectImage()} size={32} style={styles.badge}>
            <Octicons size={18} name="pencil" />
          </Badge>
        </View>

        <View style={styles.titleView}>
          <Text style={styles.title}>Please enter your personal Info</Text>
        </View>
        <TextInput
          style={styles.InputField}
          placeholder="Name"
          placeholderTextColor="gray"
          keyboardType="default"
          value={userData.name}
          onChangeText={text => onChange('name', text)}
        />
        {error.name ? <Text style={{color: 'red'}}>{error.name}</Text> : null}

        <TextInput
          style={styles.InputField}
          placeholder="Mobile number"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={userData.number}
          onChangeText={text => onChange('number', text)}
        />
        {error.number ? (
          <Text style={{color: 'red'}}>{error.number}</Text>
        ) : null}

        <TextInput
          style={styles.InputField}
          placeholder="Email"
          placeholderTextColor="gray"
          keyboardType="default"
          value={userData.email}
          onChangeText={text => onChange('email', text)}

          // onBlur={emailValidationFunction}
        />
        {error.email ? <Text style={{color: 'red'}}>{error.email}</Text> : null}

        <View style={styles.PasswordView}>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="gray"
            value={userData.password}
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
            value={userData.confirmPw}
            onChangeText={text => onChange('confirmPw', text)}
            secureTextEntry={!showConfirmPassword}
          />

          <Entypo
            name={showConfirmPassword ? 'eye' : 'eye-with-line'}
            onPress={showConfirmPasswordFunction}
            size={20}
            style={{paddingRight: WIDTH(3)}}
          />
        </View>

        {error.confirmPw ? (
          <Text style={{color: 'red'}}>{error.confirmPw}</Text>
        ) : null}

        <View style={{marginTop: HEIGHT(1), justifyContent: 'center'}}>
          <TouchableOpacity style={{flexDirection: 'row', alignSelf: 'center'}}>
            <Text
              style={{
                textAlign: 'center',
                color: COLOR.MollyRobins,
                fontSize: 13,
              }}>
              Terms & Conditions
            </Text>
          </TouchableOpacity>

          {/* {TndCshowModal ? (
          <Modal
            isVisible={true}
            onBackdropPress={() => setTndCShowModal(false)}
            style={styles.TndCmodalWrap}>
            <Text style={styles.tNdcHeading}>Terms & Conditions</Text>
            <ScrollView>
              <Text
                style={{
                  color: COLOR.Black,
                  fontFamily: NotoSans_Medium,
                }}>
                {TndC}
              </Text>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={styles.okayBtn}
                  onPress={() => setTndCShowModal(false)}>
                  <Text style={styles.okayTxt}>Okay</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Modal>
        ) : null} */}
        </View>

        <CustomButton name="SUBMIT" onPress={() => SubmitButton()} />

        <View style={styles.forAskAccount}>
          <Text style={{color: COLOR.Gray}}>If you have an account? </Text>
          <Text
            style={{color: COLOR.MollyRobins}}
            onPress={() => navigation.navigate('login')}>
            Sign In
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default CustomerRegistraion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.White,
    paddingHorizontal: WIDTH(4),
  },

  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 16,
    fontFamily: NotoSans_Light,
    color: COLOR.Gray9,
    marginTop: HEIGHT(2),
    textAlign: 'center',
  },

  badge: {
    backgroundColor: COLOR.Gray,
    position: 'absolute',
    bottom: 0,
    right: 115,
  },

  subheadline: {
    fontSize: 14,
    marginTop: HEIGHT(0.5),
    color: COLOR.Gray9,
    fontFamily: NotoSans_Medium,
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

  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(94.5),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
    marginTop: HEIGHT(4),
  },

  horizontalWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1.8),
  },

  horizontalLine: {
    height: 1,
    width: WIDTH(30),
    backgroundColor: COLOR.Black,
  },

  logo: {
    marginLeft: HEIGHT(1),
    marginRight: HEIGHT(1),
    marginTop: HEIGHT(2),
  },

  forAskAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: HEIGHT(1.2),
  },

  TndCmodalWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: COLOR.White,
    padding: WIDTH(2),
    paddingTop: HEIGHT(3),
    width: WIDTH(90),
    height: HEIGHT(30),
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  otpmodalWrap: {
    padding: WIDTH(2),
    alignItems: 'center',
    backgroundColor: 'white',
    width: WIDTH(92),
    height: HEIGHT(32),
    borderWidth: 1,
    borderColor: COLOR.Gray,
    borderRadius: 20,
  },

  recentText: {
    alignItems: 'flex-start',
    width: WIDTH(80),
    marginTop: HEIGHT(6),
    marginVertical: 10,
  },

  verifyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(85),
    height: HEIGHT(7),
    borderRadius: 8,
    backgroundColor: COLOR.AuroraGreen,
    color: COLOR.ButtonNameColor,
  },

  btnText: {
    fontFamily: NotoSans_Bold,
    fontSize: 16,
    color: COLOR.ButtonNameColor,
  },

  tNdcHeading: {
    color: COLOR.Black,
    fontFamily: NotoSans_Bold,
    fontSize: FONTSIZE(3),
    textAlign: 'center',
  },

  okayBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: WIDTH(16),
    height: HEIGHT(5),
    borderRadius: 6,
    textAlign: 'center',
    backgroundColor: COLOR.AuroraGreen,
  },

  okayTxt: {
    textAlign: 'center',
    color: COLOR.Black,
  },
});
