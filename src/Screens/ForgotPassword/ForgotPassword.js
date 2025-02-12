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
import {HEIGHT, NotoSans_Medium, WIDTH} from '../../config/AppConst';

const ForgotPassword = () => {
  const [number, setNumber] = useState(null);

  return (
    <ImageBackground
      source={require('../../assets/Imgs/Background.png')}
      style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Image
          source={require('../../assets/Imgs/forgotPw.png')}
          height={20}
          width={20}
          style={{marginTop: HEIGHT(2)}}
        />
      </View>

      <Text style={styles.txt}>
        Please provide mobile number for which you want to reset your password
      </Text>

      <TextInput
        style={styles.InputField}
        placeholder="Mobile number"
        keyboardType="number-pad"
        value={number}
        // onChangeText={emailOnChange}
        // onBlur={emailValidationFunction}
      />

      <CustomButton name="SEND OTP" />
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
