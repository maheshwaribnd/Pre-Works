import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Alert,
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
import {launchImageLibrary} from 'react-native-image-picker';
import ApiManager from '../../API/Api';

const ContractorRegistration = () => {
  const navigation = useNavigation();

  const [userImage, setuserImage] = useState('');
  const [profileDocumentFile, setProfileDocumentFile] = useState(null);
  const [uploadImg, setUploadImg] = useState('');
  const [uploadDocumentFile, setUploadDocumentFile] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    number: '',
    email: '',
    password: '',
    confirmPw: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    experience: '',
  });

  const [error, setError] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    confirmPw: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    experience: '',
  });

  const ContractorSignupAPI = async () => {
    const formData = new FormData();

    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('mobile_no', userData.number);
    formData.append('password', userData.password);
    formData.append('password_confirmation', userData.confirmPw);
    formData.append('address', userData.address);
    formData.append('city', userData.city);
    formData.append('state', userData.state);
    formData.append('experience', userData.experience);
    formData.append('pincode', userData.pincode);

    // profile photo
    if (profileDocumentFile !== null) {
      formData.append('profile_image', {
        uri: profileDocumentFile[0].uri,
        type: profileDocumentFile[0].type,
        name: profileDocumentFile[0].fileName,
      });
    } else {
      formData.append('profile_image', undefined);
    }

    // upload Img
    if (uploadDocumentFile !== null) {
      formData.append('upload_image', {
        uri: uploadDocumentFile[0].uri,
        type: uploadDocumentFile[0].type,
        name: uploadDocumentFile[0].fileName,
      });
    } else {
      formData.append('upload_image', undefined);
    }
    console.log('ContractorformData', formData);

    await ApiManager.contractorRegistration(formData)
      .then(async res => {
        const simpleData = formData._parts.reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

        if (res?.data?.status == 200) {
          await AsyncStorage.setItem(
            'ContractorData',
            JSON.stringify(simpleData),
          );
          await AsyncStorage.setItem(
            'contractoruserId',
            JSON.stringify(res?.data?.user_id),
          );

          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#27cc5d',
            duration: Snackbar.LENGTH_SHORT,
          });
        } else {
          Snackbar.show({
            text: res?.data?.message,
            backgroundColor: '#D1264A',
            duration: Snackbar.LENGTH_SHORT,
          });
        }
      })
      .catch(err => {
        console.log('error', err);
      });
  };

  const validateForm = () => {
    let newErrors = {...error}; // Preserve existing structure

    // Name validation
    if (!/^[A-Za-z\s]{3,}$/.test(userData.name.trim())) {
      newErrors.name = 'Name must be at least 3 characters long';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      newErrors.email = 'Enter a valid email';
    } else {
      newErrors.email = '';
    }

    // Phone number validation (10 digits)
    if (!/^\d{10}$/.test(userData.number)) {
      newErrors.number = 'Enter a valid 10-digit number';
    } else {
      newErrors.number = '';
    }

    // Password validation (minimum 6 characters)
    if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    } else {
      newErrors.password = '';
    }

    // Confirm password validation
    if (userData.confirmPw !== userData.password) {
      newErrors.confirmPw = 'Passwords do not match';
    } else {
      newErrors.confirmPw = '';
    }

    // Address validation
    if (!userData.address.trim()) {
      newErrors.address = 'Address is required';
    } else {
      newErrors.address = '';
    }

    // City validation
    if (!userData.city.trim()) {
      newErrors.city = 'City is required';
    } else {
      newErrors.city = '';
    }

    // State validation
    if (!userData.state.trim()) {
      newErrors.state = 'State is required';
    } else {
      newErrors.state = '';
    }

    // Pincode validation (6 digits)
    if (!/^\d{6}$/.test(userData.pincode)) {
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    } else {
      newErrors.pincode = '';
    }

    // Experience validation (should be a number and non-negative)
    if (
      !/^\d+$/.test(userData.experience) ||
      parseInt(userData.experience, 10) < 0
    ) {
      newErrors.experience = 'Enter a valid experience in years';
    } else {
      newErrors.experience = '';
    }

    if (!userImage) {
      Snackbar.show({
        text: 'Upload Img',
        backgroundColor: '#D1264A',
        duration: Snackbar.LENGTH_SHORT,
      });
      newErrors.img = 'Upload Img';
    }

    // Update error state
    setError(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every(error => error === '');
  };

  const SubmitButton = () => {
    if (validateForm()) {
      ContractorSignupAPI();
      console.log('Validate');
      navigation.navigate('otpscreen', {mobile_no: userData.number});
      // navigation.navigate('contractorTabs');
    } else {
      console.log('notValidate');
    }
  };

  const onChange = (key, value) => {
    let filteredValue = value;

    if (
      key === 'name' ||
      key === 'number' ||
      key === 'address' ||
      key === 'city' ||
      key === 'state'
    ) {
      filteredValue = value.replace(/\./g, '');
    }

    setUserData(prev => ({
      ...prev,
      [key]: filteredValue,
    }));
  };

  const handleUpload = async () => {
    launchImageLibrary({quality: 0.7, mediaType: 'photo'}, response => {
      if (response.didCancel) {
        setUploadImg('');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const img = response.assets[0].uri;
        setUploadImg(img);
        setUploadDocumentFile(response.assets);
      }
    });
  };

  const selectImage = async () => {
    launchImageLibrary({quality: 0.7}, fileobj => {
      if (fileobj?.didCancel === true) {
        setuserImage('');
        setUserData(prev => ({...prev, img: ''})); // Update userData
      } else {
        const img = fileobj?.assets[0]?.uri || '';
        setuserImage(img);
        setUserData(prev => ({...prev, img})); // Update userData
        setProfileDocumentFile(fileobj?.assets);
      }
    });
  };

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
          keyboardType="default"
          placeholderTextColor="gray"
          value={userData.name}
          onChangeText={text => onChange('name', text)}
        />
        {error.name ? <Text style={{color: 'red'}}>{error.name}</Text> : null}

        <TextInput
          style={styles.InputField}
          placeholder="Mobile number"
          keyboardType="numeric"
          placeholderTextColor="gray"
          value={userData.number}
          onChangeText={text => onChange('number', text)}
        />
        {error.number ? (
          <Text style={{color: 'red'}}>{error.number}</Text>
        ) : null}

        <TextInput
          style={styles.InputField}
          placeholder="Email"
          keyboardType="default"
          placeholderTextColor="gray"
          value={userData.email}
          onChangeText={text => onChange('email', text)}
        />
        {error.email ? <Text style={{color: 'red'}}>{error.email}</Text> : null}

        <View style={styles.passwordView}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="gray"
            value={userData.password}
            onChangeText={text => onChange('password', text)}
            style={styles.PassInputField}
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

        <View style={styles.passwordView}>
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="gray"
            value={userData.confirmPw}
            onChangeText={text => onChange('confirmPw', text)}
            style={styles.PassInputField}
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

        <TextInput
          style={styles.InputField}
          placeholder="Address 1"
          placeholderTextColor="gray"
          keyboardType="default"
          value={userData.address}
          onChangeText={text => onChange('address', text)}
        />

        {error.address ? (
          <Text style={{color: 'red'}}>{error.address}</Text>
        ) : null}

        <View style={styles.experienceView}>
          <TextInput
            style={[styles.InputField, {width: WIDTH(44)}]}
            placeholder="City"
            placeholderTextColor="gray"
            keyboardType="default"
            value={userData.city}
            onChangeText={text => onChange('city', text)}
          />
          <TextInput
            style={[styles.InputField, {width: WIDTH(44)}]}
            placeholder="State"
            placeholderTextColor="gray"
            keyboardType="default"
            value={userData.state}
            onChangeText={text => onChange('state', text)}
          />
        </View>

        <View style={styles.experienceView}>
          <TextInput
            style={[styles.InputField, {width: WIDTH(44)}]}
            placeholder="Pincode"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={userData.pincode}
            onChangeText={text => onChange('pincode', text)}
          />
          <TextInput
            style={[styles.InputField, {width: WIDTH(44)}]}
            placeholder="Experience"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={userData.experience}
            onChangeText={text => onChange('experience', text)}
          />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              marginVertical: HEIGHT(1),
              backgroundColor: '#fff',
            }}
            onPress={handleUpload}
            activeOpacity={0.9}>
            <View style={styles.uploadView}>
              <Text style={styles.icon}>☁️</Text>
              <Text style={styles.uploadTxt}>Upload Preview Work Images</Text>
            </View>
          </TouchableOpacity>

          <View>
            {uploadImg ? (
              <Image
                source={{uri: uploadImg}}
                style={{width: 70, height: 70}}
              />
            ) : null}
          </View>
        </View>

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

export default ContractorRegistration;

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

  passwordView: {
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

  uploadView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLOR.Gray,
    color: COLOR.black,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },

  uploadTxt: {
    fontFamily: NotoSans_Light,
    fontSize: 11,
    color: COLOR.Gray9,
    width: WIDTH(25),
    textAlign: 'center',
  },
  forAskAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: HEIGHT(1.2),
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

  experienceView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
});
